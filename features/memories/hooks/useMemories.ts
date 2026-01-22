import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { memoriesApi } from '../api/memoriesApi'
import { MemoryFormData } from '../types/memory.types'

export function useMemories(page = 1, pageSize = 20) {
  return useQuery({
    queryKey: ['memories', page, pageSize],
    queryFn: () => memoriesApi.getAll(page, pageSize),
  })
}

export function useMemory(id: string) {
  return useQuery({
    queryKey: ['memory', id],
    queryFn: () => memoriesApi.getById(id),
    enabled: !!id,
  })
}

export function useCreateMemory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: MemoryFormData) => memoriesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memories'] })
    },
  })
}

export function useDeleteMemory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => memoriesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memories'] })
    },
  })
}
