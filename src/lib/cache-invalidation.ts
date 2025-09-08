import { useCache } from '@/contexts/CacheContext'

// Cache invalidation utilities for different operations
export const useCacheInvalidation = () => {
  const cache = useCache()

  const invalidateProject = (projectId: string) => {
    // Invalidate specific project and related data
    cache.invalidate([
      `project:${projectId}`,
      `entries:${projectId}`,
      `files:${projectId}`,
      `proposals:${projectId}`
    ])
    // Also invalidate projects list
    cache.invalidatePattern('projects:')
  }

  const invalidateProjects = () => {
    // Invalidate all projects-related cache
    cache.invalidatePattern('projects:')
  }

  const invalidateProjectEntries = (projectId: string) => {
    cache.invalidate(`entries:${projectId}`)
  }

  const invalidateProjectFiles = (projectId: string) => {
    cache.invalidate(`files:${projectId}`)
  }

  const invalidateProjectProposals = (projectId: string) => {
    cache.invalidate(`proposals:${projectId}`)
  }

  const invalidateStats = () => {
    cache.invalidatePattern('stats:')
  }

  const invalidateAll = () => {
    cache.clear()
  }

  return {
    invalidateProject,
    invalidateProjects,
    invalidateProjectEntries,
    invalidateProjectFiles,
    invalidateProjectProposals,
    invalidateStats,
    invalidateAll
  }
}

// Hook for automatic cache invalidation on data mutations
export const useCacheInvalidationOnMutation = () => {
  const { 
    invalidateProject, 
    invalidateProjects, 
    invalidateProjectEntries, 
    invalidateProjectFiles, 
    invalidateProjectProposals 
  } = useCacheInvalidation()

  const onProjectCreated = () => {
    invalidateProjects()
  }

  const onProjectUpdated = (projectId: string) => {
    invalidateProject(projectId)
  }

  const onProjectDeleted = (projectId: string) => {
    invalidateProject(projectId)
    invalidateProjects()
  }

  const onEntryCreated = (projectId: string) => {
    invalidateProjectEntries(projectId)
  }

  const onEntryUpdated = (projectId: string) => {
    invalidateProjectEntries(projectId)
  }

  const onEntryDeleted = (projectId: string) => {
    invalidateProjectEntries(projectId)
  }

  const onFileUploaded = (projectId: string) => {
    invalidateProjectFiles(projectId)
  }

  const onFileDeleted = (projectId: string) => {
    invalidateProjectFiles(projectId)
  }

  const onProposalGenerated = (projectId: string) => {
    invalidateProjectProposals(projectId)
  }

  const onProposalUpdated = (projectId: string) => {
    invalidateProjectProposals(projectId)
  }

  const onProposalDeleted = (projectId: string) => {
    invalidateProjectProposals(projectId)
  }

  return {
    onProjectCreated,
    onProjectUpdated,
    onProjectDeleted,
    onEntryCreated,
    onEntryUpdated,
    onEntryDeleted,
    onFileUploaded,
    onFileDeleted,
    onProposalGenerated,
    onProposalUpdated,
    onProposalDeleted
  }
}

