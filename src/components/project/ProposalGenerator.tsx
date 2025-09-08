'use client'

import { useState } from 'react'
import { ProjectProposal } from '@/types'
import { Button } from '@/components/ui/button'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Zap, 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Loader2,
  Download,
  Eye
} from 'lucide-react'

interface ProposalGeneratorProps {
  isOpen: boolean
  onClose: () => void
  onGenerate: () => Promise<void>
  proposals: ProjectProposal[]
  projectId: string
  projectName: string
  isPolling?: boolean
}

export default function ProposalGenerator({ 
  isOpen, 
  onClose, 
  onGenerate, 
  proposals, 
  projectId,
  projectName,
  isPolling = false
}: ProposalGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
    setIsGenerating(true)
    try {
      await onGenerate()
    } catch (error) {
      console.error('Error generating proposal:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const getStatusIcon = (status: ProjectProposal['automation_status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />
      case 'processing':
        return <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />
    }
  }

  const getStatusColor = (status: ProjectProposal['automation_status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  const getProposalStatusColor = (status: ProjectProposal['status']) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      case 'sent':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const latestProposal = proposals.length > 0 ? proposals[0] : null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto mx-4">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-600" />
            Proposal Generator
            {isPolling && (
              <div className="flex items-center gap-1 ml-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-600 font-normal">Auto-updating</span>
              </div>
            )}
          </DialogTitle>
          <DialogDescription>
            Generate automated proposals using AI and n8n workflow integration for <strong>{projectName}</strong>
            {isPolling && (
              <span className="block text-xs text-green-600 mt-1">
                🔄 Checking for proposal updates every 30 seconds
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Generation Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Generate New Proposal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">AI-Powered Proposal Generation</h4>
                  <p className="text-sm text-blue-700">
                    Our system will analyze your project entries, files, and client information to generate a comprehensive proposal automatically.
                  </p>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    {latestProposal && (
                      <p>Last generated: {new Date(latestProposal.created_at).toLocaleDateString()}</p>
                    )}
                  </div>
                  <Button 
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4 mr-2" />
                        Generate Proposal
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Existing Proposals */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Proposal History</CardTitle>
            </CardHeader>
            <CardContent>
              {proposals.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No proposals generated yet</p>
                  <p className="text-sm text-gray-500 mt-1">Click &quot;Generate Proposal&quot; to create your first automated proposal</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {proposals.map((proposal) => (
                    <div key={proposal.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-gray-900">{proposal.title}</h4>
                            <Badge variant="outline">v{proposal.version}</Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            Created {new Date(proposal.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            {getStatusIcon(proposal.automation_status)}
                            <Badge className={getStatusColor(proposal.automation_status)}>
                              {proposal.automation_status}
                            </Badge>
                          </div>
                          <Badge className={getProposalStatusColor(proposal.status)}>
                            {proposal.status}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            if (proposal.content?.link) {
                              window.open(`https://docs.google.com/document/d/${proposal.content.link}`, '_blank')
                            }
                          }}
                          disabled={!proposal.content?.link}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                        {proposal.status === 'draft' && (
                          <Button variant="outline" size="sm">
                            <Zap className="h-4 w-4 mr-2" />
                            Send to Client
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Integration Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">How it Works</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-blue-600">1</span>
                  </div>
                  <p className="text-gray-700">System analyzes your project data (entries, files, client info)</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-blue-600">2</span>
                  </div>
                  <p className="text-gray-700">n8n workflow processes data through AI models</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-blue-600">3</span>
                  </div>
                  <p className="text-gray-700">Generates formatted proposal with timeline and pricing</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-blue-600">4</span>
                  </div>
                  <p className="text-gray-700">Review, customize, and send to client</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
