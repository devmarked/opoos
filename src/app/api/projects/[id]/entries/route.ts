import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { CreateProjectEntryData } from '@/types'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify project ownership
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single()

    if (projectError || !project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Fetch project entries
    const { data: entries, error } = await supabase
      .from('project_entries')
      .select('*')
      .eq('project_id', params.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching entries:', error)
      return NextResponse.json({ error: 'Failed to fetch entries' }, { status: 500 })
    }

    return NextResponse.json({ entries })
  } catch (error) {
    console.error('Error in entries GET:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify project ownership
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single()

    if (projectError || !project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Parse request body
    const body: CreateProjectEntryData = await request.json()
    
    // Validate required fields
    if (!body.title?.trim() || !body.body?.trim()) {
      return NextResponse.json({ error: 'Title and body are required' }, { status: 400 })
    }

    // Create entry
    const { data: entry, error } = await supabase
      .from('project_entries')
      .insert({
        project_id: params.id,
        user_id: user.id,
        title: body.title.trim(),
        body: body.body.trim(),
        entry_type: body.entry_type || 'general',
        metadata: body.metadata || {}
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating entry:', error)
      return NextResponse.json({ error: 'Failed to create entry' }, { status: 500 })
    }

    return NextResponse.json({ entry }, { status: 201 })
  } catch (error) {
    console.error('Error in entries POST:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
