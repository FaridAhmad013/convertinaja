import type { JobStatus } from '../types/conversion'

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1'

export interface CreateJobResponse {
  job_id: string
  access_token: string
  status: JobStatus
  action: string
  created_at: string
}

export interface JobFileResponse {
  index: number
  name: string
  size: number
  download_url: string
  preview_url: string
}

export interface JobStatusResponse {
  job_id: string
  status: JobStatus
  action: string
  download_url?: string
  batch_download_url?: string
  file_size?: number
  files?: JobFileResponse[]
  error_message?: string
  created_at: string
  completed_at?: string
  expires_at?: string
}

export class ApiError extends Error {
  statusCode: number

  constructor(message: string, statusCode: number) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
  }
}

function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export async function createConversionJob(
  files: File[],
  action: string,
  options?: Record<string, unknown>
): Promise<CreateJobResponse> {
  const requestUID = generateUUID()
  const formData = new FormData()
  formData.append('action', action)
  formData.append('request_id', requestUID)

  if (options && Object.keys(options).length > 0) {
    formData.append('options', JSON.stringify(options))
  }

  for (const file of files) {
    formData.append('files', file)
  }

  const response = await fetch(`${API_BASE_URL}/conversions`, {
    method: 'POST',
    headers: {
      'X-Request-ID': requestUID,
    },
    body: formData,
  })

  if (!response.ok) {
    let errorMsg = 'Gagal membuat permintaan konversi.'
    try {
      const errJson = await response.json()
      if (errJson.error) errorMsg = errJson.error
    } catch {
      // Fallback to HTTP status text
      errorMsg = response.statusText || errorMsg
    }
    throw new ApiError(errorMsg, response.status)
  }

  return response.json()
}

export async function getJobStatus(jobId: string, token: string): Promise<JobStatusResponse> {
  const response = await fetch(`${API_BASE_URL}/conversions/${jobId}?token=${encodeURIComponent(token)}`, {
    headers: {
      'Accept': 'application/json',
      'X-Job-Token': token,
    },
  })

  if (!response.ok) {
    let errorMsg = 'Gagal memeriksa status pekerjaan konversi.'
    try {
      const errJson = await response.json()
      if (errJson.error) errorMsg = errJson.error
    } catch {
      errorMsg = response.statusText || errorMsg
    }
    throw new ApiError(errorMsg, response.status)
  }

  return response.json()
}

export async function optimizeImageJob(
  files: File[],
  toolId: string,
  options?: Record<string, unknown>
): Promise<{
  job_id: string
  access_token: string
  batchRes: {
    job_id: string
    status: string
    total_original_bytes: number
    total_optimized_bytes: number
    total_saved_bytes: number
    total_reduction_percent: number
    items: Array<{
      status: string
      original: {
        filename?: string
        format: string
        size: number
        width: number
        height: number
        has_alpha: boolean
        orientation: number
      }
      optimized: {
        format: string
        size: number
        width: number
        height: number
      }
      reduction_percent: number
      saved_bytes: number
      target_reached: boolean
      download_url: string
      preview_url?: string
      error_message?: string
    }>
    zip_download_url?: string
  }
}> {
  const formData = new FormData()

  // Format options
  const config = {
    mode: options?.mode || (toolId === 'smart-optimize' ? 'smart' : 'manual'),
    output_format: options?.output_format || 'auto',
    quality: options?.quality || 80,
    max_width: options?.max_width || 0,
    max_height: options?.max_height || 0,
    maintain_aspect_ratio: options?.maintain_aspect_ratio !== false,
    remove_metadata: options?.remove_metadata !== false,
    quality_strategy: options?.quality_strategy || 'balanced',
    target_size: options?.target_size_value
      ? {
          value: options.target_size_value,
          unit: options.target_size_unit || 'KB',
        }
      : undefined,
  }

  formData.append('config', JSON.stringify(config))

  for (const file of files) {
    formData.append('files', file)
  }

  const response = await fetch(`${API_BASE_URL}/image/optimize`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    let errorMsg = 'Gagal mengoptimasi gambar.'
    try {
      const errJson = await response.json()
      if (errJson.error) errorMsg = errJson.error
    } catch {
      errorMsg = response.statusText || errorMsg
    }
    throw new ApiError(errorMsg, response.status)
  }

  const token = response.headers.get('X-Job-Token') || ''
  const batchRes = await response.json()

  return {
    job_id: batchRes.job_id || generateUUID(),
    access_token: token,
    batchRes,
  }
}

export function buildDownloadUrl(jobId: string, token: string): string {
  return `${API_BASE_URL}/conversions/${encodeURIComponent(jobId)}/download?token=${encodeURIComponent(token)}`
}

export function buildDownloadSelectedUrl(jobId: string, token: string, indices: number[]): string {
  return `${API_BASE_URL}/conversions/${encodeURIComponent(jobId)}/download?token=${encodeURIComponent(token)}&indices=${indices.join(',')}`
}

export async function cancelConversionJob(jobId: string, token: string): Promise<void> {
  await fetch(`${API_BASE_URL}/conversions/${encodeURIComponent(jobId)}?token=${encodeURIComponent(token)}`, {
    method: 'DELETE',
    headers: {
      'X-Job-Token': token,
    },
  })
}
