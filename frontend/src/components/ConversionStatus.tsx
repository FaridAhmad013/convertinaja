import { useState } from 'react'
import { CheckCircle2, AlertCircle, Download, FileArchive, PlusCircle, RefreshCw, ShieldCheck, Trash2, ExternalLink } from 'lucide-react'
import type { ConversionJobResult } from '../types/conversion'
import { cancelConversionJob } from '../services/api'
import { useI18n } from '../i18n'

interface ConversionStatusProps {
  job: ConversionJobResult
  onReset: () => void
}

function formatBytes(bytes?: number): string {
  if (!bytes) return ''
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

export function ConversionStatus({ job, onReset }: ConversionStatusProps) {
  const { t } = useI18n()
  const [isPurging, setIsPurging] = useState(false)
  const [isPurged, setIsPurged] = useState(false)

  const isCompleted = job.status === 'completed'
  const isFailed = job.status === 'failed'
  const isProcessing = ['uploading', 'validating', 'queued', 'processing'].includes(job.status)

  const handlePurgeNow = async () => {
    if (!job.jobId || !job.accessToken) return
    setIsPurging(true)
    try {
      await cancelConversionJob(job.jobId, job.accessToken)
      setIsPurged(true)
    } catch (err) {
      console.error('Failed to purge job:', err)
    } finally {
      setIsPurging(false)
    }
  }

  return (
    <div className="w-full max-w-[800px] mx-auto bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-10 text-center shadow-sm space-y-6">
      {/* Icon Status Indicator */}
      <div className="flex justify-center">
        {isCompleted && (
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-[#16A34A] flex items-center justify-center shadow-xs">
            <CheckCircle2 className="w-9 h-9" />
          </div>
        )}
        {isFailed && (
          <div className="w-16 h-16 rounded-full bg-red-50 text-[#DC2626] flex items-center justify-center">
            <AlertCircle className="w-9 h-9" />
          </div>
        )}
        {isProcessing && (
          <div className="w-16 h-16 rounded-full bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
            <RefreshCw className="w-8 h-8 animate-spin" />
          </div>
        )}
      </div>

      {/* Status Heading & Description */}
      <div>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight mb-2">
          {isCompleted
            ? t.status.completed
            : isFailed
              ? t.status.failed
              : t.status.processing}
        </h3>
        {isCompleted && (
          <p className="text-sm sm:text-base text-[#64748B]">
            {t.status.completedSub}
          </p>
        )}
        {isFailed && (
          <p className="text-sm sm:text-base text-[#DC2626]">
            {job.errorMessage || 'Terjadi kesalahan saat memproses berkas.'}
          </p>
        )}
        {isProcessing && (
          <p className="text-sm sm:text-base text-[#64748B]">
            {t.status.processingSub}
          </p>
        )}
      </div>

      {/* Progress Bar Animation (when processing) */}
      {isProcessing && (
        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
          <div className="bg-[#2563EB] h-2.5 rounded-full animate-pulse w-3/4 transition-all duration-500" />
        </div>
      )}

      {/* Completed State Actions */}
      {isCompleted && (
        <div className="space-y-6 pt-2">
          {!isPurged ? (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              {/* Main Super-Prominent Direct Download Button */}
              {job.downloadUrl && (
                <a
                  href={job.downloadUrl}
                  download
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-base shadow-md hover:shadow-lg transition-all scale-[1.02] cursor-pointer"
                >
                  <Download className="w-5 h-5 stroke-[2.5]" />
                  <span>{t.status.downloadButton}</span>
                  {job.fileSize && (
                    <span className="text-xs bg-white/20 px-2 py-0.5 rounded-md font-semibold">
                      {formatBytes(job.fileSize)}
                    </span>
                  )}
                </a>
              )}

              {/* Batch ZIP Download button (if available) */}
              {job.batchDownloadUrl && (
                <a
                  href={job.batchDownloadUrl}
                  download
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl border-2 border-[#2563EB] text-[#2563EB] bg-[#EFF6FF] hover:bg-blue-100 font-semibold text-sm transition-colors cursor-pointer"
                >
                  <FileArchive className="w-4 h-4" />
                  <span>{t.status.downloadZipButton}</span>
                </a>
              )}

              {/* Upload Another / Convert More Button */}
              <button
                type="button"
                onClick={onReset}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl border border-[#E2E8F0] bg-slate-50 hover:bg-slate-100 text-[#0F172A] font-semibold text-sm transition-colors cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 text-[#2563EB]" />
                <span>{t.status.convertAgain}</span>
              </button>
            </div>
          ) : (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm font-semibold flex items-center justify-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>{t.status.purgedSuccess}</span>
            </div>
          )}

          {/* Zero-Storage Assurance & Immediate Purge Option */}
          {!isPurged && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-xs text-[#64748B] pt-2">
              <div className="flex items-center gap-1.5 text-emerald-700 font-medium bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200/60">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero-Storage: Berkas sumber Anda langsung dimusnahkan seketika.</span>
              </div>
              <button
                type="button"
                onClick={handlePurgeNow}
                disabled={isPurging}
                className="inline-flex items-center gap-1 text-[#DC2626] hover:underline cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isPurging ? 'Menghapus...' : 'Hapus Hasil dari Server Sekarang'}</span>
              </button>
            </div>
          )}

          {/* Ads Placement: Post-Conversion High-CTR Area */}
          <div className="mt-8 pt-6 border-t border-[#E2E8F0]">
            <div className="max-w-md mx-auto p-4 rounded-xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] text-center space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
                Sponsor / Iklan
              </span>
              <p className="text-xs font-semibold text-[#0F172A] flex items-center justify-center gap-1">
                <span>Click on the ads to help the creator</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#2563EB]" />
              </p>
              <div className="w-full h-24 bg-white border border-[#E2E8F0] rounded-lg flex items-center justify-center text-xs text-[#94A3B8]">
                Ruang Iklan Google AdSense / Sponsor (300x100)
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Failed State Reset */}
      {isFailed && (
        <div className="pt-4 border-t border-[#E2E8F0]">
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-sm cursor-pointer shadow-xs"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Coba Unggah Ulang</span>
          </button>
        </div>
      )}
    </div>
  )
}
