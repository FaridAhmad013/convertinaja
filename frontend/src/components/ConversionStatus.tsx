import { CheckCircle2, Clock, AlertTriangle, Download, RefreshCw, FileArchive, PlusCircle, ExternalLink } from 'lucide-react'
import type { ConversionJobResult } from '../types/conversion'
import { useI18n } from '../i18n'

interface ConversionStatusProps {
  job: ConversionJobResult
  onReset: () => void
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

export function ConversionStatus({ job, onReset }: ConversionStatusProps) {
  const { t } = useI18n()

  const isCompleted = job.status === 'completed'
  const isFailed = job.status === 'failed'
  const isProcessing = job.status === 'processing' || job.status === 'queued' || job.status === 'uploading'

  return (
    <div className="w-full max-w-2xl mx-auto p-6 sm:p-8 bg-white rounded-2xl border border-[#E2E8F0] shadow-sm text-center space-y-6">
      {/* Dynamic Status Icon */}
      <div className="flex justify-center">
        {isCompleted && (
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10" />
          </div>
        )}
        {isProcessing && (
          <div className="w-16 h-16 rounded-full bg-blue-50 text-[#2563EB] flex items-center justify-center animate-spin">
            <Clock className="w-10 h-10" />
          </div>
        )}
        {isFailed && (
          <div className="w-16 h-16 rounded-full bg-red-50 text-[#DC2626] flex items-center justify-center">
            <AlertTriangle className="w-10 h-10" />
          </div>
        )}
      </div>

      {/* Status Title & Description */}
      <div className="space-y-2">
        <h3 className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight">
          {job.status === 'uploading' && t.status.uploading}
          {job.status === 'queued' && t.status.queued}
          {job.status === 'processing' && t.status.processing}
          {isCompleted && t.status.completed}
          {isFailed && t.status.failed}
        </h3>

        {job.errorMessage && (
          <p className="text-xs sm:text-sm text-[#DC2626] bg-red-50 p-3 rounded-lg border border-red-200">
            {job.errorMessage}
          </p>
        )}

        {isCompleted && (
          <p className="text-sm sm:text-base text-[#64748B]">
            {t.status.completedSub}
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

          {/* Retention notice: 10 minutes auto-delete */}
          <p className="text-xs text-[#64748B]">
            {t.status.retentionNotice}
          </p>

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
