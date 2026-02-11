export interface User {
  id: string
  email: string
  name: string
  createdAt: string
  lastCheckIn?: string
  subscriptionPlan: string
  checkInFrequency: number // days
}

export interface Memory {
  id: string
  userId: string
  type: 'image' | 'video' | 'note' | 'diary' | 'document'
  title: string
  description?: string
  storageKey?: string // S3 key
  content?: string // For text-based memories
  fileSize?: number
  mimeType?: string
  metadata?: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

export interface Recipient {
  id: string
  userId: string
  name: string
  email: string
  relationship: string
  messageTemplate?: string
  createdAt: string
}

export interface CheckIn {
  id: string
  userId: string
  sentAt: string
  respondedAt?: string
  escalationLevel: number
  status: 'pending' | 'responded' | 'expired'
}

export interface ApiResponse<T> {
  data: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}
