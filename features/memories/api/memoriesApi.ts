import { apiClient } from '@/lib/api-client'
import { Memory, PaginatedResponse } from '@/shared/types/common.types'
import { MemoryFormData } from '../types/memory.types'

export const memoriesApi = {
  getAll: async (page = 1, pageSize = 20) => {
    const response = await apiClient.get<PaginatedResponse<Memory>>(
      `/memories?page=${page}&pageSize=${pageSize}`
    )
    return response.data
  },

  getById: async (id: string) => {
    const response = await apiClient.get<Memory>(`/memories/${id}`)
    return response.data
  },

  create: async (data: MemoryFormData) => {
    const response = await apiClient.post<Memory>('/memories', data)
    return response.data
  },

  update: async (id: string, data: Partial<MemoryFormData>) => {
    const response = await apiClient.patch<Memory>(`/memories/${id}`, data)
    return response.data
  },

  delete: async (id: string) => {
    await apiClient.delete(`/memories/${id}`)
  },

  getPresignedUploadUrl: async (fileName: string, fileType: string) => {
    const response = await apiClient.post<{
      uploadUrl: string
      memoryId: string
      storageKey: string
    }>('/memories/upload-url', { fileName, fileType })
    return response.data
  },

  confirmUpload: async (memoryId: string) => {
    const response = await apiClient.post<Memory>(
      `/memories/${memoryId}/confirm-upload`
    )
    return response.data
  },
}
