'use client'

import React, { createContext, useContext, useCallback, useRef, ReactNode } from 'react'

interface CacheEntry<T = any> {
  data: T
  timestamp: number
  ttl: number
}

interface CacheContextType {
  get: <T>(key: string) => T | null
  set: <T>(key: string, data: T, ttl?: number) => void
  invalidate: (key: string | string[]) => void
  invalidatePattern: (pattern: string) => void
  clear: () => void
  getCacheInfo: () => { size: number; keys: string[] }
}

const CacheContext = createContext<CacheContextType | undefined>(undefined)

// Default TTL values (in milliseconds)
const DEFAULT_TTL = {
  projects: 5 * 60 * 1000, // 5 minutes
  profile: 10 * 60 * 1000, // 10 minutes
  user: 15 * 60 * 1000, // 15 minutes
  default: 2 * 60 * 1000, // 2 minutes
}

export function CacheProvider({ children }: { children: ReactNode }) {
  const cacheRef = useRef<Map<string, CacheEntry>>(new Map())

  const get = useCallback(<T,>(key: string): T | null => {
    const entry = cacheRef.current.get(key)
    if (!entry) return null

    const now = Date.now()
    if (now - entry.timestamp > entry.ttl) {
      // Entry has expired
      cacheRef.current.delete(key)
      return null
    }

    return entry.data as T
  }, [])

  const set = useCallback(<T,>(key: string, data: T, ttl?: number) => {
    const now = Date.now()
    const defaultTtl = key.startsWith('projects:') ? DEFAULT_TTL.projects :
                      key.startsWith('profile:') ? DEFAULT_TTL.profile :
                      key.startsWith('user:') ? DEFAULT_TTL.user :
                      DEFAULT_TTL.default

    cacheRef.current.set(key, {
      data,
      timestamp: now,
      ttl: ttl || defaultTtl,
    })
  }, [])

  const invalidate = useCallback((key: string | string[]) => {
    const keys = Array.isArray(key) ? key : [key]
    keys.forEach(k => cacheRef.current.delete(k))
  }, [])

  const invalidatePattern = useCallback((pattern: string) => {
    const regex = new RegExp(pattern.replace(/\*/g, '.*'))
    const keysToDelete: string[] = []
    
    // Convert iterator to array to avoid downlevelIteration issue
    const keys = Array.from(cacheRef.current.keys())
    for (const key of keys) {
      if (regex.test(key)) {
        keysToDelete.push(key)
      }
    }
    
    keysToDelete.forEach(key => cacheRef.current.delete(key))
  }, [])

  const clear = useCallback(() => {
    cacheRef.current.clear()
  }, [])

  const getCacheInfo = useCallback(() => {
    return {
      size: cacheRef.current.size,
      keys: Array.from(cacheRef.current.keys()),
    }
  }, [])

  const value: CacheContextType = {
    get,
    set,
    invalidate,
    invalidatePattern,
    clear,
    getCacheInfo,
  }

  return <CacheContext.Provider value={value}>{children}</CacheContext.Provider>
}

export function useCache() {
  const context = useContext(CacheContext)
  if (context === undefined) {
    throw new Error('useCache must be used within a CacheProvider')
  }
  return context
}

// Hook for cached API calls with stale-while-revalidate pattern
export function useCachedApi<T>(
  key: string,
  fetcher: () => Promise<T>,
  options?: {
    ttl?: number
    revalidateOnMount?: boolean
    onSuccess?: (data: T) => void
    onError?: (error: Error) => void
  }
) {
  const cache = useCache()
  const { ttl, revalidateOnMount = true, onSuccess, onError } = options || {}
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<Error | null>(null)
  const [data, setData] = React.useState<T | null>(null)
  const [initialized, setInitialized] = React.useState(false)

  const execute = useCallback(async (forceRefresh = false) => {
    // Try to get from cache first (unless force refresh)
    if (!forceRefresh) {
      const cached = cache.get<T>(key)
      if (cached) {
        setData(cached)
        onSuccess?.(cached)
        return { success: true, data: cached, fromCache: true }
      }
    }

    setLoading(true)
    setError(null)

    try {
      const fetchedData = await fetcher()
      cache.set(key, fetchedData, ttl)
      setData(fetchedData)
      onSuccess?.(fetchedData)
      return { success: true, data: fetchedData, fromCache: false }
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error')
      setError(err)
      onError?.(err)
      return { success: false, error: err }
    } finally {
      setLoading(false)
    }
  }, [key, fetcher, cache, ttl, onSuccess, onError])

  // Initialize data from cache and fetch if needed
  React.useEffect(() => {
    if (initialized) return

    const cached = cache.get<T>(key)
    if (cached) {
      console.log(`useCachedApi: Loading ${key} from cache:`, cached)
      setData(cached)
      setLoading(false)
      setInitialized(true)
      onSuccess?.(cached)
    } else if (revalidateOnMount) {
      console.log(`useCachedApi: No cache for ${key}, fetching from API`)
      execute(false)
      setInitialized(true)
    } else {
      setInitialized(true)
    }
  }, [key, cache, revalidateOnMount, execute, initialized, onSuccess])

  return {
    data,
    loading,
    error,
    execute,
    invalidate: () => {
      cache.invalidate(key)
      setData(null)
    },
  }
}
