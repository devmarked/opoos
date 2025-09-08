'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  }

  return (
    <Loader2 className={`animate-spin ${sizeClasses[size]} ${className}`} />
  )
}

export function PageLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" className="text-blue-600 mx-auto mb-4" />
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  )
}

export function CardSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardHeader>
        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-300 rounded w-1/2"></div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="h-3 bg-gray-300 rounded w-full"></div>
          <div className="h-3 bg-gray-300 rounded w-5/6"></div>
          <div className="h-3 bg-gray-300 rounded w-4/6"></div>
        </div>
      </CardContent>
    </Card>
  )
}

export function ProjectCardSkeleton() {
  return (
    <Card className="animate-pulse h-48">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="h-5 bg-gray-300 rounded w-3/4"></div>
          <div className="h-6 bg-gray-300 rounded w-16"></div>
        </div>
        <div className="h-3 bg-gray-300 rounded w-full mt-2"></div>
        <div className="h-3 bg-gray-300 rounded w-2/3"></div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 bg-gray-300 rounded"></div>
            <div className="h-3 bg-gray-300 rounded w-24"></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 bg-gray-300 rounded"></div>
            <div className="h-3 bg-gray-300 rounded w-32"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-3 border rounded-lg animate-pulse">
          <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-3 bg-gray-300 rounded w-1/2"></div>
          </div>
          <div className="h-6 bg-gray-300 rounded w-16"></div>
        </div>
      ))}
    </div>
  )
}

export function FormSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardHeader>
        <div className="h-6 bg-gray-300 rounded w-1/3 mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-2/3"></div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
          <div className="h-10 bg-gray-300 rounded w-full"></div>
        </div>
        <div>
          <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
          <div className="h-24 bg-gray-300 rounded w-full"></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
            <div className="h-10 bg-gray-300 rounded w-full"></div>
          </div>
          <div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
            <div className="h-10 bg-gray-300 rounded w-full"></div>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <div className="h-9 bg-gray-300 rounded w-20"></div>
          <div className="h-9 bg-gray-300 rounded w-28"></div>
        </div>
      </CardContent>
    </Card>
  )
}
