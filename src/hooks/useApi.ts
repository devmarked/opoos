'use client'

import React, { useState, useCallback } from 'react'
import { sessionCache, CACHE_KEYS } from '@/lib/session-cache'
import { useAuth } from '@/contexts/AuthContext'
import { useProjects as useProjectsContext } from '@/contexts/ProjectsContext'

interface ApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

interface ApiError {
  message: string
  status?: number
  code?: string
}

export function useApi<T = any>() {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null
  })

  const execute = useCallback(async (
    apiCall: () => Promise<Response>,
    options?: {
      onSuccess?: (data: T) => void
      onError?: (error: ApiError) => void
      transform?: (data: any) => T
    }
  ) => {
    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const response = await apiCall()
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const error: ApiError = {
          message: errorData.error || `HTTP ${response.status}: ${response.statusText}`,
          status: response.status,
          code: errorData.code
        }
        
        setState(prev => ({ ...prev, loading: false, error: error.message }))
        options?.onError?.(error)
        return { success: false, error }
      }

      const responseData = await response.json()
      const transformedData = options?.transform ? options.transform(responseData) : responseData
      
      setState({
        data: transformedData,
        loading: false,
        error: null
      })
      
      options?.onSuccess?.(transformedData)
      return { success: true, data: transformedData }
    } catch (error) {
      const apiError: ApiError = {
        message: error instanceof Error ? error.message : 'Network error occurred'
      }
      
      setState(prev => ({ ...prev, loading: false, error: apiError.message }))
      options?.onError?.(apiError)
      return { success: false, error: apiError }
    }
  }, [])

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null })
  }, [])

  return {
    ...state,
    execute,
    reset
  }
}

// Specialized hooks for common operations
export function useProjects() {
  const api = useApi()

  const fetchProjects = useCallback(() => {
    return api.execute(() => fetch('/api/projects'))
  }, [api.execute])

  const createProject = useCallback((projectData: any) => {
    return api.execute(() => 
      fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData)
      })
    )
  }, [api.execute])

  const deleteProject = useCallback((projectId: string) => {
    return api.execute(() => 
      fetch(`/api/projects/${projectId}`, {
        method: 'DELETE'
      })
    )
  }, [api.execute])

  return {
    ...api,
    fetchProjects,
    createProject,
    deleteProject
  }
}

export function useProjectData(projectId: string) {
  const api = useApi()

  const fetchProject = useCallback(() => {
    return api.execute(() => fetch(`/api/projects/${projectId}`))
  }, [api, projectId])

  const fetchEntries = useCallback(() => {
    return api.execute(() => fetch(`/api/projects/${projectId}/entries`))
  }, [api, projectId])

  const fetchFiles = useCallback(() => {
    return api.execute(() => fetch(`/api/projects/${projectId}/files`))
  }, [api, projectId])

  const fetchProposals = useCallback(() => {
    return api.execute(() => fetch(`/api/projects/${projectId}/proposals`))
  }, [api, projectId])

  const addEntry = useCallback((entryData: any) => {
    return api.execute(() => 
      fetch(`/api/projects/${projectId}/entries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entryData)
      })
    )
  }, [api, projectId])

  const uploadFile = useCallback((formData: FormData) => {
    return api.execute(() => 
      fetch(`/api/projects/${projectId}/files`, {
        method: 'POST',
        body: formData
      })
    )
  }, [api, projectId])

  const generateProposal = useCallback(() => {
    return api.execute(() => 
      fetch(`/api/projects/${projectId}/proposals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
    )
  }, [api, projectId])

  return {
    ...api,
    fetchProject,
    fetchEntries,
    fetchFiles,
    fetchProposals,
    addEntry,
    uploadFile,
    generateProposal
  }
}

// Hook for sidebar projects with session caching
export function useSidebarProjects() {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  const fetchProjects = useCallback(async (forceRefresh = false) => {
    // Check cache first (unless force refresh)
    if (!forceRefresh) {
      const cached = sessionCache.get(CACHE_KEYS.PROJECTS)
      if (cached) {
        setProjects(cached)
        setLoading(false)
        return
      }
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/projects')
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      const data = await response.json()
      const projectsData = data.projects || []
      
      setProjects(projectsData)
      sessionCache.set(CACHE_KEYS.PROJECTS, projectsData, 5 * 60 * 1000) // 5 minutes
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch projects')
    } finally {
      setLoading(false)
    }
  }, [])

  // Auto-fetch projects on mount and clear when user logs out
  React.useEffect(() => {
    if (user) {
      fetchProjects()
    } else {
      // Clear projects when user logs out
      setProjects([])
      setLoading(false)
      setError(null)
      sessionCache.invalidate(CACHE_KEYS.PROJECTS)
    }
  }, [user, fetchProjects])

  return {
    projects,
    loading,
    error,
    fetchProjects
  }
}

// Hook for sidebar projects with automatic refresh on project updates
export function useSidebarProjectsWithRefresh() {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const { subscribeToProjectsUpdate } = useProjectsContext()

  const fetchProjects = useCallback(async (forceRefresh = false) => {
    // Check cache first (unless force refresh)
    if (!forceRefresh) {
      const cached = sessionCache.get(CACHE_KEYS.PROJECTS)
      if (cached) {
        setProjects(cached)
        setLoading(false)
        return
      }
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/projects')
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      const data = await response.json()
      const projectsData = data.projects || []
      
      setProjects(projectsData)
      sessionCache.set(CACHE_KEYS.PROJECTS, projectsData, 5 * 60 * 1000) // 5 minutes
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch projects')
    } finally {
      setLoading(false)
    }
  }, [])

  // Auto-fetch projects on mount and clear when user logs out
  React.useEffect(() => {
    if (user) {
      fetchProjects()
    } else {
      // Clear projects when user logs out
      setProjects([])
      setLoading(false)
      setError(null)
      sessionCache.invalidate(CACHE_KEYS.PROJECTS)
    }
  }, [user, fetchProjects])

  // Subscribe to project updates
  React.useEffect(() => {
    const unsubscribe = subscribeToProjectsUpdate(() => {
      // Force refresh when projects are updated
      fetchProjects(true)
    })

    return unsubscribe
  }, [subscribeToProjectsUpdate, fetchProjects])

  return {
    projects,
    loading,
    error,
    fetchProjects
  }
}


// Error handling utilities
export function getErrorMessage(error: unknown): string {
  if (typeof error === 'string') return error
  if (error instanceof Error) return error.message
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message)
  }
  return 'An unexpected error occurred'
}

export function isNetworkError(error: unknown): boolean {
  if (error instanceof Error) {
    return error.message.includes('fetch') || 
           error.message.includes('network') ||
           error.message.includes('Failed to fetch')
  }
  return false
}

export function getStatusCodeError(status: number): string {
  switch (status) {
    case 400:
      return 'Bad request. Please check your input.'
    case 401:
      return 'You are not authorized. Please log in.'
    case 403:
      return 'You do not have permission to perform this action.'
    case 404:
      return 'The requested resource was not found.'
    case 409:
      return 'There was a conflict with your request.'
    case 422:
      return 'The data provided is invalid.'
    case 429:
      return 'Too many requests. Please try again later.'
    case 500:
      return 'Internal server error. Please try again later.'
    case 502:
    case 503:
    case 504:
      return 'Service temporarily unavailable. Please try again later.'
    default:
      return `Request failed with status ${status}`
  }
}
