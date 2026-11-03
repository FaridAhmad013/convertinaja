import { useState, useEffect, useCallback, useRef } from 'react'
import type { ConversionJobResult, ToolDefinition } from '../types/conversion'
import type { ToastMessage } from '../components/Toast'
import {
  createConversionJob,
  getJobStatus,
  buildDownloadUrl,
  cancelConversionJob,
  ApiError,
} from '../services/api'

const STORAGE_KEY = 'convertinaja_active_job'
const POLL_INTERVAL_MS = 2000
const MAX_POLL_ATTEMPTS = 60 // 2 minutes max polling

export function useConversion() {
  const [job, setJob] = useState<ConversionJobResult | null>(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  const [toasts, setToasts] = useState<ToastMessage[]>([])
  const pollAttempts = useRef(0)
  const pollTimeoutRef = useRef<number | null>(null)
  const pollingJobIdRef = useRef<string | null>(null)
  const pollJobStatusRef = useRef<(jobId: string, token: string) => Promise<void>>(async () => {})

  // Sync active job to sessionStorage
  const updateJobState = useCallback((newJob: ConversionJobResult | null) => {
    setJob(newJob)
    try {
      if (newJob) {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(newJob))
      } else {
        sessionStorage.removeItem(STORAGE_KEY)
      }
    } catch {
      // Ignore storage errors in private browsing modes
    }
  }, [])

  const addToast = useCallback((type: 'error' | 'success' | 'info', text: string) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, type, text }])

    // Auto dismiss after 5s
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 5000)
  }, [])

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  // Dev simulation when backend is offline
  const runDevSimulation = useCallback(
    (filesCount: number, actionName: string) => {
      const simId = Math.random().toString(36).substring(2, 10)
      const simToken = Math.random().toString(36).substring(2, 8)

      setTimeout(() => {
        updateJobState({
          jobId: simId,
          accessToken: simToken,
          status: 'validating',
          action: actionName,
          filesCount,
        })
      }, 800)

      setTimeout(() => {
        updateJobState({
          jobId: simId,
          accessToken: simToken,
          status: 'processing',
          action: actionName,
          filesCount,
        })
      }, 1800)

      setTimeout(() => {
        updateJobState({
          jobId: simId,
          accessToken: simToken,
          status: 'completed',
          action: actionName,
          downloadUrl: `#download-simulated-${simId}`,
          batchDownloadUrl: filesCount > 1 ? `#batch-simulated-${simId}.zip` : undefined,
          filesCount,
          fileSize: 1024 * 350,
        })
        addToast('success', 'Konversi dev berhasil diselesaikan!')
      }, 3600)
    },
    [addToast, updateJobState]
  )

  // Poll job status from API
  const pollJobStatus = useCallback(
    async (jobId: string, token: string) => {
      try {
        const res = await getJobStatus(jobId, token)

        if (res.status === 'completed') {
          pollingJobIdRef.current = null
          updateJobState({
            jobId,
            accessToken: token,
            status: 'completed',
            action: res.action,
            downloadUrl: res.download_url || buildDownloadUrl(jobId, token),
            batchDownloadUrl: res.batch_download_url,
            filesCount: 1,
            fileSize: res.file_size,
            expiresAt: res.expires_at,
          })
          addToast('success', 'Konversi berhasil diselesaikan!')
          return
        }

        if (res.status === 'failed') {
          pollingJobIdRef.current = null
          updateJobState({
            jobId,
            accessToken: token,
            status: 'failed',
            action: res.action,
            filesCount: 1,
            errorMessage: res.error_message || 'Proses konversi gagal.',
          })
          addToast('error', res.error_message || 'Konversi gagal diproses.')
          return
        }

        // Still queued or processing
        updateJobState({
          jobId,
          accessToken: token,
          status: res.status,
          action: res.action,
          filesCount: 1,
        })

        pollAttempts.current += 1
        if (pollAttempts.current < MAX_POLL_ATTEMPTS) {
          pollTimeoutRef.current = window.setTimeout(() => {
            pollJobStatusRef.current(jobId, token)
          }, POLL_INTERVAL_MS)
        } else {
          updateJobState({
            jobId,
            accessToken: token,
            status: 'failed',
            action: res.action,
            filesCount: 1,
            errorMessage: 'Batas waktu pengerjaan konversi habis (timeout).',
          })
          addToast('error', 'Waktu konversi habis. Silakan coba kembali.')
        }
      } catch (err) {
        const errorMsg = err instanceof ApiError ? err.message : 'Koneksi ke server terputus.'
        addToast('error', errorMsg)
      }
    },
    [addToast, updateJobState]
  )

  // Keep ref updated
  useEffect(() => {
    pollJobStatusRef.current = pollJobStatus
  }, [pollJobStatus])

  // Start conversion
  const startConversion = useCallback(
    async (files: File[], tool: ToolDefinition, options: Record<string, unknown>) => {
      pollAttempts.current = 0
      if (pollTimeoutRef.current) clearTimeout(pollTimeoutRef.current)

      // Initial local state: uploading
      const tempId = Math.random().toString(36).substring(2, 9)
      updateJobState({
        jobId: tempId,
        accessToken: '',
        status: 'uploading',
        action: tool.name,
        filesCount: files.length,
      })

      try {
        const created = await createConversionJob(files, tool.id, options)

        updateJobState({
          jobId: created.job_id,
          accessToken: created.access_token,
          status: 'queued',
          action: tool.name,
          filesCount: files.length,
        })

        // Begin polling
        pollingJobIdRef.current = created.job_id
        pollJobStatusRef.current(created.job_id, created.access_token)
      } catch (err) {
        // Fallback for development if backend API server is not running yet
        if (err instanceof TypeError && err.message.includes('fetch')) {
          addToast('info', 'Backend API offline — menjalankan simulasi konversi dev.')
          runDevSimulation(files.length, tool.name)
          return
        }

        const msg = err instanceof ApiError ? err.message : 'Terjadi kesalahan saat memulai konversi.'
        updateJobState({
          jobId: tempId,
          accessToken: '',
          status: 'failed',
          action: tool.name,
          filesCount: files.length,
          errorMessage: msg,
        })
        addToast('error', msg)
      }
    },
    [addToast, runDevSimulation, updateJobState]
  )

  const resetJob = useCallback(() => {
    if (pollTimeoutRef.current) clearTimeout(pollTimeoutRef.current)
    pollingJobIdRef.current = null
    if (job?.jobId && job.accessToken) {
      cancelConversionJob(job.jobId, job.accessToken).catch(() => {})
    }
    updateJobState(null)
  }, [job, updateJobState])

  // Resume polling on refresh if active job was processing
  useEffect(() => {
    if (
      job?.jobId &&
      job.accessToken &&
      ['queued', 'processing'].includes(job.status) &&
      pollingJobIdRef.current !== job.jobId
    ) {
      pollingJobIdRef.current = job.jobId
      pollJobStatusRef.current(job.jobId, job.accessToken)
    }

    return () => {
      if (pollTimeoutRef.current) clearTimeout(pollTimeoutRef.current)
    }
  }, [job?.jobId, job?.accessToken, job?.status])

  return {
    job,
    toasts,
    startConversion,
    resetJob,
    addToast,
    dismissToast,
  }
}
