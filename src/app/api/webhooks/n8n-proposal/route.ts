import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    console.log('Received n8n webhook callback:', JSON.stringify(body, null, 2))
    
    // Extract data from n8n webhook response
    const { 
      project_id, 
      proposal_id, 
      status, 
      content, 
      error_message,
      link, // Google Docs link
      ai_content, // AI generated content
      statusMessage, // Alternative field name
      id // Alternative field name for link
    } = body

    if (!project_id) {
      return NextResponse.json({ error: 'Missing project_id' }, { status: 400 })
    }

    const supabase = createClient()

    // Find the proposal if proposal_id is not provided
    let proposalId = proposal_id
    if (!proposalId) {
      const { data: proposals, error: findError } = await supabase
        .from('project_proposals')
        .select('id')
        .eq('project_id', project_id)
        .eq('automation_status', 'processing')
        .order('created_at', { ascending: false })
        .limit(1)

      if (findError || !proposals || proposals.length === 0) {
        return NextResponse.json({ error: 'No processing proposal found' }, { status: 404 })
      }
      proposalId = proposals[0].id
    }

    // Update the proposal with the n8n response
    const updateData: any = {
      automation_status: status || 'completed',
      updated_at: new Date().toISOString()
    }

    // If there's content from n8n, update the proposal content
    if (content) {
      updateData.content = content
    }

    // Handle Google Docs link specifically (support multiple field names)
    const docLink = link || id
    if (docLink) {
      updateData.content = {
        ...updateData.content,
        link: docLink
      }
    }

    // Handle AI generated content (support multiple field names)
    const aiContent = ai_content || (statusMessage ? { summary: statusMessage } : null)
    if (aiContent) {
      updateData.content = {
        ...updateData.content,
        ai_generated_content: aiContent
      }
    }

    // If there's an error, log it and update status
    if (error_message) {
      console.error('N8N workflow error:', error_message)
      updateData.automation_status = 'failed'
      updateData.automation_data = {
        error: error_message,
        failed_at: new Date().toISOString()
      }
    }

    const { error } = await supabase
      .from('project_proposals')
      .update(updateData)
      .eq('id', proposalId)
      .eq('project_id', project_id)

    if (error) {
      console.error('Error updating proposal from n8n webhook:', error)
      return NextResponse.json({ error: 'Failed to update proposal' }, { status: 500 })
    }

    console.log(`Proposal ${proposalId} updated successfully from n8n webhook`)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Proposal updated successfully',
      proposal_id: proposalId
    })

  } catch (error) {
    console.error('Error processing n8n webhook:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}
