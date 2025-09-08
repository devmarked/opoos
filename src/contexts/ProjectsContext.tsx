'use client'

import React, { createContext, useContext, useCallback, useRef, ReactNode } from 'react'

interface ProjectsContextType {
  refreshProjects: () => void
  subscribeToProjectsUpdate: (callback: () => void) => () => void
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined)

export function ProjectsProvider({ children }: { children: ReactNode }) {
  const subscribersRef = useRef<Set<() => void>>(new Set())

  const refreshProjects = useCallback(() => {
    // Notify all subscribers that projects should be refreshed
    subscribersRef.current.forEach(callback => {
      try {
        callback()
      } catch (error) {
        console.error('Error in projects update callback:', error)
      }
    })
  }, [])

  const subscribeToProjectsUpdate = useCallback((callback: () => void) => {
    subscribersRef.current.add(callback)
    
    // Return unsubscribe function
    return () => {
      subscribersRef.current.delete(callback)
    }
  }, [])

  const value: ProjectsContextType = {
    refreshProjects,
    subscribeToProjectsUpdate,
  }

  return <ProjectsContext.Provider value={value}>{children}</ProjectsContext.Provider>
}

export function useProjects() {
  const context = useContext(ProjectsContext)
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectsProvider')
  }
  return context
}







