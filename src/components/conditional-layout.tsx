"use client"

import { usePathname } from 'next/navigation'
import { SidebarWrapper } from '@/components/sidebar-wrapper'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { DynamicBreadcrumb } from '@/components/ui/dynamic-breadcrumb'
import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'

interface ConditionalLayoutProps {
  children: React.ReactNode
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname()
  
  // Routes where sidebar should be hidden
  const hideSidebarRoutes = ['/']
  
  const shouldHideSidebar = hideSidebarRoutes.includes(pathname)
  
  if (shouldHideSidebar) {
    // Render without sidebar for homepage, but with header and footer
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    )
  }
  
  // Render with sidebar for all other routes
  return (
    <SidebarProvider>
      <SidebarWrapper />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <DynamicBreadcrumb />
          </div>
        </header>
        <main className="flex-1">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
