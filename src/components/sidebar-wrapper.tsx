"use client"

import { Suspense } from "react"
import { AppSidebar } from "./app-sidebar"
import { Sidebar, SidebarContent, SidebarHeader, SidebarFooter, SidebarRail } from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"

// Loading skeleton for the sidebar
function SidebarSkeleton() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <Skeleton className="h-8 w-8 rounded" />
          <div className="flex-1 space-y-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <div className="space-y-2 px-2">
          <Skeleton className="h-4 w-20" />
          <div className="space-y-1">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        </div>
        <div className="space-y-2 px-2 mt-6">
          <Skeleton className="h-4 w-16" />
          <div className="space-y-1">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        </div>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center gap-2 px-2 py-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="flex-1 space-y-1">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

// Main sidebar wrapper with independent loading
export function SidebarWrapper({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Suspense fallback={<SidebarSkeleton />}>
      <AppSidebar {...props} />
    </Suspense>
  )
}
