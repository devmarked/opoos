'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  FolderOpen, 
  Play, 
  CheckCircle, 
  FileText, 
  Upload, 
  Zap,
  TrendingUp
} from 'lucide-react'

interface ProjectStatsProps {
  stats: {
    totalProjects: number
    activeProjects: number
    completedProjects: number
    totalEntries: number
    totalFiles: number
    totalProposals: number
  }
  isLoading: boolean
}

export default function ProjectStats({ stats, isLoading }: ProjectStatsProps) {
  const statItems = [
    {
      title: 'Total Projects',
      value: stats.totalProjects,
      icon: FolderOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      change: '+12%',
      changeType: 'positive' as const
    },
    {
      title: 'Active Projects',
      value: stats.activeProjects,
      icon: Play,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      change: '+5%',
      changeType: 'positive' as const
    },
    {
      title: 'Completed',
      value: stats.completedProjects,
      icon: CheckCircle,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      change: '+8%',
      changeType: 'positive' as const
    },
    {
      title: 'Total Entries',
      value: stats.totalEntries,
      icon: FileText,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      change: '+23%',
      changeType: 'positive' as const
    },
    {
      title: 'Files Uploaded',
      value: stats.totalFiles,
      icon: Upload,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
      change: '+15%',
      changeType: 'positive' as const
    },
    {
      title: 'Proposals Generated',
      value: stats.totalProposals,
      icon: Zap,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      change: '+31%',
      changeType: 'positive' as const
    }
  ]

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-300 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-300 rounded w-1/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Project Overview</h2>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <TrendingUp className="h-4 w-4" />
          <span>Last 30 days</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {statItems.map((item) => (
          <Card key={item.title} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {item.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${item.bgColor}`}>
                <item.icon className={`h-4 w-4 ${item.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {item.value.toLocaleString()}
              </div>
              <div className="flex items-center gap-1">
                <span className={`text-xs font-medium ${
                  item.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {item.change}
                </span>
                <span className="text-xs text-gray-500">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
