"use client"

import Link from "next/link"
import {
  Folder,
  Forward,
  MoreHorizontal,
  Trash2,
  Plus,
  Edit,
  Copy,
  Archive,
  Eye,
  FileText,
  Upload,
  Zap,
  Users,
  Calendar,
  Star,
  Loader2,
  AlertCircle,
  type LucideIcon,
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
export function NavProjects({
  projects,
  loading = false,
  error = null,
  onDeleteProject,
  isAuthenticated = true,
}: {
  projects: {
    name: string
    url: string
    icon: LucideIcon
    id?: string
  }[]
  loading?: boolean
  error?: string | null
  onDeleteProject?: (projectId: string, projectName: string) => void
  isAuthenticated?: boolean
}) {
  const { isMobile } = useSidebar()

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Projects</SidebarGroupLabel>
      <SidebarMenu>
        {/* New Project Button */}
        <SidebarMenuItem>
          {isAuthenticated ? (
            <SidebarMenuButton asChild className="text-sidebar-foreground/70 hover:text-sidebar-foreground">
              <Link href="/projects/create">
                <Plus className="h-4 w-4" />
                <span>New Project</span>
              </Link>
            </SidebarMenuButton>
          ) : (
            <SidebarMenuButton className="text-sidebar-foreground/50 cursor-not-allowed opacity-50">
              <Plus className="h-4 w-4" />
              <span>New Project</span>
            </SidebarMenuButton>
          )}
        </SidebarMenuItem>
        
        {/* Loading State */}
        {loading && (
          <SidebarMenuItem>
            <SidebarMenuButton disabled>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Loading projects...</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )}

        {/* Error State */}
        {error && (
          <SidebarMenuItem>
            <SidebarMenuButton disabled className="text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span>Failed to load projects</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )}

        {/* Projects List */}
        {!loading && !error && projects.map((item) => (
          <SidebarMenuItem key={item.name}>
            {isAuthenticated ? (
              <SidebarMenuButton asChild>
                <Link href={item.url}>
                  <item.icon />
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            ) : (
              <SidebarMenuButton className="text-sidebar-foreground/50 cursor-not-allowed opacity-50">
                <item.icon />
                <span>{item.name}</span>
              </SidebarMenuButton>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem>
                  <Eye className="text-muted-foreground" />
                  <span>View Project Details</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <FileText className="text-muted-foreground" />
                  <span>Add Entry</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Upload className="text-muted-foreground" />
                  <span>Upload Files</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Users className="text-muted-foreground" />
                  <span>Manage Team</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Calendar className="text-muted-foreground" />
                  <span>Schedule Meeting</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Edit className="text-muted-foreground" />
                  <span>Edit Project</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Copy className="text-muted-foreground" />
                  <span>Duplicate Project</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Zap className="text-muted-foreground" />
                  <span>Generate Proposal</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Forward className="text-muted-foreground" />
                  <span>Share Project</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Star className="text-muted-foreground" />
                  <span>Add to Favorites</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Archive className="text-muted-foreground" />
                  <span>Archive Project</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => item.id && onDeleteProject?.(item.id, item.name)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="text-destructive" />
                  <span>Delete Project</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}

        {/* Empty State */}
        {!loading && !error && projects.length === 0 && (
          <SidebarMenuItem>
            <SidebarMenuButton disabled className="text-sidebar-foreground/50">
              <Folder className="h-4 w-4" />
              <span>No projects yet</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )}

        <SidebarMenuItem>
          {isAuthenticated ? (
            <SidebarMenuButton asChild className="text-sidebar-foreground/70">
              <Link href="/projects">
                <MoreHorizontal className="text-sidebar-foreground/70" />
                <span>View All Projects</span>
              </Link>
            </SidebarMenuButton>
          ) : (
            <SidebarMenuButton className="text-sidebar-foreground/50 cursor-not-allowed opacity-50">
              <MoreHorizontal className="text-sidebar-foreground/50" />
              <span>View All Projects</span>
            </SidebarMenuButton>
          )}
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}
