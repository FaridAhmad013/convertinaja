import { useState, useRef } from 'react'
import { UploadCloud } from 'lucide-react'
import { useI18n } from '../i18n'

interface UploadZoneProps {
  onFilesSelected: (files: FileList | File[]) => void
  disabled?: boolean
  accept?: string
}

export function UploadZone({ onFilesSelected, disabled, accept }: UploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { t } = useI18n()

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (!disabled) {
      setIsDragOver(true)
    }
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
    if (!disabled && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelected(e.dataTransfer.files)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(e.target.files)
      // Reset input value so the same file can be re-uploaded if desired
      e.target.value = ''
    }
  }

  const triggerBrowse = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <div className="w-full max-w-[800px] mx-auto">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerBrowse}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            triggerBrowse()
          }
        }}
        className={`w-full py-12 px-6 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center text-center cursor-pointer select-none bg-[#EFF6FF] ${
          isDragOver
            ? 'border-[#2563EB] ring-4 ring-blue-100 scale-[1.005]'
            : 'border-[#93C5FD] hover:border-[#2563EB]'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={accept || '.pdf,.jpg,.jpeg,.png,.webp,.docx,.xlsx,.pptx,.doc,.odt'}
          onChange={handleFileChange}
          disabled={disabled}
          className="hidden"
          id="global-file-upload-input"
          aria-label="Upload files"
        />

        {/* Cloud Pill Icon */}
        <div className="w-16 h-16 rounded-full bg-white border border-[#BFDBFE] flex items-center justify-center text-[#2563EB] mb-4 shadow-sm">
          <UploadCloud className="w-8 h-8" />
        </div>

        {/* Text Prompt */}
        <h3 className="text-base sm:text-lg font-bold text-[#0F172A] mb-1">
          {t.upload.dropTitle}
        </h3>
        <p className="text-xs sm:text-sm text-[#64748B] mb-5">
          {t.upload.dropSubtitle}
        </p>

        {/* Choose Files Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            triggerBrowse()
          }}
          disabled={disabled}
          className="px-6 py-2.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-sm shadow-xs transition-colors cursor-pointer"
        >
          {t.upload.chooseButton}
        </button>

        {/* File constraint notice */}
        <p className="text-[11px] sm:text-xs text-[#64748B] mt-5">
          {t.upload.maxLimits}
        </p>
      </div>
    </div>
  )
}
