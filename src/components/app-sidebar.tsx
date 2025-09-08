"use client"

import * as React from "react"
import {
  FolderOpen,
  Home,
  Zap,
  BarChart3,
  Palette,
  Globe,
  Smartphone,
  Server,
  Database,
  CheckCircle,
  ShoppingCart,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser, NavLogin } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import Image from "next/image"
import { useAuth } from "@/contexts/AuthContext"
import { useProfile } from "@/contexts/ProfileContext"
import { useSidebarProjectsWithRefresh } from "@/hooks/useApi"
import { useProjects as useProjectsContext } from "@/contexts/ProjectsContext"
import { Project } from "@/types"
import { Badge } from "@/components/ui/badge"
import { useProjects } from "@/hooks/useApi"


const navMain = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
    isActive: true,
    items: [
      {
        title: "Overview",
        url: "/dashboard",
      },
    ],
  },
]

// Icon mapping for different project types
const getProjectIcon = (project: Project) => {
  const name = project.name.toLowerCase()
  if (name.includes('web') || name.includes('website')) return Globe
  if (name.includes('mobile') || name.includes('app')) return Smartphone
  if (name.includes('ecommerce') || name.includes('shop')) return ShoppingCart
  if (name.includes('api') || name.includes('backend')) return Server
  if (name.includes('database') || name.includes('db')) return Database
  if (name.includes('design') || name.includes('ui') || name.includes('ux')) return Palette
  if (name.includes('performance') || name.includes('optimization')) return Zap
  if (name.includes('test') || name.includes('qa')) return CheckCircle
  return FolderOpen // Default icon
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth()
  const { profile } = useProfile()
  const { projects: dbProjects, loading: projectsLoading, error, fetchProjects } = useSidebarProjectsWithRefresh()
  const { deleteProject } = useProjects()
  const { refreshProjects } = useProjectsContext()

  // Get user data from Supabase - show real data or sensible defaults
  const userData = {
    name: profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User',
    email: user?.email || 'user@example.com',
    avatar: profile?.avatar_url || user?.user_metadata?.avatar_url || '/avatars/default.jpg',
  }

  // Transform database projects to sidebar format
  const sidebarProjects = (dbProjects || []).map((project: Project) => ({
    name: project.name,
    url: `/project/${project.id}`,
    icon: getProjectIcon(project),
    id: project.id,
  }))

  // Handle project deletion
  const handleDeleteProject = async (projectId: string, projectName: string) => {
    if (confirm(`Are you sure you want to delete "${projectName}"? This action cannot be undone.`)) {
      try {
        const result = await deleteProject(projectId)
        if (result.success) {
          // Refresh the projects list
          fetchProjects()
          // Notify all components (including projects page) that projects have been updated
          refreshProjects()
        } else {
          alert(result.error?.message || 'Failed to delete project')
        }
      } catch (error) {
        alert('An unexpected error occurred')
      }
    }
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center p-4">
          <Image
            src="/images/opoos_logo.svg"
            alt="Opoos Logo"
            width={120}
            height={30}
            className="h-8 w-auto"
          />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} isAuthenticated={!!user} />
        <NavProjects 
          projects={sidebarProjects} 
          loading={projectsLoading}
          error={error}
          onDeleteProject={handleDeleteProject}
          isAuthenticated={!!user}
        />
      </SidebarContent>
      <SidebarFooter>
        {user ? (
          <NavUser user={userData} />
        ) : (
          <NavLogin />
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
