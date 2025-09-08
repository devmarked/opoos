// Simple in-memory cache that persists for the session
class SessionCache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>()

  set(key: string, data: any, ttl: number = 5 * 60 * 1000) { // 5 minutes default
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    })
  }

  get(key: string) {
    const entry = this.cache.get(key)
    if (!entry) return null

    const now = Date.now()
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key)
      return null
    }

    return entry.data
  }

  invalidate(key: string) {
    this.cache.delete(key)
  }

  invalidatePattern(pattern: string) {
    const regex = new RegExp(pattern.replace(/\*/g, '.*'))
    const keys = Array.from(this.cache.keys())
    for (const key of keys) {
      if (regex.test(key)) {
        this.cache.delete(key)
      }
    }
  }

  clear() {
    this.cache.clear()
  }
}

// Global session cache instance
export const sessionCache = new SessionCache()

// Cache keys
export const CACHE_KEYS = {
  PROJECTS: 'projects:sidebar',
  PROFILE: (userId: string) => `profile:${userId}`,
} as const
