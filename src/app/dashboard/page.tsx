"use client"

import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import ProjectStats from "@/components/dashboard/ProjectStats"
import QuickActions from "@/components/dashboard/QuickActions"
import RecentActivity from "@/components/dashboard/RecentActivity"
import { useAuth } from "@/contexts/AuthContext"
import { useRequireAuth } from "@/hooks/useRequireAuth"

// Sample project data for demonstration
const projectData = [
  {
    id: 1,
    header: "Website Redesign",
    type: "Web Development",
    status: "In Process",
    target: "2024-02-15",
    limit: "2024-01-30",
    reviewer: "John Doe"
  },
  {
    id: 2,
    header: "Mobile App Development",
    type: "Mobile Development",
    status: "Done",
    target: "2024-01-20",
    limit: "2024-01-15",
    reviewer: "Jane Smith"
  },
  {
    id: 3,
    header: "E-commerce Platform",
    type: "Web Development",
    status: "In Process",
    target: "2024-03-01",
    limit: "2024-02-15",
    reviewer: "Mike Johnson"
  },
  {
    id: 4,
    header: "API Integration",
    type: "Backend Development",
    status: "Done",
    target: "2024-01-10",
    limit: "2024-01-05",
    reviewer: "Sarah Wilson"
  },
  {
    id: 5,
    header: "Database Migration",
    type: "Infrastructure",
    status: "In Process",
    target: "2024-02-28",
    limit: "2024-02-20",
    reviewer: "Alex Brown"
  }
]

// Sample data for components
const sampleStats = {
  totalProjects: 12,
  activeProjects: 8,
  completedProjects: 4,
  totalEntries: 156,
  totalFiles: 89,
  totalProposals: 23
}

const sampleProjects = [
  {
    id: "1",
    user_id: "user1",
    name: "Website Redesign",
    description: "Complete website redesign for client",
    client_name: "Acme Corp",
    client_email: "contact@acme.com",
    status: "active" as const,
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-20T14:30:00Z"
  },
  {
    id: "2",
    user_id: "user1",
    name: "Mobile App Development",
    description: "iOS and Android app development",
    client_name: "TechStart",
    client_email: "hello@techstart.com",
    status: "completed" as const,
    created_at: "2023-12-01T09:00:00Z",
    updated_at: "2024-01-10T16:45:00Z"
  }
]

const sampleActivity = [
  {
    id: "1",
    type: "entry" as const,
    title: "Client Meeting Notes",
    project_id: "1",
    created_at: "2024-01-20T14:30:00Z",
    entry_type: "meeting"
  },
  {
    id: "2",
    type: "file" as const,
    title: "Design Mockups",
    project_id: "1",
    created_at: "2024-01-19T11:20:00Z",
    file_type: "image"
  },
  {
    id: "3",
    type: "proposal" as const,
    title: "Project Proposal v2",
    project_id: "2",
    created_at: "2024-01-18T16:15:00Z"
  }
]

export default function Page() {
  const { user, loading } = useRequireAuth()

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </div>
    )
  }

  // This will only render if user is authenticated (useRequireAuth handles redirect)
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      {/* Project Overview Cards */}
      
      {/* Project Stats and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProjectStats stats={sampleStats} isLoading={false} />
        </div>
        <div>
          <QuickActions recentProjects={sampleProjects} />
        </div>
      </div>
      
      {/* Chart */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-4">Project Analytics</h2>
        <ChartAreaInteractive />
      </div>
      
      {/* Recent Activity */}
      <div>
        <RecentActivity activity={sampleActivity} isLoading={false} />
      </div>
      
      {/* Projects Data Table */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-4">Active Projects</h2>
        <DataTable data={projectData} />
      </div>
    </div>
  )
}
