'use client'

import { useState } from 'react'
import { CreateProjectEntryData, ProjectEntry } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Save, X } from 'lucide-react'

interface AddEntryModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (entry: CreateProjectEntryData) => Promise<void>
  projectId: string
}

const entryTypes: { value: ProjectEntry['entry_type']; label: string; color: string }[] = [
  { value: 'note', label: 'Note', color: 'bg-green-100 text-green-800' },
  { value: 'meeting', label: 'Meeting', color: 'bg-blue-100 text-blue-800' },
  { value: 'requirement', label: 'Requirement', color: 'bg-purple-100 text-purple-800' },
  { value: 'feedback', label: 'Feedback', color: 'bg-orange-100 text-orange-800' },
  { value: 'general', label: 'General', color: 'bg-gray-100 text-gray-800' },
]

export default function AddEntryModal({ isOpen, onClose, onSave, projectId }: AddEntryModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<CreateProjectEntryData>({
    title: '',
    body: '',
    entry_type: 'general',
    metadata: {}
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim() || !formData.body.trim()) return

    setIsSubmitting(true)
    try {
      await onSave(formData)
      // Reset form
      setFormData({
        title: '',
        body: '',
        entry_type: 'general',
        metadata: {}
      })
      onClose()
    } catch (error) {
      console.error('Error saving entry:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: keyof CreateProjectEntryData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto mx-4">
        <DialogHeader>
          <DialogTitle>Add New Entry</DialogTitle>
          <DialogDescription>
            Add notes, meeting details, requirements, or any project-related information.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Entry Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Entry Type
            </label>
            <div className="flex flex-wrap gap-2">
              {entryTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => handleChange('entry_type', type.value)}
                  className="transition-all"
                >
                  <Badge 
                    className={`cursor-pointer transition-all ${
                      formData.entry_type === type.value 
                        ? type.color + ' ring-2 ring-blue-500' 
                        : type.color + ' opacity-60 hover:opacity-100'
                    }`}
                  >
                    {type.label}
                  </Badge>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <Input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Enter entry title"
              required
            />
          </div>

          {/* Body */}
          <div>
            <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-2">
              Content *
            </label>
            <Textarea
              id="body"
              value={formData.body}
              onChange={(e) => handleChange('body', e.target.value)}
              placeholder="Enter detailed content..."
              rows={8}
              required
            />
          </div>

          {/* Meeting-specific fields */}
          {formData.entry_type === 'meeting' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="meeting_date" className="block text-sm font-medium text-gray-700 mb-2">
                  Meeting Date
                </label>
                <Input
                  id="meeting_date"
                  type="datetime-local"
                  onChange={(e) => handleChange('metadata', {
                    ...formData.metadata,
                    meeting_date: e.target.value
                  })}
                />
              </div>
              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (minutes)
                </label>
                <Input
                  id="duration"
                  type="number"
                  placeholder="60"
                  onChange={(e) => handleChange('metadata', {
                    ...formData.metadata,
                    duration: parseInt(e.target.value) || 0
                  })}
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || !formData.title.trim() || !formData.body.trim()}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Entry
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
