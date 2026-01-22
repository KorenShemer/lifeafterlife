export type MemoryType = 'image' | 'video' | 'note' | 'diary' | 'document'

export interface MemoryFormData {
  title: string
  description?: string
  type: MemoryType
  file?: File
  content?: string
  metadata?: {
    dateTaken?: string
    location?: string
    tags?: string[]
  }
}

export interface UploadProgress {
  loaded: number
  total: number
  percentage: number
}
