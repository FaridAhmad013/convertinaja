import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
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
  Check,
  ArrowLeftRight,
  Sparkles,
} from 'lucide-react'
import type { ConversionJobResult, ConvertedFileItem, UploadedFile } from '../types/conversion'
import { buildDownloadSelectedUrl } from '../services/api'
import { ImageComparisonSlider } from './ImageComparisonSlider'
import { useI18n } from '../i18n'

interface ConversionStatusProps {
  job: ConversionJobResult
  hasOriginalFiles?: boolean
  originalFiles?: UploadedFile[]
  onReset: () => void
  onConvertSameFile?: () => void
  onConvertResultFile?: () => void
}

interface ContextMenuState {
  visible: boolean
  x: number
  y: number
  file: ConvertedFileItem | null
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

function splitBytes(bytes: number): { value: string; unit: string } {
  if (!bytes || bytes <= 0) return { value: '0', unit: 'B' }
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  const val = parseFloat((bytes / Math.pow(k, i)).toFixed(1)).toString()
  return { value: val, unit: sizes[i] }
}

export function ConversionStatus({
  job,
  hasOriginalFiles,
  originalFiles,
  onReset,
  onConvertSameFile,
  onConvertResultFile,
}: ConversionStatusProps) {
  const { lang, t } = useI18n()
  const isId = lang === 'id'

  const isCompleted = job.status === 'completed'
  const isFailed = job.status === 'failed'
  const isProcessing =
    job.status === 'processing' || job.status === 'queued' || job.status === 'uploading' || job.status === 'validating'

  const files = useMemo(() => job.files || [], [job.files])
  const isMultiFile = files.length > 1

  // Create temporary preview URL for the original uploaded image file
  const originalFileUrl = useMemo(() => {
    if (!originalFiles || originalFiles.length === 0) return null
    const first = originalFiles[0] as unknown as { file?: File } | File
    const rawFile =
      first && typeof first === 'object' && 'file' in first && first.file instanceof File
        ? first.file
        : first instanceof File
          ? first
          : null
    if (rawFile) {
      try {
        return URL.createObjectURL(rawFile)
      } catch {
        return null
      }
    }
    return null
  }, [originalFiles])

  useEffect(() => {
    return () => {
      if (originalFileUrl) {
        URL.revokeObjectURL(originalFileUrl)
      }
    }
  }, [originalFileUrl])

  // Selection list tracking order of selection
  const [selectedIndices, setSelectedIndices] = useState<number[]>(() =>
    files.map((f) => f.index)
  )

  // Flash indicator for recently checked item
  const [justCheckedIndex, setJustCheckedIndex] = useState<number | null>(null)
  const flashTimeoutRef = useRef<number | null>(null)

  // Fullscreen preview lightbox modal state
  const [previewFile, setPreviewFile] = useState<ConvertedFileItem | null>(null)

  // Right-click custom context menu state
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    visible: false,
    x: 0,
    y: 0,
    file: null,
  })

  // Toggle selection for an item
  const toggleSelectItem = useCallback((index: number) => {
    setSelectedIndices((prev) => {
      const isAlreadySelected = prev.includes(index)
      if (isAlreadySelected) {
        return prev.filter((i) => i !== index)
      } else {
        // Trigger quick flash pop badge
        if (flashTimeoutRef.current) clearTimeout(flashTimeoutRef.current)
        setJustCheckedIndex(index)
        flashTimeoutRef.current = window.setTimeout(() => {
          setJustCheckedIndex(null)
        }, 1200)
        return [...prev, index]
      }
    })
  }, [])

  const toggleSelectAll = () => {
    if (selectedIndices.length === files.length) {
      setSelectedIndices([])
    } else {
      setSelectedIndices(files.map((f) => f.index))
    }
  }

  // Keyboard navigation for Fullscreen Preview Modal
  useEffect(() => {
    if (!previewFile) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPreviewFile(null)
      } else if (e.key === 'ArrowLeft') {
        const currentIndex = files.findIndex((f) => f.index === previewFile.index)
        const prevIdx = (currentIndex - 1 + files.length) % files.length
        setPreviewFile(files[prevIdx])
      } else if (e.key === 'ArrowRight') {
        const currentIndex = files.findIndex((f) => f.index === previewFile.index)
        const nextIdx = (currentIndex + 1) % files.length
        setPreviewFile(files[nextIdx])
      } else if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault()
        toggleSelectItem(previewFile.index)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [previewFile, files, toggleSelectItem])

  // Close context menu on outside click or scroll
  useEffect(() => {
    const handleOutsideClick = () => {
      if (contextMenu.visible) {
        setContextMenu((prev) => ({ ...prev, visible: false }))
      }
    }

    window.addEventListener('click', handleOutsideClick)
    window.addEventListener('scroll', handleOutsideClick)
    return () => {
      window.removeEventListener('click', handleOutsideClick)
      window.removeEventListener('scroll', handleOutsideClick)
    }
  }, [contextMenu.visible])

  // Handle right click on card
  const handleContextMenu = (e: React.MouseEvent, file: ConvertedFileItem) => {
    e.preventDefault()
    setContextMenu({
      visible: true,
      x: Math.min(e.clientX, window.innerWidth - 220),
      y: Math.min(e.clientY, window.innerHeight - 180),
      file,
    })
  }

  // Download selected: If > 1 file selected, downloads dynamically bundled ZIP
  const handleDownloadSelected = () => {
    if (selectedIndices.length === 0) return

    if (selectedIndices.length > 1) {
      const zipUrl = buildDownloadSelectedUrl(job.jobId, job.accessToken, selectedIndices)
      const link = document.createElement('a')
      link.href = zipUrl
      link.download = `convertinaja-selected-${selectedIndices.length}-files.zip`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else {
      const file = files.find((f) => f.index === selectedIndices[0])
      if (file) {
        const link = document.createElement('a')
        link.href = file.downloadUrl
        link.download = file.name
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    }
  }

  // Next / Prev navigation inside modal
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
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 md:p-8 bg-white rounded-2xl border border-[#E2E8F0] shadow-xs space-y-6">
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

          {/* Image Optimization Comparison Summary Card (Custom Recommended Design) */}
          {isCompleted && job.imageStats && (
            <div className="mt-4 bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden text-left max-w-4xl mx-auto w-full">
              {/* Header Bar */}
              <div className="px-5 py-4 bg-slate-50/70 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-blue-100 text-blue-700 rounded-lg">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-xs sm:text-sm uppercase tracking-wider text-slate-700">
                    {t.status.imageResultTitle}
                  </span>
                  <span className="hidden sm:inline-block text-xs font-medium text-slate-500 bg-slate-200/70 px-2 py-0.5 rounded-full">
                    Balanced Quality
                  </span>
                </div>

                <div
                  className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${
                    job.imageStats.targetReached
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
                      : 'bg-blue-50 text-[#1D4ED8] border-blue-200/80'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      job.imageStats.targetReached ? 'bg-emerald-500 animate-pulse' : 'bg-blue-500'
                    }`}
                  />
                  <span>{job.imageStats.targetReached ? t.status.targetReached : t.status.hdOptimal}</span>
                </div>
              </div>

              <div className="p-5 sm:p-6 space-y-6">
                {/* 3 Metric Columns */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  {/* Kolom Sebelum */}
                  {(() => {
                    const orig = splitBytes(job.imageStats.originalSize || 0)
                    return (
                      <div className="p-4 rounded-xl border border-slate-200/90 bg-white hover:border-slate-300 transition-all">
                        <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                          {t.status.beforeLabel}
                        </span>
                        <div className="mt-1 flex items-baseline gap-1.5">
                          <span className="text-2xl font-black text-slate-900">{orig.value}</span>
                          <span className="text-sm font-semibold text-slate-600">{orig.unit}</span>
                        </div>
                        {job.imageStats.originalWidth && job.imageStats.originalHeight ? (
                          <div className="mt-1 text-xs text-slate-600 font-mono">
                            {job.imageStats.originalWidth} × {job.imageStats.originalHeight} px
                          </div>
                        ) : null}
                      </div>
                    )
                  })()}

                  {/* Kolom Sesudah */}
                  {(() => {
                    const opt = splitBytes(job.imageStats.optimizedSize || 0)
                    return (
                      <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/30 relative">
                        <div className="flex justify-between items-start">
                          <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider block">
                            {t.status.afterLabel}
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                            {job.imageStats.format?.toUpperCase() || 'WEBP'}
                          </span>
                        </div>
                        <div className="mt-1 flex items-baseline gap-1.5">
                          <span className="text-2xl font-black text-blue-700">{opt.value}</span>
                          <span className="text-sm font-semibold text-blue-600">{opt.unit}</span>
                        </div>
                        {job.imageStats.optimizedWidth && job.imageStats.optimizedHeight ? (
                          <div className="mt-1 text-xs text-slate-600 font-mono">
                            {job.imageStats.optimizedWidth} × {job.imageStats.optimizedHeight} px
                          </div>
                        ) : null}
                      </div>
                    )
                  })()}

                  {/* Kolom Hemat */}
                  {(() => {
                    const saved = splitBytes(job.imageStats.savedBytes || 0)
                    return (
                      <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50">
                        <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                          {t.status.savedLabel}
                        </span>
                        <div className="mt-1 flex items-baseline gap-1.5">
                          <span className="text-2xl font-black text-emerald-600">{saved.value}</span>
                          <span className="text-sm font-semibold text-emerald-600">{saved.unit}</span>
                        </div>
                        <div className="mt-1 text-xs font-semibold text-emerald-700 flex items-center gap-1">
                          <span>{t.status.reducedPercent(job.imageStats.reductionPercent ?? 0)}</span>
                          <span className="text-[11px] text-emerald-600/80 font-normal hidden sm:inline">
                            • {t.status.fasterLoad}
                          </span>
                        </div>
                      </div>
                    )
                  })()}
                </div>

                {/* Interactive Draggable Split View Slider & Privacy EXIF Component */}
                <ImageComparisonSlider
                  originalUrl={originalFileUrl || files[0]?.previewUrl || job.downloadUrl || undefined}
                  optimizedUrl={files[0]?.previewUrl || job.downloadUrl || originalFileUrl || undefined}
                  originalSize={job.imageStats.originalSize ? formatBytes(job.imageStats.originalSize) : undefined}
                  optimizedSize={job.imageStats.optimizedSize ? formatBytes(job.imageStats.optimizedSize) : undefined}
                  originalDims={
                    job.imageStats.originalWidth && job.imageStats.originalHeight
                      ? `${job.imageStats.originalWidth} × ${job.imageStats.originalHeight} px`
                      : undefined
                  }
                  optimizedDims={
                    job.imageStats.optimizedWidth && job.imageStats.optimizedHeight
                      ? `${job.imageStats.optimizedWidth} × ${job.imageStats.optimizedHeight} px`
                      : undefined
                  }
                  format={job.imageStats.format || 'webp'}
                />
              </div>
            </div>
          )}
          {isProcessing && (
            <p className="text-xs sm:text-sm text-[#64748B]">
              {t.status.processingSub}
            </p>
          )}
        </div>
      </div>

      {/* Progress Bar Animation */}
      {isProcessing && (
        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
          <div className="bg-[#2563EB] h-2.5 rounded-full animate-pulse w-3/4 transition-all duration-500" />
        </div>
      )}

      {/* COMPLETED: Multi-File Gallery / List View */}
      {isCompleted && isMultiFile && (
        <div className="space-y-4 pt-1">
          {/* Sticky Action Toolbar on Top with generous breathing room */}
          <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md p-4 sm:p-5 rounded-xl border border-[#E2E8F0] shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Selection Info & Select All Button */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
              <button
                type="button"
                onClick={toggleSelectAll}
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#0F172A] hover:text-[#2563EB] transition-colors cursor-pointer py-1 px-2 rounded-lg hover:bg-slate-100"
              >
                {selectedIndices.length === files.length ? (
                  <CheckSquare className="w-4 h-4 text-[#2563EB]" />
                ) : (
                  <Square className="w-4 h-4 text-[#64748B]" />
                )}
                <span>
                  {selectedIndices.length === files.length
                    ? t.status.deselectAll
                    : t.status.selectAll}
                </span>
              </button>

              <span className="text-xs font-medium text-[#64748B] bg-slate-50 px-2.5 py-1 rounded-md border border-[#E2E8F0]">
                {t.status.selectedCount(selectedIndices.length, files.length)}
              </span>
            </div>

            {/* Action Buttons: Spacious and Distinct */}
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 w-full md:w-auto">
              {/* Download Selected (via ZIP when > 1 file selected) */}
              {selectedIndices.length > 0 && (
                <button
                  type="button"
                  onClick={handleDownloadSelected}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] hover:bg-blue-100 text-xs font-bold transition-all cursor-pointer shadow-2xs hover:shadow-xs"
                >
                  {selectedIndices.length > 1 ? (
                    <FileArchive className="w-4 h-4 text-[#2563EB]" />
                  ) : (
                    <Download className="w-4 h-4 text-[#2563EB]" />
                  )}
                  <span>
                    {t.status.downloadSelected(selectedIndices.length, selectedIndices.length > 1)}
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
                  <span>{t.status.downloadZipButton}</span>
                </a>
              )}

              {/* Convert same file to another format */}
              {hasOriginalFiles && onConvertSameFile && (
                <button
                  type="button"
                  onClick={onConvertSameFile}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#BFDBFE] bg-[#EFF6FF] hover:bg-blue-100 text-[#2563EB] text-xs font-bold transition-all cursor-pointer shadow-2xs"
                >
                  <ArrowLeftRight className="w-4 h-4" />
                  <span>{t.status.convertOtherFormat}</span>
                </button>
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

          {/* Fixed-height scrollable list/grid container */}
          <div className="max-h-[580px] overflow-y-auto pr-1 sm:pr-2 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {files.map((file) => {
                const isSelected = selectedIndices.includes(file.index)
                const selectionOrder = selectedIndices.indexOf(file.index) + 1
                const isJustChecked = justCheckedIndex === file.index
                const isImage = /\.(jpg|jpeg|png|webp)$/i.test(file.name)

                return (
                  <div
                    key={file.index}
                    onContextMenu={(e) => handleContextMenu(e, file)}
                    className={`relative group rounded-xl border transition-all overflow-hidden bg-white flex flex-col justify-between select-none ${
                      isSelected
                        ? 'border-[#2563EB] ring-2 ring-blue-100 shadow-sm'
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

                      {/* Enlarged semi-transparent Checkbox (Top Left) */}
                      <button
                        type="button"
                        onClick={() => toggleSelectItem(file.index)}
                        className={`absolute top-2.5 left-2.5 z-10 w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-[#2563EB]/90 text-white shadow-md border-2 border-white backdrop-blur-xs scale-105'
                            : 'bg-white/80 text-[#64748B] hover:bg-white border border-[#CBD5E1] shadow-2xs backdrop-blur-xs'
                        }`}
                        title={isSelected ? 'Batalkan pilihan' : 'Pilih berkas'}
                      >
                        {isSelected ? (
                          <div className="flex items-center justify-center font-bold text-xs">
                            <Check className="w-5 h-5 stroke-[3]" />
                          </div>
                        ) : (
                          <Square className="w-4 h-4 text-[#94A3B8]" />
                        )}
                      </button>

                      {/* Selection order sequence badge / Flash indicator */}
                      {isSelected && (
                        <div
                          className={`absolute top-2.5 right-2.5 z-10 px-2 py-0.5 rounded-full text-[10px] font-bold shadow-xs transition-all ${
                            isJustChecked
                              ? 'bg-amber-400 text-amber-950 scale-125 ring-2 ring-amber-300 animate-bounce'
                              : 'bg-black/60 text-white backdrop-blur-xs'
                          }`}
                        >
                          #{selectionOrder}
                        </div>
                      )}

                      {/* Hover Fullscreen View Overlay Button */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => setPreviewFile(file)}
                          className="p-3 rounded-full bg-white text-[#0F172A] hover:text-[#2563EB] shadow-lg transition-all scale-95 hover:scale-105 cursor-pointer"
                          title={isId ? 'Lihat Layar Penuh' : 'View Fullscreen'}
                        >
                          <Maximize2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Card Bottom Meta & Actions */}
                    <div className="p-3 bg-white space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-[#0F172A] truncate" title={file.name}>
                          {t.status.pageLabel(file.index + 1)}
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
                          <span>{t.status.previewButton}</span>
                        </button>
                        <a
                          href={file.downloadUrl}
                          download={file.name}
                          className="flex-1 inline-flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[11px] font-bold transition-colors cursor-pointer shadow-2xs"
                          title={t.status.downloadSingle}
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>{t.status.downloadSingle}</span>
                        </a>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* COMPLETED: Single File View */}
      {isCompleted && !isMultiFile && (
        <div className="space-y-6 pt-2">
          {/* Action Button Grid: Clean, consistent height, centered, and aligned without clipping */}
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 max-w-4xl mx-auto">
            {/* Primary Download Button */}
            {job.downloadUrl && (
              <a
                href={job.downloadUrl}
                download
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-sm shadow-sm hover:shadow-md transition-all cursor-pointer shrink-0"
              >
                <Download className="w-4 h-4 stroke-[2.5]" />
                <span>{t.status.downloadButton}</span>
                {job.fileSize && (
                  <span className="text-[11px] bg-white/20 px-2 py-0.5 rounded-md font-semibold tracking-wide">
                    {formatBytes(job.fileSize)}
                  </span>
                )}
              </a>
            )}

            {/* Convert same original file to another format */}
            {hasOriginalFiles && onConvertSameFile && (
              <button
                type="button"
                onClick={onConvertSameFile}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-[#BFDBFE] bg-[#EFF6FF] hover:bg-blue-100 text-[#2563EB] font-semibold text-xs sm:text-sm transition-all cursor-pointer shadow-2xs shrink-0"
              >
                <ArrowLeftRight className="w-4 h-4 text-[#2563EB]" />
                <span>{t.status.convertOtherFormat}</span>
              </button>
            )}

            {/* Convert resulting output file further */}
            {onConvertResultFile && job.downloadUrl && (
              <button
                type="button"
                onClick={onConvertResultFile}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold text-xs sm:text-sm transition-all cursor-pointer shadow-2xs shrink-0"
              >
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>{t.status.convertResultFile}</span>
              </button>
            )}

            {/* Convert Another File Button */}
            <button
              type="button"
              onClick={onReset}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-[#CBD5E1] bg-white hover:bg-slate-50 text-[#0F172A] font-semibold text-xs sm:text-sm transition-all cursor-pointer shadow-2xs shrink-0"
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

      {/* FULLSCREEN PREVIEW LIGHTBOX MODAL WITH KEYBOARD & CHECKBOX CONTROLS */}
      {previewFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm">
          <div className="relative w-full max-w-5xl max-h-[94vh] flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#E2E8F0]">
            {/* Modal Top Bar */}
            <div className="px-4 sm:px-6 py-3.5 border-b border-[#E2E8F0] bg-[#F8FAFC] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="font-bold text-sm sm:text-base text-[#0F172A]">
                  {isId ? `Halaman ${previewFile.index + 1}` : `Page ${previewFile.index + 1}`}
                </span>
                <span className="text-xs text-[#64748B] hidden sm:inline">({previewFile.name})</span>

                {/* Modal In-View Checkbox Selector */}
                <button
                  type="button"
                  onClick={() => toggleSelectItem(previewFile.index)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                    selectedIndices.includes(previewFile.index)
                      ? 'bg-[#2563EB] text-white shadow-xs'
                      : 'bg-white border border-[#CBD5E1] text-[#475569] hover:bg-slate-50'
                  }`}
                >
                  {selectedIndices.includes(previewFile.index) ? (
                    <>
                      <CheckSquare className="w-4 h-4" />
                      <span>{isId ? 'Dicentang (Pilihan)' : 'Selected'}</span>
                    </>
                  ) : (
                    <>
                      <Square className="w-4 h-4" />
                      <span>{isId ? 'Centang Halaman Ini' : 'Select Page'}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Modal Action Controls */}
              <div className="flex items-center gap-2">
                <a
                  href={previewFile.downloadUrl}
                  download={previewFile.name}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isId ? 'Unduh Berkas' : 'Download File'}</span>
                </a>

                <button
                  type="button"
                  onClick={() => setPreviewFile(null)}
                  className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-slate-200 transition-colors cursor-pointer ml-1"
                  title="Tutup (Esc)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Image View Area with Prev / Next Navigation */}
            <div className="relative flex-1 p-2 sm:p-4 bg-slate-900/5 overflow-auto flex items-center justify-center min-h-[350px]">
              {files.length > 1 && (
                <button
                  type="button"
                  onClick={handlePrevPreview}
                  className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 rounded-full bg-white/90 hover:bg-white text-[#0F172A] shadow-lg transition-all cursor-pointer z-10 active:scale-95"
                  title="Sebelumnya (Arrow Left)"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}

              <img
                src={previewFile.previewUrl}
                alt={previewFile.name}
                className="max-h-[72vh] w-auto max-w-full object-contain rounded-lg shadow-sm"
              />

              {files.length > 1 && (
                <button
                  type="button"
                  onClick={handleNextPreview}
                  className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 rounded-full bg-white/90 hover:bg-white text-[#0F172A] shadow-lg transition-all cursor-pointer z-10 active:scale-95"
                  title="Selanjutnya (Arrow Right)"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Modal Footer with Keyboard Shortcuts Tip */}
            <div className="px-5 py-2.5 border-t border-[#E2E8F0] bg-white flex flex-wrap items-center justify-between text-xs text-[#64748B]">
              <span>
                {isId
                  ? `Halaman ${previewFile.index + 1} dari ${files.length}`
                  : `Page ${previewFile.index + 1} of ${files.length}`}
              </span>
              <span className="hidden sm:inline text-[11px] text-[#94A3B8]">
                {isId
                  ? 'Navigasi: ◀ ▶ Panah Keyboard | Spasi untuk Centang | Esc untuk Tutup'
                  : 'Navigate: ◀ ▶ Arrow Keys | Space to Toggle Select | Esc to Close'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* CUSTOM RIGHT-CLICK CONTEXT MENU */}
      {contextMenu.visible && contextMenu.file && (
        <div
          style={{ top: contextMenu.y, left: contextMenu.x }}
          className="fixed z-50 min-w-[200px] bg-white rounded-xl shadow-xl border border-[#E2E8F0] py-1.5 animate-in fade-in-50 zoom-in-95"
        >
          <div className="px-3 py-1.5 border-b border-[#F1F5F9] text-[11px] font-semibold text-[#64748B] truncate">
            {contextMenu.file.name}
          </div>

          <button
            type="button"
            onClick={() => {
              if (contextMenu.file) setPreviewFile(contextMenu.file)
              setContextMenu((prev) => ({ ...prev, visible: false }))
            }}
            className="w-full text-left px-3.5 py-2 text-xs font-medium text-[#0F172A] hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
          >
            <Eye className="w-4 h-4 text-[#2563EB]" />
            <span>{isId ? 'Pratinjau Layar Penuh' : 'View Fullscreen'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (contextMenu.file) toggleSelectItem(contextMenu.file.index)
              setContextMenu((prev) => ({ ...prev, visible: false }))
            }}
            className="w-full text-left px-3.5 py-2 text-xs font-medium text-[#0F172A] hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
          >
            {selectedIndices.includes(contextMenu.file.index) ? (
              <>
                <Square className="w-4 h-4 text-[#DC2626]" />
                <span>{isId ? 'Batalkan Pilihan' : 'Deselect Item'}</span>
              </>
            ) : (
              <>
                <CheckSquare className="w-4 h-4 text-[#2563EB]" />
                <span>{isId ? 'Pilih Berkas Ini' : 'Select Item'}</span>
              </>
            )}
          </button>

          <a
            href={contextMenu.file.downloadUrl}
            download={contextMenu.file.name}
            onClick={() => setContextMenu((prev) => ({ ...prev, visible: false }))}
            className="w-full text-left px-3.5 py-2 text-xs font-medium text-[#0F172A] hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>{isId ? 'Unduh Berkas Ini' : 'Download File'}</span>
          </a>
        </div>
      )}
    </div>
  )
}
