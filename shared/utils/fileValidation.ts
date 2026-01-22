const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime']
const ALLOWED_DOCUMENT_TYPES = ['application/pdf', 'text/plain']

export function validateFile(file: File, type: 'image' | 'video' | 'document') {
  const errors: string[] = []

  if (file.size > MAX_FILE_SIZE) {
    errors.push('File size exceeds 100MB limit')
  }

  let allowedTypes: string[] = []
  switch (type) {
    case 'image':
      allowedTypes = ALLOWED_IMAGE_TYPES
      break
    case 'video':
      allowedTypes = ALLOWED_VIDEO_TYPES
      break
    case 'document':
      allowedTypes = ALLOWED_DOCUMENT_TYPES
      break
  }

  if (!allowedTypes.includes(file.type)) {
    errors.push(`Invalid file type. Allowed: ${allowedTypes.join(', ')}`)
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}
