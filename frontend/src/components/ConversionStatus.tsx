import { useState } from 'react'
import { CheckCircle2, AlertCircle, Download, FileArchive, RefreshCw, Clock, Trash2, ShieldCheck } from 'lucide-react'
import type { ConversionJobResult } from '../types/conversion'
import { cancelConversionJob } from '../services/api'
import { useI18n } from '../i18n'

interface ConversionStatusProps {
  job: ConversionJobResult
  onReset: () => void
}

export function ConversionStatus({ job, onReset }: ConversionStatusProps) {
  const { t } = useI18n()
  const [isPurging, setIsPurging] = useState(false)
  const [isPurged, setIsPurged] = useState(false)

  const isCompleted = job.status === 'completed'
  const isFailed = job.status === 'failed'
  const isProcessing = ['uploading', 'validating', 'queued', 'processing'].includes(job.status)

  const getStatusText = () => {
    switch (job.status) {
      case 'uploading':
        return t.status.uploading
      case 'validating':
        return t.status.validating
      case 'queued':
        return t.status.queued
      case 'processing':
        return t.status.processing
      case 'completed':
        return t.status.completed
      case 'failed':
        return t.status.failed
      default:
        return t.status.processing
    }
  }

  const handlePurgeNow = async () => {
    if (!job.jobId || !job.accessToken) return
    setIsPurging(true)
    try {
      await cancelConversionJob(job.jobId, job.accessToken)
      setIsPurged(true)
    } catch (err) {
      console.error('Failed to purge job immediately:', err)
    } finally {
      setIsPurging(false)
    }
  }

  return (
    <div className="w-full max-w-[800px] mx-auto bg-white border border-[#E2E8F0] rounded-xl p-6 sm:p-8 text-center shadow-xs space-y-6">
      {/* Icon Status Indicator */}
      <div className="flex justify-center">
        {isCompleted && (
          <div className="w-14 h-14 rounded-full bg-emerald-50 text-[#16A34A] flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>
        )}
        {isFailed && (
          <div className="w-14 h-14 rounded-full bg-red-50 text-[#DC2626] flex items-center justify-center">
            <AlertCircle className="w-8 h-8" />
          </div>
        )}
        {isProcessing && (
          <div className="w-14 h-14 rounded-full bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
            <RefreshCw className="w-7 h-7 animate-spin" />
          </div>
        )}
      </div>

      {/* Status Heading & Description */}
      <div>
        <h3 className="text-xl sm:text-2xl font-bold text-[#0F172A] mb-1">
          {getStatusText()}
        </h3>
        {isCompleted && (
          <p className="text-sm text-[#64748B]">
            {t.status.completedSub}
          </p>
        )}
        {isFailed && (
          <p className="text-sm text-[#DC2626]">
            {job.errorMessage || 'Terjadi kesalahan saat memproses file.'}
          </p>
        )}
        {isProcessing && (
          <p className="text-sm text-[#64748B]">
            {t.status.processingSub}
          </p>
        )}
      </div>

      {/* Progress Bar Animation (when processing) */}
      {isProcessing && (
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
          <div className="bg-[#2563EB] h-2 rounded-full animate-pulse w-3/4 transition-all duration-500" />
        </div>
      )}

      {/* Download Action Buttons (when completed) */}
      {isCompleted && (
        <div className="space-y-4 pt-2">
          {!isPurged ? (
            <>
              {/* Main Direct Download */}
              {job.downloadUrl && (
                <a
                  href={job.downloadUrl}
                  download
                  className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-sm shadow-xs transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>{t.status.downloadButton}</span>
                </a>
              )}

              {/* Batch ZIP Download button */}
              {job.batchDownloadUrl && (
                <div>
                  <a
                    href={job.batchDownloadUrl}
                    download
                    className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-2.5 rounded-lg border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] text-[#0F172A] font-medium text-xs transition-colors mt-2"
                  >
                    <FileArchive className="w-4 h-4 text-[#2563EB]" />
                    <span>{t.status.downloadZipButton}</span>
                  </a>
                </div>
              )}

              {/* Privacy Retention Notice & Immediate Hard Purge Button */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 text-xs text-[#64748B]">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  <span>{t.status.retentionNotice}</span>
                </div>
                <span className="hidden sm:inline">•</span>
                <button
                  type="button"
                  onClick={handlePurgeNow}
                  disabled={isPurging}
                  className="inline-flex items-center gap-1 text-[#DC2626] hover:underline font-medium cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{isPurging ? 'Menghapus...' : t.status.purgeNow}</span>
                </button>
              </div>
            </>
          ) : (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-medium flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{t.status.purgedSuccess}</span>
            </div>
          )}
        </div>
      )}

      {/* Reset / Convert Again */}
      {(isCompleted || isFailed) && (
        <div className="pt-4 border-t border-[#E2E8F0]">
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#2563EB] hover:text-[#1D4ED8] cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>{t.status.convertAgain}</span>
          </button>
        </div>
      )}
    </div>
  )
}
