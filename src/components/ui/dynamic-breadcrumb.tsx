"use client"

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import React from 'react'

const breadcrumbMap: Record<string, { title: string; link?: string }> = {
  '/': { title: 'Home' },
  '/dashboard': { title: 'Dashboard', link: '/dashboard' },
  '/dashboard/analytics': { title: 'Analytics', link: '/dashboard/analytics' },
  '/dashboard/reports': { title: 'Reports', link: '/dashboard/reports' },
  '/projects': { title: 'Projects', link: '/projects' },
  '/projects/create': { title: 'Create Project', link: '/projects/create' },
  '/project': { title: 'Project Details', link: '/project' },
  '/profile': { title: 'Profile', link: '/profile' },
  '/auth': { title: 'Authentication', link: '/auth' },
  '/settings': { title: 'Settings', link: '/settings' },
  '/settings/general': { title: 'General Settings', link: '/settings/general' },
  '/settings/team': { title: 'Team Settings', link: '/settings/team' },
  '/settings/billing': { title: 'Billing', link: '/settings/billing' },
  '/team': { title: 'Team & Clients', link: '/team' },
  '/team/members': { title: 'Team Members', link: '/team/members' },
  '/team/clients': { title: 'Client Directory', link: '/team/clients' },
  '/team/communication': { title: 'Communication', link: '/team/communication' },
  '/files': { title: 'Files & Documents', link: '/files' },
  '/files/templates': { title: 'Templates', link: '/files/templates' },
  '/proposals': { title: 'Proposals', link: '/proposals' },
  '/calendar': { title: 'Calendar', link: '/calendar' },
  '/calendar/timeline': { title: 'Project Timeline', link: '/calendar/timeline' },
  '/calendar/meetings': { title: 'Meetings', link: '/calendar/meetings' },
  '/calendar/deadlines': { title: 'Deadlines', link: '/calendar/deadlines' },
  '/types': { title: 'Project Types', link: '/types' },
}

export function DynamicBreadcrumb() {
  const pathname = usePathname()
  
  // Handle dynamic project routes like /project/[id]
  const projectMatch = pathname.match(/^\/project\/(\d+)$/)
  if (projectMatch) {
    const projectId = projectMatch[1]
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className="hidden md:block">
            <Link href="/" className="text-foreground hover:text-foreground/80">
              Opoos
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="hidden md:block" />
          <BreadcrumbItem>
            <Link href="/projects" className="text-foreground hover:text-foreground/80">
              Projects
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Project {projectId}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )
  }

  // Build breadcrumb for current path
  const pathSegments = pathname.split('/').filter(Boolean)
  const breadcrumbItems = []
  
  // Always start with Opoos
  breadcrumbItems.push({ title: 'Opoos', link: '/' })
  
  // Build breadcrumb items based on path segments
  let currentPath = ''
  for (const segment of pathSegments) {
    currentPath += `/${segment}`
    const breadcrumbItem = breadcrumbMap[currentPath]
    if (breadcrumbItem) {
      breadcrumbItems.push(breadcrumbItem)
    } else {
      // Fallback for unknown paths
      breadcrumbItems.push({ 
        title: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '), 
        link: currentPath 
      })
    }
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={item.link || index}>
            <BreadcrumbItem className={index === 0 ? "hidden md:block" : ""}>
              {index === breadcrumbItems.length - 1 ? (
                <BreadcrumbPage>{item.title}</BreadcrumbPage>
              ) : (
                <Link href={item.link || '#'} className="text-foreground hover:text-foreground/80">
                  {item.title}
                </Link>
              )}
            </BreadcrumbItem>
            {index < breadcrumbItems.length - 1 && (
              <BreadcrumbSeparator className={index === 0 ? "hidden md:block" : ""} />
            )}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
