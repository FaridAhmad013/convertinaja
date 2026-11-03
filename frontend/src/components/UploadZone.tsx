import { useState, useRef } from 'react'
import type { DragEvent, ChangeEvent } from 'react'
import { UploadCloud, FileUp } from 'lucide-react'

interface UploadZoneProps {
  onFilesSelected: (files: FileList | File[]) => void
  disabled?: boolean
}

export function UploadZone({ onFilesSelected, disabled }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled) setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    if (disabled) return

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelected(e.dataTransfer.files)
    }
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(e.target.files)
      // Reset input value so same files can be re-selected if removed
      e.target.value = ''
    }
  }

  const triggerPicker = () => {
    if (!disabled) {
      inputRef.current?.click()
    }
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={triggerPicker}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          triggerPicker()
        }
      }}
      className={`relative w-full max-w-[760px] mx-auto rounded-xl border-2 border-dashed p-6 sm:p-10 text-center transition-all cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 ${
        isDragging
          ? 'border-blue-600 bg-blue-50/70 scale-[1.01]'
          : 'border-[#E2E8F0] bg-white hover:border-blue-400 hover:bg-slate-50/50'
      } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept=".pdf,.jpg,.jpeg,.png,.webp,.docx,.xlsx,.pptx,.odt,.doc"
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled}
      />

      {/* Upload Icon */}
      <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center transition-transform group-hover:scale-105">
        <UploadCloud className="w-8 h-8 sm:w-9 sm:h-9" />
      </div>

      {/* Main Action Text */}
      <div className="mb-2">
        <span className="text-base sm:text-lg font-semibold text-[#0F172A]">
          {isDragging ? 'Lepaskan file di sini' : 'Pilih file atau seret & lepas ke sini'}
        </span>
      </div>

      <p className="text-xs sm:text-sm text-[#64748B] mb-5">
        Mendukung beberapa file sekaligus untuk digabungkan atau dikonversi.
      </p>

      {/* Button Emulator for explicit visual call to action */}
      <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-white font-medium text-sm shadow-sm hover:bg-blue-700 transition-colors">
        <FileUp className="w-4 h-4" />
        <span>Pilih Dokumen dari Perangkat</span>
      </div>

      {/* Format Limits Details */}
      <div className="mt-6 pt-4 border-t border-[#E2E8F0] flex flex-wrap items-center justify-center gap-2 text-xs text-[#64748B]">
        <span className="font-medium text-[#0F172A]">Format:</span>
        <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700">PDF</span>
        <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700">JPG/PNG/WebP</span>
        <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700">DOCX/XLSX/PPTX</span>
        <span className="text-slate-400">•</span>
        <span>Maks 50MB (PDF/Gambar), 30MB (Office)</span>
      </div>
    </div>
  )
}
