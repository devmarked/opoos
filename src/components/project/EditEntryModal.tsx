'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ProjectEntry, UpdateProjectEntryData } from '@/types'
import { Badge } from '@/components/ui/badge'

interface EditEntryModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (entryId: string, data: UpdateProjectEntryData) => Promise<void>
  onDelete: (entryId: string) => Promise<void>
  entry: ProjectEntry | null
}

const entryTypes: { value: ProjectEntry['entry_type']; label: string; color: string }[] = [
  { value: 'note', label: 'Note', color: 'bg-green-100 text-green-800' },
  { value: 'meeting', label: 'Meeting', color: 'bg-blue-100 text-blue-800' },
  { value: 'requirement', label: 'Requirement', color: 'bg-purple-100 text-purple-800' },
  { value: 'feedback', label: 'Feedback', color: 'bg-orange-100 text-orange-800' },
  { value: 'general', label: 'General', color: 'bg-gray-100 text-gray-800' },
]

export default function EditEntryModal({ isOpen, onClose, onSave, onDelete, entry }: EditEntryModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [formData, setFormData] = useState<UpdateProjectEntryData>({
    title: '',
    body: '',
    entry_type: 'general',
    metadata: {}
  })

  // Update form data when entry changes
  useEffect(() => {
    if (entry) {
      setFormData({
        title: entry.title,
        body: entry.body,
        entry_type: entry.entry_type,
        metadata: entry.metadata || {}
      })
    }
  }, [entry])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!entry || !formData.title?.trim() || !formData.body?.trim()) return

    setIsSubmitting(true)
    try {
      await onSave(entry.id, formData)
      onClose()
    } catch (error) {
      console.error('Error updating entry:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!entry) return

    if (!confirm('Are you sure you want to delete this entry? This action cannot be undone.')) {
      return
    }

    setIsDeleting(true)
    try {
      await onDelete(entry.id)
      onClose()
    } catch (error) {
      console.error('Error deleting entry:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleChange = (field: keyof UpdateProjectEntryData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  if (!entry) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Entry</DialogTitle>
          <DialogDescription>
            Update the details of your note or meeting entry.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title || ''}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Enter entry title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="entry_type">Type</Label>
            <Select
              value={formData.entry_type || 'general'}
              onValueChange={(value: ProjectEntry['entry_type']) => handleChange('entry_type', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select entry type" />
              </SelectTrigger>
              <SelectContent>
                {entryTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center gap-2">
                      <Badge className={type.color}>
                        {type.label}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="body">Content</Label>
            <Textarea
              id="body"
              value={formData.body || ''}
              onChange={(e) => handleChange('body', e.target.value)}
              placeholder="Enter entry content"
              rows={8}
              required
            />
          </div>

          <div className="flex justify-between">
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isSubmitting || isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete Entry'}
            </Button>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting || isDeleting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || isDeleting || !formData.title?.trim() || !formData.body?.trim()}
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
