export type CategoryType = 'pdf' | 'image' | 'office'

export type FileFormat = 'pdf' | 'jpg' | 'jpeg' | 'png' | 'webp' | 'docx' | 'xlsx' | 'pptx' | 'doc' | 'odt' | 'unknown'

export interface UploadedFile {
  id: string
  file: File
  name: string
  size: number
  format: FileFormat
  isValid: boolean
  errorMessage?: string
}

export interface ToolDefinition {
  id: string
  name: string
  category: CategoryType
  description: string
  allowedFormats: FileFormat[]
  minFiles: number
  maxFiles: number
  outputFormat: string
  requiresOptions?: boolean
  optionsType?: 'compression_level' | 'page_range' | 'image_format'
}

export type JobStatus = 
  | 'idle'
  | 'uploading'
  | 'validating'
  | 'queued'
  | 'processing'
  | 'completed'
  | 'failed'

export interface ConversionJobResult {
  jobId: string
  accessToken: string
  status: JobStatus
  action: string
  downloadUrl?: string
  batchDownloadUrl?: string
  filesCount: number
  fileSize?: number
  expiresAt?: string
  errorMessage?: string
}
