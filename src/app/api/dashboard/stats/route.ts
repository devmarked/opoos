import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = createClient()
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch all stats in parallel
    const [
      projectsResult,
      entriesResult,
      filesResult,
      proposalsResult
    ] = await Promise.all([
      // Projects stats
      supabase
        .from('projects')
        .select('id, name, description, client_name, status, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false }),
      
      // Entries stats
      supabase
        .from('project_entries')
        .select('id, title, entry_type, project_id, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false }),
      
      // Files stats
      supabase
        .from('project_files')
        .select('id, name, file_type, project_id, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false }),
      
      // Proposals stats
      supabase
        .from('project_proposals')
        .select('id, title, status, automation_status, project_id, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
    ])

    // Handle errors
    if (projectsResult.error) {
      console.error('Error fetching projects:', projectsResult.error)
      return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
    }

    const projects = projectsResult.data || []
    const entries = entriesResult.data || []
    const files = filesResult.data || []
    const proposals = proposalsResult.data || []

    // Calculate stats
    const totalProjects = projects.length
    const activeProjects = projects.filter(p => p.status === 'active').length
    const completedProjects = projects.filter(p => p.status === 'completed').length
    const totalEntries = entries.length
    const totalFiles = files.length
    const totalProposals = proposals.length

    // Get recent projects (last 5)
    const recentProjects = projects.slice(0, 5)

    // Combine recent activity from all sources
    const recentActivity = [
      ...entries.slice(0, 10).map(entry => ({
        id: entry.id,
        type: 'entry' as const,
        title: entry.title,
        project_id: entry.project_id,
        created_at: entry.created_at,
        entry_type: entry.entry_type
      })),
      ...files.slice(0, 10).map(file => ({
        id: file.id,
        type: 'file' as const,
        title: file.name,
        project_id: file.project_id,
        created_at: file.created_at,
        file_type: file.file_type
      })),
      ...proposals.slice(0, 10).map(proposal => ({
        id: proposal.id,
        type: 'proposal' as const,
        title: proposal.title,
        project_id: proposal.project_id,
        created_at: proposal.created_at,
        status: proposal.status
      }))
    ]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 15) // Get most recent 15 items

    const stats = {
      totalProjects,
      activeProjects,
      completedProjects,
      totalEntries,
      totalFiles,
      totalProposals,
      recentProjects,
      recentActivity
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error in dashboard stats GET:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
