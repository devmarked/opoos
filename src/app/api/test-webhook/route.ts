import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    console.log('Test webhook received:', JSON.stringify(body, null, 2))
    
    // Simulate n8n response
    const mockResponse = {
      project_id: body.project_id || 'test-project-id',
      status: 'completed',
      link: '1pD6eF1YDRqyazvo3BdXEfCKQRnpEp6AWr_7qRDePsQE',
      ai_content: {
        summary: 'Test AI-generated proposal summary',
        timeline: '4-6 weeks',
        estimated_cost: '$5,000 - $8,000',
        deliverables: [
          'Project planning and wireframes',
          'UI/UX design',
          'Frontend development',
          'Backend development',
          'Testing and deployment'
        ]
      }
    }
    
    // Call your webhook callback
    const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/webhooks/n8n-proposal`
    
    const response = await fetch(callbackUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mockResponse)
    })
    
    const result = await response.json()
    
    return NextResponse.json({
      success: true,
      message: 'Test webhook sent successfully',
      callback_url: callbackUrl,
      mock_response: mockResponse,
      callback_result: result
    })
    
  } catch (error) {
    console.error('Error in test webhook:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

