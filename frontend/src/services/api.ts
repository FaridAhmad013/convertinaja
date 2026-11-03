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
