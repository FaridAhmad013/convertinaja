import { useState } from 'react'
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Download,
  RefreshCw,
  FileArchive,
  PlusCircle,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  CheckSquare,
  Square,
  Eye,
} from 'lucide-react'
import type { ConversionJobResult, ConvertedFileItem } from '../types/conversion'
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
  const { lang, t } = useI18n()
  const isId = lang === 'id'

  const isCompleted = job.status === 'completed'
  const isFailed = job.status === 'failed'
  const isProcessing =
    job.status === 'processing' || job.status === 'queued' || job.status === 'uploading' || job.status === 'validating'

  const files = job.files || []
  const isMultiFile = files.length > 1

  // Selection state for multi-file downloads
  const [selectedIndices, setSelectedIndices] = useState<number[]>(() =>
    files.map((f) => f.index)
  )

  // Fullscreen preview lightbox state
  const [previewFile, setPreviewFile] = useState<ConvertedFileItem | null>(null)

  const toggleSelectAll = () => {
    if (selectedIndices.length === files.length) {
      setSelectedIndices([])
    } else {
      setSelectedIndices(files.map((f) => f.index))
    }
  }

  const toggleSelectItem = (index: number) => {
    setSelectedIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    )
  }

  // Trigger download of selected individual files
  const handleDownloadSelected = () => {
    const selectedFiles = files.filter((f) => selectedIndices.includes(f.index))
    selectedFiles.forEach((file, idx) => {
      setTimeout(() => {
        const link = document.createElement('a')
        link.href = file.downloadUrl
        link.download = file.name
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }, idx * 300) // slight stagger for browser download handlers
    })
  }

  // Lightbox previous/next navigation
  const handlePrevPreview = () => {
    if (!previewFile) return
    const currentIndex = files.findIndex((f) => f.index === previewFile.index)
    const prevIdx = (currentIndex - 1 + files.length) % files.length
    setPreviewFile(files[prevIdx])
  }

  const handleNextPreview = () => {
    if (!previewFile) return
    const currentIndex = files.findIndex((f) => f.index === previewFile.index)
    const nextIdx = (currentIndex + 1) % files.length
    setPreviewFile(files[nextIdx])
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6 sm:p-8 bg-white rounded-2xl border border-[#E2E8F0] shadow-xs space-y-6">
      {/* Header & Status Indicator */}
      <div className="flex flex-col items-center text-center space-y-3">
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

        <div className="space-y-1">
          <h3 className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight">
            {job.status === 'uploading' && t.status.uploading}
            {job.status === 'validating' && t.status.validating}
            {job.status === 'queued' && t.status.queued}
            {job.status === 'processing' && t.status.processing}
            {isCompleted &&
              (isMultiFile
                ? isId
                  ? `Berhasil Menghasilkan ${files.length} Berkas!`
                  : `Successfully Generated ${files.length} Files!`
                : t.status.completed)}
            {isFailed && t.status.failed}
          </h3>

          {job.errorMessage && (
            <p className="text-xs sm:text-sm text-[#DC2626] bg-red-50 p-3 rounded-lg border border-red-200">
              {job.errorMessage}
            </p>
          )}

          {isCompleted && (
            <p className="text-xs sm:text-sm text-[#64748B]">
              {t.status.completedSub}
            </p>
          )}
          {isProcessing && (
            <p className="text-xs sm:text-sm text-[#64748B]">
              {t.status.processingSub}
            </p>
          )}
        </div>
      </div>

      {/* Progress Bar Animation (when processing) */}
      {isProcessing && (
        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
          <div className="bg-[#2563EB] h-2.5 rounded-full animate-pulse w-3/4 transition-all duration-500" />
        </div>
      )}

      {/* COMPLETED: Multi-File Gallery / List View */}
      {isCompleted && isMultiFile && (
        <div className="space-y-6 pt-2">
          {/* Action Toolbar with generous breathing room */}
          <div className="p-4 sm:p-5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Selection Info & Toggle */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
              <button
                type="button"
                onClick={toggleSelectAll}
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#0F172A] hover:text-[#2563EB] transition-colors cursor-pointer"
              >
                {selectedIndices.length === files.length ? (
                  <CheckSquare className="w-4 h-4 text-[#2563EB]" />
                ) : (
                  <Square className="w-4 h-4 text-[#64748B]" />
                )}
                <span>
                  {selectedIndices.length === files.length
                    ? isId
                      ? 'Batal Pilih Semua'
                      : 'Deselect All'
                    : isId
                      ? 'Pilih Semua'
                      : 'Select All'}
                </span>
              </button>

              <span className="text-xs font-medium text-[#64748B] bg-white px-2.5 py-1 rounded-md border border-[#E2E8F0]">
                {selectedIndices.length} / {files.length} {isId ? 'dipilih' : 'selected'}
              </span>
            </div>

            {/* Action Buttons: Spacious and Distinct */}
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 w-full md:w-auto">
              {/* Download Selected */}
              {selectedIndices.length > 0 && (
                <button
                  type="button"
                  onClick={handleDownloadSelected}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] hover:bg-blue-100 text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                >
                  <Download className="w-4 h-4" />
                  <span>
                    {isId ? `Unduh Terpilih (${selectedIndices.length})` : `Download Selected (${selectedIndices.length})`}
                  </span>
                </button>
              )}

              {/* Download All (ZIP) */}
              {job.batchDownloadUrl && (
                <a
                  href={job.batchDownloadUrl}
                  download
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-all shadow-xs hover:shadow-md cursor-pointer"
                >
                  <FileArchive className="w-4 h-4" />
                  <span>{isId ? 'Unduh Semua (.ZIP)' : 'Download All (.ZIP)'}</span>
                </a>
              )}

              {/* Convert Another File */}
              <button
                type="button"
                onClick={onReset}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-white hover:bg-slate-50 text-[#0F172A] text-xs font-semibold transition-colors cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 text-[#2563EB]" />
                <span>{t.status.convertAgain}</span>
              </button>
            </div>
          </div>

          {/* Thumbnail Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {files.map((file) => {
              const isSelected = selectedIndices.includes(file.index)
              const isImage = /\.(jpg|jpeg|png|webp)$/i.test(file.name)

              return (
                <div
                  key={file.index}
                  className={`relative group rounded-xl border transition-all overflow-hidden bg-white flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#2563EB] ring-2 ring-blue-100 shadow-xs'
                      : 'border-[#E2E8F0] hover:border-[#93C5FD]'
                  }`}
                >
                  {/* Card Media Preview */}
                  <div className="relative aspect-3/4 bg-[#F8FAFC] flex items-center justify-center overflow-hidden border-b border-[#E2E8F0]/80">
                    {isImage ? (
                      <img
                        src={file.previewUrl}
                        alt={file.name}
                        loading="lazy"
                        className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="text-center p-4">
                        <FileArchive className="w-10 h-10 text-[#64748B] mx-auto mb-2" />
                        <span className="text-xs text-[#64748B]">{file.name}</span>
                      </div>
                    )}

                    {/* Selection Checkbox (Top Left) */}
                    <button
                      type="button"
                      onClick={() => toggleSelectItem(file.index)}
                      className="absolute top-2.5 left-2.5 z-10 w-6 h-6 rounded-md bg-white/95 border border-[#E2E8F0] shadow-xs flex items-center justify-center cursor-pointer transition-colors"
                      title={isSelected ? 'Batalkan pilihan' : 'Pilih berkas'}
                    >
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 text-[#2563EB]" />
                      ) : (
                        <Square className="w-4 h-4 text-[#94A3B8]" />
                      )}
                    </button>

                    {/* Hover Fullscreen View Overlay Button */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => setPreviewFile(file)}
                        className="p-2.5 rounded-full bg-white text-[#0F172A] hover:text-[#2563EB] shadow-md transition-all scale-95 hover:scale-105 cursor-pointer"
                        title={isId ? 'Lihat Penuh' : 'View Fullscreen'}
                      >
                        <Maximize2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Card Bottom Meta & Actions */}
                  <div className="p-3 bg-white space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#0F172A] truncate" title={file.name}>
                        {isId ? `Halaman ${file.index + 1}` : `Page ${file.index + 1}`}
                      </span>
                      {file.size > 0 && (
                        <span className="text-[11px] text-[#64748B] font-medium">
                          {formatBytes(file.size)}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 pt-1 border-t border-[#F1F5F9]">
                      <button
                        type="button"
                        onClick={() => setPreviewFile(file)}
                        className="flex-1 inline-flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg border border-[#E2E8F0] bg-slate-50 hover:bg-slate-100 text-[11px] font-semibold text-[#475569] transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#2563EB]" />
                        <span>{isId ? 'Pratinjau' : 'Preview'}</span>
                      </button>
                      <a
                        href={file.downloadUrl}
                        download={file.name}
                        className="flex-1 inline-flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[11px] font-bold transition-colors cursor-pointer shadow-2xs"
                        title={isId ? 'Unduh berkas ini' : 'Download this file'}
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>{isId ? 'Unduh' : 'Download'}</span>
                      </a>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* COMPLETED: Single File View */}
      {isCompleted && !isMultiFile && (
        <div className="space-y-6 pt-2">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* Primary Download Button */}
            {job.downloadUrl && (
              <a
                href={job.downloadUrl}
                download
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-base shadow-md hover:shadow-lg transition-all scale-[1.01] cursor-pointer"
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

            {/* Convert Another File Button */}
            <button
              type="button"
              onClick={onReset}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl border border-[#E2E8F0] bg-slate-50 hover:bg-slate-100 text-[#0F172A] font-semibold text-sm transition-colors cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-[#2563EB]" />
              <span>{t.status.convertAgain}</span>
            </button>
          </div>
        </div>
      )}

      {/* Auto-delete Notice */}
      {isCompleted && (
        <p className="text-xs text-[#64748B] text-center pt-2">
          {t.status.retentionNotice}
        </p>
      )}

      {/* FAILED STATE */}
      {isFailed && (
        <div className="pt-4 border-t border-[#E2E8F0] flex justify-center">
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

      {/* FULLSCREEN PREVIEW LIGHTBOX MODAL */}
      {previewFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#E2E8F0]">
            {/* Modal Top Bar */}
            <div className="px-5 py-3.5 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-[#0F172A]">
                  {isId ? `Halaman ${previewFile.index + 1}` : `Page ${previewFile.index + 1}`}
                </span>
                <span className="text-xs text-[#64748B]">({previewFile.name})</span>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={previewFile.downloadUrl}
                  download={previewFile.name}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isId ? 'Unduh Halaman Ini' : 'Download Page'}</span>
                </a>

                <button
                  type="button"
                  onClick={() => setPreviewFile(null)}
                  className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-slate-200 transition-colors cursor-pointer ml-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Image Display Area with Prev / Next Navigation */}
            <div className="relative flex-1 p-4 bg-slate-900/5 overflow-auto flex items-center justify-center min-h-[350px]">
              {files.length > 1 && (
                <button
                  type="button"
                  onClick={handlePrevPreview}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/90 hover:bg-white text-[#0F172A] shadow-md transition-all cursor-pointer z-10"
                  title="Sebelumnya"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}

              <img
                src={previewFile.previewUrl}
                alt={previewFile.name}
                className="max-h-[75vh] w-auto max-w-full object-contain rounded-lg shadow-sm"
              />

              {files.length > 1 && (
                <button
                  type="button"
                  onClick={handleNextPreview}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/90 hover:bg-white text-[#0F172A] shadow-md transition-all cursor-pointer z-10"
                  title="Selanjutnya"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-2.5 border-t border-[#E2E8F0] bg-white text-center text-xs text-[#64748B]">
              {isId
                ? `Menampilkan ${previewFile.index + 1} dari ${files.length} halaman`
                : `Showing ${previewFile.index + 1} of ${files.length} pages`}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
