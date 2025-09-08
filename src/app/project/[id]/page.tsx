'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useRequireAuth } from '@/hooks/useRequireAuth'
import { Project, ProjectEntry, ProjectFile, ProjectProposal, CreateProjectEntryData, UpdateProjectEntryData } from '@/types'
import AddEntryModal from '@/components/project/AddEntryModal'
import EditEntryModal from '@/components/project/EditEntryModal'
import FileUpload from '@/components/project/FileUpload'
import ProposalGenerator from '@/components/project/ProposalGenerator'
import { ErrorBoundary } from '@/components/ui/error-boundary'
import { PageLoading } from '@/components/ui/loading-states'
import { ErrorState, NotFoundError } from '@/components/ui/error-states'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, 
  Plus, 
  FileText, 
  Image, 
  Music, 
  Video, 
  File,
  Calendar,
  User,
  Mail,
  Settings,
  Sparkles,
  Edit,
  Trash2
} from 'lucide-react'

function ProjectDetailContent() {
  const params = useParams()
  const { user, loading } = useRequireAuth()
  const [project, setProject] = useState<Project | null>(null)
  const [entries, setEntries] = useState<ProjectEntry[]>([])
  const [files, setFiles] = useState<ProjectFile[]>([])
  const [proposals, setProposals] = useState<ProjectProposal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isPolling, setIsPolling] = useState(false)
  const [showAddEntry, setShowAddEntry] = useState(false)
  const [showEditEntry, setShowEditEntry] = useState(false)
  const [editingEntry, setEditingEntry] = useState<ProjectEntry | null>(null)
  const [showFileUpload, setShowFileUpload] = useState(false)
  const [showProposalGenerator, setShowProposalGenerator] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)
  const isLoadingRef = useRef(false)

  const projectId = params.id as string

  useEffect(() => {
    if (user && projectId && !hasLoaded) {
      fetchProjectData()
    }
  }, [user?.id, projectId, hasLoaded])

  // Function to fetch and update pending proposals
  const fetchPendingProposals = async () => {
    if (!user || !projectId) return

    try {
      const response = await fetch(`/api/projects/${projectId}/proposals`)
      if (response.ok) {
        const { proposals: latestProposals } = await response.json()
        
        // Update proposals state, focusing on automation status changes
        setProposals(prevProposals => {
          return prevProposals.map(prevProposal => {
            const updatedProposal = latestProposals.find((p: ProjectProposal) => p.id === prevProposal.id)
            if (updatedProposal) {
              // Log status changes for debugging
              if (prevProposal.automation_status !== updatedProposal.automation_status) {
                console.log(`📊 Proposal ${updatedProposal.id} status changed: ${prevProposal.automation_status} → ${updatedProposal.automation_status}`)
              }
              return updatedProposal
            }
            return prevProposal
          })
        })
      }
    } catch (error) {
      console.error('Error fetching pending proposals:', error)
    }
  }

  // Polling useEffect for pending proposals
  useEffect(() => {
    if (!user || !projectId || !hasLoaded) return

    // Check if there are any pending proposals
    const hasPendingProposals = proposals.some(p => 
      p.automation_status === 'pending' || p.automation_status === 'processing'
    )

    if (!hasPendingProposals) {
      setIsPolling(false)
      return
    }

    setIsPolling(true)
    console.log('🔄 Starting polling for pending proposals...')

    // Set up polling interval
    const pollInterval = setInterval(() => {
      console.log('📡 Polling for proposal updates...')
      fetchPendingProposals()
    }, 30000) // Poll every 30 seconds

    // Cleanup interval on unmount or when conditions change
    return () => {
      console.log('🛑 Stopping proposal polling')
      clearInterval(pollInterval)
      setIsPolling(false)
    }
  }, [user?.id, projectId, hasLoaded, proposals])

  const fetchProjectData = async () => {
    if (isLoadingRef.current) return // Prevent multiple simultaneous calls
    
    try {
      isLoadingRef.current = true
      setError(null)
      setIsLoading(true)
      const [projectRes, entriesRes, filesRes, proposalsRes] = await Promise.all([
        fetch(`/api/projects/${projectId}`),
        fetch(`/api/projects/${projectId}/entries`),
        fetch(`/api/projects/${projectId}/files`),
        fetch(`/api/projects/${projectId}/proposals`)
      ])

      if (!projectRes.ok) {
        if (projectRes.status === 404) {
          setError('PROJECT_NOT_FOUND')
          return
        }
        throw new Error(`Failed to fetch project: ${projectRes.status}`)
      }

      const projectData = await projectRes.json()
      setProject(projectData.project)

      // Handle other responses
      const [entriesData, filesData, proposalsData] = await Promise.all([
        entriesRes.ok ? entriesRes.json() : { entries: [] },
        filesRes.ok ? filesRes.json() : { files: [] },
        proposalsRes.ok ? proposalsRes.json() : { proposals: [] }
      ])

      setEntries(entriesData.entries || [])
      setFiles(filesData.files || [])
      setProposals(proposalsData.proposals || [])
      setHasLoaded(true)
    } catch (error) {
      console.error('Error fetching project data:', error)
      setError(error instanceof Error ? error.message : 'Failed to load project')
    } finally {
      isLoadingRef.current = false
      setIsLoading(false)
    }
  }

  const getFileIcon = (fileType: ProjectFile['file_type']) => {
    switch (fileType) {
      case 'document':
        return FileText
      case 'image':
        return Image
      case 'audio':
        return Music
      case 'video':
        return Video
      default:
        return File
    }
  }

  const getEntryTypeColor = (type: ProjectEntry['entry_type']) => {
    switch (type) {
      case 'meeting':
        return 'bg-blue-100 text-blue-800'
      case 'requirement':
        return 'bg-purple-100 text-purple-800'
      case 'feedback':
        return 'bg-orange-100 text-orange-800'
      case 'note':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleAddEntry = async (entryData: CreateProjectEntryData) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/entries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entryData),
      })

      if (response.ok) {
        const { entry } = await response.json()
        setEntries(prev => [entry, ...prev])
      }
    } catch (error) {
      console.error('Error adding entry:', error)
    }
  }

  const handleFileUpload = async (file: File, folderPath?: string, tags?: string) => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      if (folderPath) formData.append('folder_path', folderPath)
      if (tags) formData.append('tags', tags)

      const response = await fetch(`/api/projects/${projectId}/files`, {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const { file: uploadedFile } = await response.json()
        setFiles(prev => [uploadedFile, ...prev])
      }
    } catch (error) {
      console.error('Error uploading file:', error)
    }
  }

  const handleGenerateProposal = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}/proposals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      if (response.ok) {
        const { proposal, proposalId } = await response.json()
        setProposals(prev => [proposal, ...prev])
        
        // Log the proposal ID for debugging/tracking
        console.log('Generated proposal with ID:', proposalId)
        
        // Trigger immediate poll for updates since we have a new pending proposal
        setTimeout(() => {
          fetchPendingProposals()
        }, 2000) // Poll after 2 seconds to give the async processing time to start
        
        return proposalId
      }
    } catch (error) {
      console.error('Error generating proposal:', error)
      throw error
    }
  }

  const handleEditEntry = (entry: ProjectEntry) => {
    setEditingEntry(entry)
    setShowEditEntry(true)
  }

  const handleUpdateEntry = async (entryId: string, data: UpdateProjectEntryData) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/entries/${entryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        const { entry } = await response.json()
        setEntries(prev => prev.map(e => e.id === entryId ? entry : e))
      }
    } catch (error) {
      console.error('Error updating entry:', error)
    }
  }

  const handleDeleteEntry = async (entryId: string) => {
    if (!confirm('Are you sure you want to delete this entry? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/projects/${projectId}/entries/${entryId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setEntries(prev => prev.filter(e => e.id !== entryId))
      }
    } catch (error) {
      console.error('Error deleting entry:', error)
    }
  }

  if (loading || isLoading) {
    return <PageLoading />
  }

  if (error === 'PROJECT_NOT_FOUND') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <NotFoundError resource="project" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <ErrorState
            title="Failed to Load Project"
            description={error}
            action={{ 
              label: 'Try Again', 
              onClick: () => {
                setHasLoaded(false)
                fetchProjectData()
              }
            }}
          />
        </div>
      </div>
    )
  }

  if (!project) {
    return <PageLoading />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
              <p className="text-gray-600 mt-1">{project.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={project.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
              {project.status}
            </Badge>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Info */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Project Information</CardTitle>
                  <Button 
                    size="sm" 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                    onClick={() => setShowProposalGenerator(true)}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Proposal
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.client_name && (
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Client:</span>
                      <span className="font-medium">{project.client_name}</span>
                    </div>
                  )}
                  {project.client_email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Email:</span>
                      <span className="font-medium">{project.client_email}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Created:</span>
                    <span className="font-medium">
                      {new Date(project.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Entries Section */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Notes & Meetings</CardTitle>
                    <CardDescription>Project entries, meeting notes, and requirements</CardDescription>
                  </div>
                  <Button size="sm" onClick={() => setShowAddEntry(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Entry
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {entries.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No entries yet. Add your first note or meeting.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {entries?.map((entry: ProjectEntry) => (
                      <div key={entry.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-gray-900">{entry.title}</h4>
                          <div className="flex items-center gap-2">
                            <Badge className={getEntryTypeColor(entry.entry_type)}>
                              {entry.entry_type}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {new Date(entry.created_at).toLocaleDateString()}
                            </span>
                            <div className="flex items-center gap-1 ml-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditEntry(entry)}
                                className="h-8 w-8 p-0 hover:bg-gray-100"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteEntry(entry.id)}
                                className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700 text-sm line-clamp-3">{entry.body}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" onClick={() => setShowAddEntry(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Note
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => setShowAddEntry(true)}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Log Meeting
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => setShowFileUpload(true)}>
                  <File className="h-4 w-4 mr-2" />
                  Upload File
                </Button>
              </CardContent>
            </Card>

            {/* Files */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Files</CardTitle>
                  <Button size="sm" variant="outline" onClick={() => setShowFileUpload(true)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {files.length === 0 ? (
                  <div className="text-center py-6">
                    <File className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">No files uploaded</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {files?.slice(0, 5).map((file: ProjectFile) => {
                      const Icon = getFileIcon(file.file_type)
                      return (
                        <div key={file.id} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                          <Icon className="h-4 w-4 text-gray-500" />
                          <span className="text-sm truncate flex-1">{file.name}</span>
                        </div>
                      )
                    })}
                    {files.length > 5 && (
                      <p className="text-xs text-gray-500 text-center pt-2">
                        +{files.length - 5} more files
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddEntryModal
        isOpen={showAddEntry}
        onClose={() => setShowAddEntry(false)}
        onSave={handleAddEntry}
        projectId={projectId}
      />
      
      <EditEntryModal
        isOpen={showEditEntry}
        onClose={() => {
          setShowEditEntry(false)
          setEditingEntry(null)
        }}
        onSave={handleUpdateEntry}
        onDelete={handleDeleteEntry}
        entry={editingEntry}
      />
      
      <FileUpload
        isOpen={showFileUpload}
        onClose={() => setShowFileUpload(false)}
        onUpload={handleFileUpload}
        projectId={projectId}
      />
      
      <ProposalGenerator
        isOpen={showProposalGenerator}
        onClose={() => setShowProposalGenerator(false)}
        onGenerate={handleGenerateProposal}
        proposals={proposals}
        projectId={projectId}
        projectName={project?.name || 'Project'}
        isPolling={isPolling}
      />
    </div>
  )
}

export default function ProjectDetailPage() {
  return (
    <ErrorBoundary>
      <ProjectDetailContent />
    </ErrorBoundary>
  )
}
