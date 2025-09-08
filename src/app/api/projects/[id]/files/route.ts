import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

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

    // Fetch project files
    const { data: files, error } = await supabase
      .from('project_files')
      .select('*')
      .eq('project_id', params.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching files:', error)
      return NextResponse.json({ error: 'Failed to fetch files' }, { status: 500 })
    }

    return NextResponse.json({ files })
  } catch (error) {
    console.error('Error in files GET:', error)
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

    // Parse form data
    const formData = await request.formData()
    const file = formData.get('file') as File
    const folderPath = formData.get('folder_path') as string || ''
    const tags = formData.get('tags') as string || ''

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Determine file type and bucket
    const fileType = getFileType(file.type)
    const bucketName = getBucketName(fileType)
    
    // Generate unique file name
    const fileExtension = file.name.split('.').pop()
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExtension}`
    const storagePath = `${params.id}/${folderPath}/${fileName}`.replace(/\/+/g, '/')

    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(storagePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('Error uploading file:', uploadError)
      return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
    }

    // Save file metadata to database
    const { data: fileRecord, error: dbError } = await supabase
      .from('project_files')
      .insert({
        project_id: params.id,
        user_id: user.id,
        name: fileName,
        original_name: file.name,
        file_type: fileType,
        mime_type: file.type,
        file_size: file.size,
        storage_path: uploadData.path,
        folder_path: folderPath,
        tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
        metadata: getFileMetadata(file)
      })
      .select()
      .single()

    if (dbError) {
      // Clean up uploaded file if database save fails
      await supabase.storage.from(bucketName).remove([storagePath])
      console.error('Error saving file metadata:', dbError)
      return NextResponse.json({ error: 'Failed to save file metadata' }, { status: 500 })
    }

    return NextResponse.json({ file: fileRecord }, { status: 201 })
  } catch (error) {
    console.error('Error in files POST:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Helper functions
function getFileType(mimeType: string): 'document' | 'image' | 'audio' | 'video' | 'other' {
  if (mimeType.startsWith('image/')) return 'image'
  if (mimeType.startsWith('audio/')) return 'audio'
  if (mimeType.startsWith('video/')) return 'video'
  if (mimeType.includes('pdf') || mimeType.includes('document') || mimeType.includes('text')) return 'document'
  return 'other'
}

function getBucketName(fileType: string): string {
  switch (fileType) {
    case 'document':
      return 'project-documents'
    case 'image':
      return 'project-images'
    case 'audio':
      return 'project-audio'
    default:
      return 'project-files'
  }
}

function getFileMetadata(file: File): Record<string, any> {
  const metadata: Record<string, any> = {
    lastModified: file.lastModified,
    size: file.size
  }

  // Add type-specific metadata if available
  if (file.type.startsWith('image/')) {
    // For images, we could add dimensions if we had image processing
    metadata.type = 'image'
  } else if (file.type.startsWith('audio/')) {
    metadata.type = 'audio'
  } else if (file.type.startsWith('video/')) {
    metadata.type = 'video'
  }

  return metadata
}
