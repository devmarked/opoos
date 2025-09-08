// Common types for the Starter Template

// ---- Auth / User ----
export enum UserRole {
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  USER = 'user',
}

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  createdAt: Date
  updatedAt: Date
}

// Aligns with common Supabase profile shapes (snake_case + ISO strings)
export interface UserProfile {
  id: string
  user_id: string
  username: string | null
  full_name: string | null
  country: string | null
  avatar_url: string | null
  bio: string | null
  created_at: string
  updated_at: string
}

export interface ProfileUpdateData {
  username?: string
  full_name?: string
  country?: string
  bio?: string
  avatar_url?: string
}

// ---- API Helpers ----
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface Paginated<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}

// ---- Project Management ----
export interface Project {
  id: string
  user_id: string
  name: string
  description: string | null
  client_name: string | null
  client_email: string | null
  status: 'active' | 'completed' | 'archived'
  created_at: string
  updated_at: string
}

export interface ProjectEntry {
  id: string
  project_id: string
  user_id: string
  title: string
  body: string
  entry_type: 'note' | 'meeting' | 'requirement' | 'feedback' | 'general'
  metadata: Record<string, any>
  created_at: string
  updated_at: string
}

export interface ProjectFile {
  id: string
  project_id: string
  user_id: string
  name: string
  original_name: string
  file_type: 'document' | 'image' | 'audio' | 'video' | 'other'
  mime_type: string
  file_size: number
  storage_path: string
  folder_path: string
  tags: string[]
  metadata: Record<string, any>
  created_at: string
  updated_at: string
}

export interface ProjectProposal {
  id: string
  project_id: string
  user_id: string
  version: number
  title: string
  content: Record<string, any>
  status: 'draft' | 'sent' | 'approved' | 'rejected'
  automation_status: 'pending' | 'processing' | 'completed' | 'failed'
  automation_data: Record<string, any>
  created_at: string
  updated_at: string
}

export interface CreateProjectData {
  name: string
  description?: string
  client_name?: string
  client_email?: string
}

export interface CreateProjectEntryData {
  title: string
  body: string
  entry_type?: ProjectEntry['entry_type']
  metadata?: Record<string, any>
}

export interface UpdateProjectEntryData {
  title?: string
  body?: string
  entry_type?: ProjectEntry['entry_type']
  metadata?: Record<string, any>
}