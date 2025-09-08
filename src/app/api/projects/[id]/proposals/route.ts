import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import jwt from 'jsonwebtoken'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params
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
      .eq('id', projectId)
      .eq('user_id', user.id)
      .single()

    if (projectError || !project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Fetch project proposals
    const { data: proposals, error } = await supabase
      .from('project_proposals')
      .select('*')
      .eq('project_id', projectId)
      .order('version', { ascending: false })

    if (error) {
      console.error('Error fetching proposals:', error)
      return NextResponse.json({ error: 'Failed to fetch proposals' }, { status: 500 })
    }

    return NextResponse.json({ proposals })
  } catch (error) {
    console.error('Error in proposals GET:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params
    const supabase = await createClient()
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify project ownership
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .eq('user_id', user.id)
      .single()

    if (projectError || !project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Get project data for proposal generation
    const [entriesResult, filesResult] = await Promise.all([
      supabase
        .from('project_entries')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false }),
      supabase
        .from('project_files')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })
    ])

    // Get next version number
    const { data: existingProposals, error: versionError } = await supabase
      .from('project_proposals')
      .select('version')
      .eq('project_id', projectId)
      .order('version', { ascending: false })
      .limit(1)

    const nextVersion = existingProposals && existingProposals.length > 0 
      ? existingProposals[0].version + 1 
      : 1

    // Create new proposal with minimal data first
    const { data: proposal, error: createError } = await supabase
      .from('project_proposals')
      .insert({
        project_id: projectId,
        user_id: user.id,
        version: nextVersion,
        title: `${project.name} - Proposal v${nextVersion}`,
        content: {},
        status: 'draft',
        automation_status: 'pending'
      })
      .select()
      .single()

    if (createError) {
      console.error('Error creating proposal:', createError)
      return NextResponse.json({ error: 'Failed to create proposal' }, { status: 500 })
    }

    // Return the proposal ID immediately
    const proposalId = proposal.id

    // Update automation status to processing and trigger n8n workflow asynchronously
    // Use Promise.resolve().then() instead of setImmediate for better compatibility
    Promise.resolve().then(async () => {
      try {
        console.log('🔄 Starting async processing for proposal:', proposalId)
        
        // Update status to processing
        const { error: updateError } = await supabase
          .from('project_proposals')
          .update({ automation_status: 'processing' })
          .eq('id', proposalId)

        if (updateError) {
          console.error('❌ Error updating proposal to processing:', updateError)
          throw updateError
        }
        
        console.log('✅ Updated proposal status to processing:', proposalId)

        // Trigger n8n webhook
        await triggerN8nWorkflow(projectId, proposalId, {
          project: project,
          entries: entriesResult.data || [],
          files: filesResult.data || [],
          generated_at: new Date().toISOString()
        })
        
        console.log('✅ N8N workflow triggered successfully for proposal:', proposalId)
      } catch (error) {
        console.error('❌ Error in async proposal processing:', error)
        
        // Update proposal status to failed
        const { error: failError } = await supabase
          .from('project_proposals')
          .update({ automation_status: 'failed' })
          .eq('id', proposalId)
          
        if (failError) {
          console.error('❌ Error updating proposal to failed status:', failError)
        } else {
          console.log('✅ Updated proposal status to failed:', proposalId)
        }
      }
    }).catch(error => {
      console.error('❌ Unhandled error in async processing:', error)
    })

    return NextResponse.json({ proposal, proposalId }, { status: 201 })
  } catch (error) {
    console.error('Error in proposals POST:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// n8n workflow trigger function
async function triggerN8nWorkflow(projectId: string, proposalId: string, projectData?: any) {
  const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL || 'https://mc-personal.app.n8n.cloud/webhook-test/opooos-generate-proposal'
  const n8nJwtSecret = process.env.N8N_JWT_SECRET
  
  if (!n8nJwtSecret) {
    console.log('N8N_JWT_SECRET not configured, skipping automation')
    return
  }

  // Create JWT token for authentication
  const token = jwt.sign(
    { 
      project_id: projectId,
      id: proposalId,
      timestamp: Date.now()
    },
    n8nJwtSecret,
    { expiresIn: '1h' }
  )

  const payload = {
    project_id: projectId,
    id: proposalId,
    project_data: projectData,
    callback_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/webhooks/n8n-proposal`
  }

  try {
    const response = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      throw new Error(`N8N webhook failed with status: ${response.status}`)
    }

    console.log('N8N webhook triggered successfully for project:', projectId)
  } catch (error) {
    console.error('Error calling n8n webhook:', error)
    throw error
  }
}
