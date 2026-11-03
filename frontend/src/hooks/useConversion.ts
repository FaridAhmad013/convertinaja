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
const POLL_INTERVAL_MS = 1000 // Fast 1s polling for instant UI feedback

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
  const hasNotifiedSuccessRef = useRef<string | null>(null)

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
      }, 500)

      setTimeout(() => {
        updateJobState({
          jobId: simId,
          accessToken: simToken,
          status: 'processing',
          action: actionName,
          filesCount,
        })
      }, 1000)

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
      }, 1800)
    },
    [addToast, updateJobState]
  )

  // Start conversion
  const startConversion = useCallback(
    async (files: File[], tool: ToolDefinition, options: Record<string, unknown>) => {
      hasNotifiedSuccessRef.current = null

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
          status: created.status === 'completed' ? 'completed' : 'processing',
          action: tool.name,
          filesCount: files.length,
        })
      } catch (err) {
        if (err instanceof TypeError && err.message.includes('fetch')) {
          addToast('info', 'Backend API offline — menjalankan simulasi dev.')
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

  // Polling loop effect: Runs when active job is queued or processing
  useEffect(() => {
    if (!job?.jobId || !job.accessToken) return
    if (!['queued', 'processing', 'validating'].includes(job.status)) return

    let isSubscribed = true
    const currentJobId = job.jobId
    const currentToken = job.accessToken

    const poll = async () => {
      try {
        const res = await getJobStatus(currentJobId, currentToken)
        if (!isSubscribed) return

        if (res.status === 'completed') {
          updateJobState({
            jobId: currentJobId,
            accessToken: currentToken,
            status: 'completed',
            action: res.action,
            downloadUrl: res.download_url || buildDownloadUrl(currentJobId, currentToken),
            batchDownloadUrl: res.batch_download_url,
            files: res.files?.map((f) => ({
              index: f.index,
              name: f.name,
              size: f.size,
              downloadUrl: f.download_url,
              previewUrl: f.preview_url,
            })),
            filesCount: res.files ? res.files.length : 1,
            fileSize: res.file_size,
            expiresAt: res.expires_at,
          })

          if (hasNotifiedSuccessRef.current !== currentJobId) {
            hasNotifiedSuccessRef.current = currentJobId
            addToast('success', 'Konversi berhasil diselesaikan!')
          }
          return
        }

        if (res.status === 'failed') {
          updateJobState({
            jobId: currentJobId,
            accessToken: currentToken,
            status: 'failed',
            action: res.action,
            filesCount: 1,
            errorMessage: res.error_message || 'Proses konversi gagal.',
          })
          addToast('error', res.error_message || 'Konversi gagal diproses.')
          return
        }

        // Only update if status string changed to avoid re-triggering effects unnecessarily
        if (res.status !== job.status) {
          updateJobState({
            jobId: currentJobId,
            accessToken: currentToken,
            status: res.status,
            action: res.action,
            filesCount: 1,
          })
        }
      } catch {
        // Silently retry on transient network hiccups during polling
      }
    }

    // Trigger immediate check, then interval every 1 second
    poll()
    const intervalTimer = setInterval(poll, POLL_INTERVAL_MS)

    return () => {
      isSubscribed = false
      clearInterval(intervalTimer)
    }
  }, [job?.jobId, job?.accessToken, job?.status, addToast, updateJobState])

  const resetJob = useCallback(() => {
    hasNotifiedSuccessRef.current = null
    if (job?.jobId && job.accessToken) {
      cancelConversionJob(job.jobId, job.accessToken).catch(() => {})
    }
    updateJobState(null)
  }, [job, updateJobState])

  return {
    job,
    toasts,
    startConversion,
    resetJob,
    addToast,
    dismissToast,
  }
}
