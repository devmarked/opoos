'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  AlertTriangle, 
  RefreshCw, 
  Wifi, 
  Server, 
  Shield, 
  Search,
  FolderOpen,
  FileX
} from 'lucide-react'

interface ErrorStateProps {
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
  icon?: React.ComponentType<{ className?: string }>
}

export function ErrorState({ title, description, action, icon: Icon = AlertTriangle }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <Icon className="h-6 w-6 text-red-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-md">{description}</p>
      {action && (
        <Button onClick={action.onClick}>
          <RefreshCw className="h-4 w-4 mr-2" />
          {action.label}
        </Button>
      )}
    </div>
  )
}

export function NetworkError({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorState
      title="Connection Error"
      description="Unable to connect to the server. Please check your internet connection and try again."
      icon={Wifi}
      action={onRetry ? { label: 'Try Again', onClick: onRetry } : undefined}
    />
  )
}

export function ServerError({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorState
      title="Server Error"
      description="Something went wrong on our end. We're working to fix this issue. Please try again in a few minutes."
      icon={Server}
      action={onRetry ? { label: 'Try Again', onClick: onRetry } : undefined}
    />
  )
}

export function UnauthorizedError() {
  return (
    <ErrorState
      title="Access Denied"
      description="You don't have permission to access this resource. Please log in or contact support."
      icon={Shield}
      action={{ label: 'Go to Login', onClick: () => window.location.href = '/auth' }}
    />
  )
}

export function NotFoundError({ resource = 'resource' }: { resource?: string }) {
  return (
    <ErrorState
      title={`${resource.charAt(0).toUpperCase() + resource.slice(1)} Not Found`}
      description={`The ${resource} you're looking for doesn't exist or may have been removed.`}
      icon={Search}
      action={{ label: 'Go Back', onClick: () => window.history.back() }}
    />
  )
}

export function EmptyState({ 
  title, 
  description, 
  action,
  icon: Icon = FolderOpen 
}: {
  title: string
  description: string
  action?: { label: string; onClick: () => void }
  icon?: React.ComponentType<{ className?: string }>
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Icon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-md">{description}</p>
      {action && (
        <Button onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  )
}

export function FileUploadError({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorState
      title="Upload Failed"
      description="Failed to upload the file. Please check the file size and format, then try again."
      icon={FileX}
      action={onRetry ? { label: 'Try Again', onClick: onRetry } : undefined}
    />
  )
}

export function ValidationError({ errors }: { errors: string[] }) {
  return (
    <Card className="border-red-200 bg-red-50">
      <CardHeader>
        <CardTitle className="text-red-800 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Validation Error
        </CardTitle>
        <CardDescription className="text-red-700">
          Please fix the following issues:
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="list-disc list-inside space-y-1 text-sm text-red-700">
          {errors.map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
