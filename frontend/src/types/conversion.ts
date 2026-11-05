export type CategoryType = 'pdf' | 'image' | 'office'

export type FileFormat = 'pdf' | 'jpg' | 'jpeg' | 'png' | 'webp' | 'docx' | 'xlsx' | 'pptx' | 'doc' | 'odt' | 'txt' | 'unknown'

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
  descriptionEn?: string
  allowedFormats: FileFormat[]
  minFiles: number
  maxFiles: number
  outputFormat: string
  requiresOptions?: boolean
  optionsType?: 'compression_level' | 'page_range' | 'image_format' | 'quality' | 'image_optimizer'
}

export type JobStatus = 
  | 'idle'
  | 'uploading'
  | 'validating'
  | 'queued'
  | 'processing'
  | 'completed'
  | 'failed'

export interface ImageOptimizationStats {
  originalWidth?: number
  originalHeight?: number
  originalSize?: number
  optimizedWidth?: number
  optimizedHeight?: number
  optimizedSize?: number
  reductionPercent?: number
  savedBytes?: number
  targetReached?: boolean
  format?: string
}

export interface ConvertedFileItem {
  index: number
  name: string
  size: number
  downloadUrl: string
  previewUrl: string
  stats?: ImageOptimizationStats
}

export interface ConversionJobResult {
  jobId: string
  accessToken: string
  status: JobStatus
  action: string
  downloadUrl?: string
  batchDownloadUrl?: string
  files?: ConvertedFileItem[]
  filesCount: number
  fileSize?: number
  expiresAt?: string
  errorMessage?: string
  imageStats?: ImageOptimizationStats
}
