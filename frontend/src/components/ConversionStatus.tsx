import { CheckCircle2, AlertCircle, Download, FileArchive, RefreshCw, Clock } from 'lucide-react'
import type { ConversionJobResult } from '../types/conversion'

interface ConversionStatusProps {
  job: ConversionJobResult
  onReset: () => void
}

export function ConversionStatus({ job, onReset }: ConversionStatusProps) {
  const isCompleted = job.status === 'completed'
  const isFailed = job.status === 'failed'
  const isProcessing = ['uploading', 'validating', 'queued', 'processing'].includes(job.status)

  const getStatusText = () => {
    switch (job.status) {
      case 'uploading':
        return 'Mengunggah file ke server...'
      case 'validating':
        return 'Memeriksa validitas dan keamanan file...'
      case 'queued':
        return 'Masuk dalam antrean pemrosesan...'
      case 'processing':
        return 'Sedang memproses dan mengonversi...'
      case 'completed':
        return 'Konversi Berhasil Selesai!'
      case 'failed':
        return 'Konversi Gagal'
      default:
        return 'Menyiapkan proses...'
    }
  }

  return (
    <div className="w-full max-w-[760px] mx-auto bg-white border border-[#E2E8F0] rounded-xl p-6 sm:p-8 text-center shadow-xs space-y-6">
      {/* Icon Status Indicator */}
      <div className="flex justify-center">
        {isCompleted && (
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-9 h-9" />
          </div>
        )}
        {isFailed && (
          <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
            <AlertCircle className="w-9 h-9" />
          </div>
        )}
        {isProcessing && (
          <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
            <RefreshCw className="w-8 h-8 animate-spin" />
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
            Dokumen Anda telah berhasil diproses dan siap untuk diunduh.
          </p>
        )}
        {isFailed && (
          <p className="text-sm text-red-600">
            {job.errorMessage || 'Terjadi kesalahan saat memproses file. Silakan coba kembali.'}
          </p>
        )}
        {isProcessing && (
          <p className="text-sm text-[#64748B]">
            Mohon tunggu sejenak, sistem sedang menjalankan operasi konversi.
          </p>
        )}
      </div>

      {/* Progress Bar Animation (when processing) */}
      {isProcessing && (
        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
          <div className="bg-blue-600 h-2.5 rounded-full animate-pulse w-3/4 transition-all duration-500" />
        </div>
      )}

      {/* Download Action Buttons (when completed) */}
      {isCompleted && (
        <div className="space-y-3 pt-2">
          {/* Main Direct Download */}
          {job.downloadUrl && (
            <a
              href={job.downloadUrl}
              download
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base shadow-sm transition-all"
            >
              <Download className="w-5 h-5" />
              <span>Unduh Hasil Konversi</span>
            </a>
          )}

          {/* Batch ZIP Download button (if batch/multiple files) */}
          {job.filesCount > 1 && job.batchDownloadUrl && (
            <div>
              <a
                href={job.batchDownloadUrl}
                download
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-2.5 rounded-lg border border-[#E2E8F0] bg-slate-50 hover:bg-slate-100 text-[#0F172A] font-medium text-sm transition-colors mt-2"
              >
                <FileArchive className="w-4 h-4 text-blue-600" />
                <span>Unduh Semua sebagai ZIP (.zip)</span>
              </a>
            </div>
          )}

          {/* Privacy Retention Notice */}
          <div className="flex items-center justify-center gap-1.5 text-xs text-[#64748B] pt-2">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span>Berkas akan otomatis dihapus permanen dalam 60 menit.</span>
          </div>
        </div>
      )}

      {/* Reset / Convert Again */}
      {(isCompleted || isFailed) && (
        <div className="pt-4 border-t border-[#E2E8F0]">
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Konversi Dokumen Lain</span>
          </button>
        </div>
      )}
    </div>
  )
}
