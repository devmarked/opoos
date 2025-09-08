'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  FileText, 
  Upload, 
  Zap, 
  Clock,
  User,
  Calendar
} from 'lucide-react'

interface ActivityItem {
  id: string
  type: 'entry' | 'file' | 'proposal'
  title: string
  project_id?: string
  created_at: string
  entry_type?: string
  file_type?: string
  status?: string
}

interface RecentActivityProps {
  activity: ActivityItem[]
  isLoading: boolean
}

export default function RecentActivity({ activity, isLoading }: RecentActivityProps) {
  const getActivityIcon = (type: string, subType?: string) => {
    switch (type) {
      case 'entry':
        return FileText
      case 'file':
        return Upload
      case 'proposal':
        return Zap
      default:
        return Clock
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'entry':
        return 'text-blue-600'
      case 'file':
        return 'text-green-600'
      case 'proposal':
        return 'text-purple-600'
      default:
        return 'text-gray-600'
    }
  }

  const getActivityDescription = (item: ActivityItem) => {
    switch (item.type) {
      case 'entry':
        return `Added ${item.entry_type || 'entry'}`
      case 'file':
        return `Uploaded ${item.file_type || 'file'}`
      case 'proposal':
        return `Generated proposal`
      default:
        return 'Activity'
    }
  }

  const getBadgeColor = (type: string, subType?: string) => {
    if (type === 'entry') {
      switch (subType) {
        case 'meeting':
          return 'bg-blue-100 text-blue-800'
        case 'note':
          return 'bg-green-100 text-green-800'
        case 'requirement':
          return 'bg-purple-100 text-purple-800'
        case 'feedback':
          return 'bg-orange-100 text-orange-800'
        default:
          return 'bg-gray-100 text-gray-800'
      }
    }
    if (type === 'file') {
      switch (subType) {
        case 'image':
          return 'bg-pink-100 text-pink-800'
        case 'document':
          return 'bg-blue-100 text-blue-800'
        case 'audio':
          return 'bg-green-100 text-green-800'
        default:
          return 'bg-gray-100 text-gray-800'
      }
    }
    return 'bg-gray-100 text-gray-800'
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-1"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                </div>
                <div className="h-6 bg-gray-300 rounded w-16"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activity.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No recent activity</p>
            <p className="text-sm text-gray-500 mt-1">
              Start by creating a project or adding some content
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {activity.slice(0, 10).map((item) => {
              const Icon = getActivityIcon(item.type, item.entry_type || item.file_type)
              return (
                <div key={item.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className={`p-2 rounded-full bg-gray-100`}>
                    <Icon className={`h-4 w-4 ${getActivityColor(item.type)}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.title}
                      </p>
                      {(item.entry_type || item.file_type) && (
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getBadgeColor(item.type, item.entry_type || item.file_type)}`}
                        >
                          {item.entry_type || item.file_type}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{getActivityDescription(item)}</span>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(item.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  {item.status && (
                    <Badge variant="outline" className="text-xs">
                      {item.status}
                    </Badge>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
