import { useState, useRef } from 'react'
import type { DragEvent, ChangeEvent } from 'react'
import { UploadCloud } from 'lucide-react'

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
      className={`relative w-full max-w-[800px] mx-auto rounded-2xl border-2 border-dashed p-8 sm:p-12 text-center transition-all cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] ${
        isDragging
          ? 'border-[#2563EB] bg-[#DBEAFE] scale-[1.01]'
          : 'border-[#93C5FD] bg-[#EFF6FF] hover:border-[#2563EB]'
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

      {/* Cloud Icon inside white circular pill */}
      <div className="w-12 h-12 mx-auto mb-3.5 rounded-full bg-white text-[#2563EB] flex items-center justify-center shadow-xs">
        <UploadCloud className="w-6 h-6" />
      </div>

      {/* Headline & Subtext */}
      <h2 className="text-lg sm:text-xl font-bold text-[#0F172A] mb-1">
        Drop your files here
      </h2>
      <p className="text-sm text-[#64748B] mb-5">
        or click to browse your device
      </p>

      {/* Choose Files Button */}
      <div className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg bg-[#2563EB] text-white font-medium text-sm shadow-xs hover:bg-[#1D4ED8] transition-colors">
        Choose Files
      </div>

      {/* Supported formats subtitle */}
      <p className="text-xs text-[#94A3B8] mt-4 font-medium">
        PDF, DOCX, JPG, PNG and more
      </p>
    </div>
  )
}
