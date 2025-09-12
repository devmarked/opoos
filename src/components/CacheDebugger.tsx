'use client'

import { useCache } from '@/contexts/CacheContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export function CacheDebugger() {
  const cache = useCache()
  const cacheInfo = cache.getCacheInfo()

  const clearCache = () => {
    cache.clear()
  }

  const invalidateProjects = () => {
    cache.invalidatePattern('projects:')
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-sm">Cache Debugger</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Cache Size:</span>
          <Badge variant="outline">{cacheInfo.size}</Badge>
        </div>
        
        <div>
          <span className="text-sm text-gray-600">Cached Keys:</span>
          <div className="mt-2 space-y-1">
            {cacheInfo.keys.length === 0 ? (
              <p className="text-xs text-gray-500">No cached data</p>
            ) : (
              cacheInfo.keys.map((key) => (
                <div key={key} className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                  {key}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={invalidateProjects}>
            Clear Projects
          </Button>
          <Button size="sm" variant="destructive" onClick={clearCache}>
            Clear All
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}











