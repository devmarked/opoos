'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Project } from '@/types'
import { 
  Plus, 
  FolderOpen, 
  Zap, 
  FileText,
  Calendar,
  User,
  ArrowRight
} from 'lucide-react'

interface QuickActionsProps {
  recentProjects: Project[]
}

export default function QuickActions({ recentProjects }: QuickActionsProps) {
  const quickActionButtons = [
    {
      title: 'New Project',
      description: 'Start a new client project',
      icon: Plus,
      href: '/projects/create',
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      title: 'View All Projects',
      description: 'Browse all your projects',
      icon: FolderOpen,
      href: '/projects',
      color: 'bg-green-600 hover:bg-green-700'
    }
  ]

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      case 'archived':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">

      {/* Recent Projects */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5" />
              Recent Projects
            </CardTitle>
            <Link href="/projects">
              <Button variant="ghost" size="sm">
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {recentProjects.length === 0 ? (
            <div className="text-center py-6">
              <FolderOpen className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">No projects yet</p>
              <Link href="/projects/create">
                <Button size="sm" className="mt-2">
                  <Plus className="h-4 w-4 mr-1" />
                  Create First Project
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentProjects.slice(0, 5).map((project) => (
                <Link key={project.id} href={`/project/${project.id}`}>
                  <div className="p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer border">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900 text-sm line-clamp-1">
                        {project.name}
                      </h4>
                      <Badge className={getStatusColor(project.status)}>
                        {project.status}
                      </Badge>
                    </div>
                    
                    {project.description && (
                      <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                        {project.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      {project.client_name && (
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>{project.client_name}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(project.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  )
}
