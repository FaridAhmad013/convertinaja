import { useState } from 'react'
import { ArrowRight, Settings2, AlertTriangle, Layers, Check } from 'lucide-react'
import type { ToolDefinition, UploadedFile } from '../types/conversion'
import { getCompatibleTools } from '../services/toolsCatalog'

interface InlineToolSelectorProps {
  files: UploadedFile[]
  onStartConversion: (tool: ToolDefinition, options: Record<string, unknown>) => void
  isProcessing?: boolean
}

export function InlineToolSelector({
  files,
  onStartConversion,
  isProcessing,
}: InlineToolSelectorProps) {
  const compatibleTools = getCompatibleTools(files)
  const [chosenToolId, setChosenToolId] = useState<string | null>(null)

  // Synchronize chosen tool safely
  const selectedToolId =
    chosenToolId && compatibleTools.some((t) => t.id === chosenToolId)
      ? chosenToolId
      : (compatibleTools[0]?.id ?? '')

  // Conversion options state
  const [dpi, setDpi] = useState<number>(300) // Default: Best Quality (300 DPI)
  const [compressionLevel, setCompressionLevel] = useState<'low' | 'recommended' | 'high'>('recommended')
  const [pageRange, setPageRange] = useState<string>('all')

  const selectedTool = compatibleTools.find((t) => t.id === selectedToolId)
  const validFiles = files.filter((f) => f.isValid)

  if (validFiles.length === 0) {
    return null
  }

  if (compatibleTools.length === 0) {
    return (
      <div className="w-full max-w-[800px] mx-auto bg-amber-50 border border-amber-200 rounded-xl p-5 text-center">
        <AlertTriangle className="w-8 h-8 text-amber-600 mx-auto mb-2" />
        <h4 className="font-semibold text-sm sm:text-base text-amber-900 mb-1">
          Kombinasi Berkas Belum Didukung
        </h4>
        <p className="text-xs sm:text-sm text-amber-800 max-w-md mx-auto">
          Format atau jumlah file yang dipilih tidak memiliki tool yang cocok sekaligus. Pastikan berkas yang diunggah memiliki tipe yang seragam.
        </p>
      </div>
    )
  }

  const handleStart = () => {
    if (!selectedTool) return

    const options: Record<string, unknown> = {}

    if (selectedTool.optionsType === 'quality') {
      options.dpi = dpi
      options.jpegQuality = 95
    } else if (selectedTool.optionsType === 'compression_level') {
      options.compressionLevel = compressionLevel
    } else if (selectedTool.optionsType === 'page_range') {
      options.pages = pageRange
    }

    onStartConversion(selectedTool, options)
  }

  return (
    <div className="w-full max-w-[800px] mx-auto bg-white border border-[#E2E8F0] rounded-xl p-5 sm:p-6 shadow-xs space-y-6">
      {/* 1. Tool Selection Group */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-[#0F172A] flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-[#2563EB]" />
            Pilih Operasi Konversi
          </label>
          <span className="text-xs text-[#64748B]">
            {compatibleTools.length} tool tersedia
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
          {compatibleTools.map((tool) => {
            const isSelected = tool.id === selectedToolId
            return (
              <button
                key={tool.id}
                type="button"
                onClick={() => setChosenToolId(tool.id)}
                className={`relative text-left p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#2563EB] bg-[#EFF6FF] ring-2 ring-[#2563EB]/20 shadow-xs'
                    : 'border-[#E2E8F0] bg-white hover:border-[#93C5FD] hover:bg-slate-50/60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-sm font-semibold ${isSelected ? 'text-[#1D4ED8]' : 'text-[#0F172A]'}`}>
                      {tool.name}
                    </span>
                    {isSelected && (
                      <span className="w-4 h-4 rounded-full bg-[#2563EB] text-white flex items-center justify-center">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#64748B] leading-relaxed line-clamp-2">
                    {tool.description}
                  </p>
                </div>
                <div className="mt-2.5 pt-2 border-t border-black/5 flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#64748B]">
                    Output: <strong className="text-[#0F172A]">{tool.outputFormat}</strong>
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* 2. Quality & Config Group (If Applicable) */}
      {selectedTool && selectedTool.requiresOptions && (
        <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#0F172A]">
            <Settings2 className="w-4 h-4 text-[#2563EB]" />
            <span>Opsi Konversi: {selectedTool.name}</span>
          </div>

          {/* Image Quality (DPI) Selection */}
          {selectedTool.optionsType === 'quality' && (
            <div className="space-y-2">
              <label className="text-xs text-[#64748B] block">
                Pilih Kualitas Gambar (Resolusi DPI):
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  {
                    val: 300,
                    label: 'Kualitas Terbaik (HD)',
                    sub: '300 DPI — Teks sangat tajam (Default)',
                    badge: 'Rekomendasi',
                  },
                  {
                    val: 150,
                    label: 'Standar (Web)',
                    sub: '150 DPI — Ukuran berkas lebih hemat',
                  },
                  {
                    val: 600,
                    label: 'Ultra HD',
                    sub: '600 DPI — Detail tinggi untuk arsip',
                  },
                ].map((item) => {
                  const isCur = dpi === item.val
                  return (
                    <button
                      key={item.val}
                      type="button"
                      onClick={() => setDpi(item.val)}
                      className={`text-left p-3 rounded-lg border transition-all cursor-pointer ${
                        isCur
                          ? 'border-[#2563EB] bg-white text-[#1D4ED8] shadow-xs ring-1 ring-[#2563EB]'
                          : 'border-[#E2E8F0] bg-white text-[#64748B] hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold">{item.label}</span>
                        {item.badge && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#64748B] mt-1">{item.sub}</p>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Compression Level Selection */}
          {selectedTool.optionsType === 'compression_level' && (
            <div className="space-y-2">
              <label className="text-xs text-[#64748B] block">
                Pilih Rasio Kompresi Dokumen:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  {
                    val: 'recommended',
                    label: 'Rekomendasi',
                    sub: 'Kualitas baik, ukuran berkurang signifikan',
                  },
                  {
                    val: 'low',
                    label: 'Kompresi Rendah',
                    sub: 'Kualitas cetak tertinggi (300 DPI)',
                  },
                  {
                    val: 'high',
                    label: 'Kompresi Ekstrem',
                    sub: 'Ukuran sekecil mungkin (72 DPI)',
                  },
                ].map((item) => {
                  const isCur = compressionLevel === item.val
                  return (
                    <button
                      key={item.val}
                      type="button"
                      onClick={() => setCompressionLevel(item.val as 'low' | 'recommended' | 'high')}
                      className={`text-left p-3 rounded-lg border transition-all cursor-pointer ${
                        isCur
                          ? 'border-[#2563EB] bg-white text-[#1D4ED8] shadow-xs ring-1 ring-[#2563EB]'
                          : 'border-[#E2E8F0] bg-white text-[#64748B] hover:border-slate-300'
                      }`}
                    >
                      <span className="text-xs font-semibold block">{item.label}</span>
                      <p className="text-[11px] text-[#64748B] mt-1">{item.sub}</p>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Page Range Selection */}
          {selectedTool.optionsType === 'page_range' && (
            <div className="space-y-1.5">
              <label htmlFor="pageRangeInput" className="text-xs text-[#64748B] block">
                Rentang Halaman (Contoh: "1-5", "1,3,7", atau "all"):
              </label>
              <input
                id="pageRangeInput"
                type="text"
                value={pageRange}
                onChange={(e) => setPageRange(e.target.value)}
                placeholder="all"
                className="w-full bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              />
            </div>
          )}
        </div>
      )}

      {/* 3. Action Group */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#E2E8F0]">
        <div className="text-xs text-[#64748B]">
          {validFiles.length} file dipilih • Privasi aman (dihapus setelah 60 menit)
        </div>

        <button
          type="button"
          disabled={isProcessing || !selectedTool}
          onClick={handleStart}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-sm shadow-xs transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <span>Memproses...</span>
          ) : (
            <>
              <span>Konversi Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  )
}
