import { Trash2, AlertCircle, CheckCircle2, FileText, Image as ImageIcon, FileSpreadsheet, Plus } from 'lucide-react'
import type { UploadedFile } from '../types/conversion'

interface FileListProps {
  files: UploadedFile[]
  onRemoveFile: (id: string) => void
  onAddMoreClick: () => void
  disabled?: boolean
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

function getFileIcon(format: string) {
  if (format === 'pdf') {
    return <FileText className="w-5 h-5 text-[#DC2626]" />
  }
  if (['jpg', 'jpeg', 'png', 'webp'].includes(format)) {
    return <ImageIcon className="w-5 h-5 text-[#2563EB]" />
  }
  if (['docx', 'doc', 'xlsx', 'pptx', 'odt'].includes(format)) {
    return <FileSpreadsheet className="w-5 h-5 text-[#16A34A]" />
  }
  return <FileText className="w-5 h-5 text-[#64748B]" />
}

export function FileList({ files, onRemoveFile, onAddMoreClick, disabled }: FileListProps) {
  const validCount = files.filter((f) => f.isValid).length
  const totalCount = files.length

  return (
    <div className="w-full max-w-[800px] mx-auto bg-white border border-[#E2E8F0] rounded-xl p-4 sm:p-5 shadow-xs">
      {/* Header bar */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] mb-3">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm sm:text-base text-[#0F172A]">
            Daftar Berkas Terunggah
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-[#F1F5F9] text-[#64748B] font-medium">
            {validCount} dari {totalCount} valid
          </span>
        </div>

        <button
          type="button"
          onClick={onAddMoreClick}
          disabled={disabled}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[#2563EB] hover:text-[#1D4ED8] hover:bg-[#EFF6FF] px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah File</span>
        </button>
      </div>

      {/* File Items */}
      <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1">
        {files.map((f) => (
          <div
            key={f.id}
            className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
              f.isValid
                ? 'border-[#E2E8F0] bg-[#F8FAFC] hover:bg-slate-50'
                : 'border-red-200 bg-red-50/40'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0 pr-2">
              <div className="p-2 rounded-lg bg-white border border-[#E2E8F0] shrink-0">
                {getFileIcon(f.format)}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-[#0F172A] truncate" title={f.name}>
                  {f.name}
                </p>
                <div className="flex items-center gap-2 text-xs text-[#64748B] mt-0.5">
                  <span>{formatBytes(f.size)}</span>
                  <span>•</span>
                  <span className="uppercase font-semibold text-[10px] bg-slate-200/80 px-1.5 py-0.2 rounded">
                    {f.format}
                  </span>
                  {f.isValid ? (
                    <span className="inline-flex items-center gap-1 text-[#16A34A] text-xs font-medium ml-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Siap
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[#DC2626] text-xs font-medium ml-1 truncate">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {f.errorMessage}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onRemoveFile(f.id)}
              disabled={disabled}
              className="p-1.5 text-[#64748B] hover:text-[#DC2626] hover:bg-red-50 rounded-lg transition-colors cursor-pointer shrink-0"
              title="Hapus berkas ini"
              aria-label={`Hapus ${f.name}`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
