import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })
import { AuthProvider } from '@/contexts/AuthContext'
import { ProfileProvider } from '@/contexts/ProfileContext'
import { ProjectsProvider } from '@/contexts/ProjectsContext'

import { SidebarWrapper } from '@/components/sidebar-wrapper'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { DynamicBreadcrumb } from '@/components/ui/dynamic-breadcrumb'
import { Toaster } from '@/components/ui/sonner'
import { ConditionalLayout } from '@/components/conditional-layout'

export const metadata: Metadata = {
  title: 'Opoos - Proposal & Quotation Management Platform',
  description: 'Streamline your proposal and quotation workflow for Website Development projects',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased min-h-screen flex flex-col`}>
        <AuthProvider>
          <ProfileProvider>
            <ProjectsProvider>
              <ConditionalLayout>
                {children}
              </ConditionalLayout>
            </ProjectsProvider>
          </ProfileProvider>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  )
}
