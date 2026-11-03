import { useState } from 'react'
import { ArrowRight, Settings2, AlertTriangle, Layers } from 'lucide-react'
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

  // Derived selected tool ID (guarantees safe synchronization without cascading renders)
  const selectedToolId =
    chosenToolId && compatibleTools.some((t) => t.id === chosenToolId)
      ? chosenToolId
      : (compatibleTools[0]?.id ?? '')

  // Conversion options state
  const [compressionLevel, setCompressionLevel] = useState<'low' | 'recommended' | 'high'>('recommended')
  const [pageRange, setPageRange] = useState<string>('all')

  const selectedTool = compatibleTools.find((t) => t.id === selectedToolId)
  const validFiles = files.filter((f) => f.isValid)

  if (validFiles.length === 0) {
    return null
  }

  // If no compatible tools found for this combination of files
  if (compatibleTools.length === 0) {
    return (
      <div className="w-full max-w-[760px] mx-auto bg-amber-50 border border-amber-200 rounded-xl p-5 text-center">
        <AlertTriangle className="w-8 h-8 text-amber-600 mx-auto mb-2" />
        <h4 className="font-semibold text-sm sm:text-base text-amber-900 mb-1">
          Kombinasi Berkas Belum Didukung
        </h4>
        <p className="text-xs sm:text-sm text-amber-800 max-w-md mx-auto">
          Format atau jumlah file yang dipilih tidak memiliki tool yang cocok sekaligus. Coba pilih file dengan tipe seragam (misal: hanya PDF atau hanya gambar).
        </p>
      </div>
    )
  }

  const handleStart = () => {
    if (!selectedTool) return

    const options: Record<string, unknown> = {}
    if (selectedTool.optionsType === 'compression_level') {
      options.compressionLevel = compressionLevel
    } else if (selectedTool.optionsType === 'page_range') {
      options.pages = pageRange
    }

    onStartConversion(selectedTool, options)
  }

  return (
    <div className="w-full max-w-[760px] mx-auto bg-white border border-[#E2E8F0] rounded-xl p-4 sm:p-6 shadow-xs space-y-5">
      {/* Step 1: Available Tools Selector */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-semibold text-[#0F172A] flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-blue-600" />
            Pilih Operasi Konversi
          </label>
          <span className="text-xs text-[#64748B]">
            {compatibleTools.length} tool kompatibel
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
                className={`text-left p-3 rounded-lg border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/70 shadow-xs ring-1 ring-blue-600'
                    : 'border-[#E2E8F0] bg-white hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm font-semibold ${isSelected ? 'text-blue-900' : 'text-[#0F172A]'}`}>
                    {tool.name}
                  </span>
                  <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-white border border-[#E2E8F0] text-[#64748B]">
                    {tool.outputFormat}
                  </span>
                </div>
                <p className="text-xs text-[#64748B] line-clamp-2 leading-relaxed">
                  {tool.description}
                </p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Step 2: Configuration / Options (if tool requires it) */}
      {selectedTool && selectedTool.requiresOptions && (
        <div className="p-3.5 bg-slate-50 border border-[#E2E8F0] rounded-lg space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#0F172A]">
            <Settings2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Pengaturan Operasi: {selectedTool.name}</span>
          </div>

          {selectedTool.optionsType === 'compression_level' && (
            <div className="grid grid-cols-3 gap-2 pt-1">
              {(
                [
                  { id: 'low', label: 'Rendah', desc: 'Kualitas terbaik' },
                  { id: 'recommended', label: 'Standar', desc: 'Ukuran optimal' },
                  { id: 'high', label: 'Tinggi', desc: 'Ukuran terkecil' },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setCompressionLevel(opt.id)}
                  className={`p-2 rounded border text-left cursor-pointer transition-colors ${
                    compressionLevel === opt.id
                      ? 'border-blue-600 bg-white ring-1 ring-blue-600'
                      : 'border-[#E2E8F0] bg-white/70 hover:bg-white'
                  }`}
                >
                  <div className="text-xs font-semibold text-[#0F172A]">{opt.label}</div>
                  <div className="text-[10px] text-[#64748B]">{opt.desc}</div>
                </button>
              ))}
            </div>
          )}

          {selectedTool.optionsType === 'page_range' && (
            <div className="pt-1">
              <input
                type="text"
                placeholder="Contoh: all atau 1-3, 5, 8"
                value={pageRange}
                onChange={(e) => setPageRange(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-md border border-[#E2E8F0] bg-white focus:outline-blue-600"
              />
              <span className="text-[11px] text-[#64748B] mt-1 block">
                Ketik nomor halaman atau rentang yang ingin dipisahkan.
              </span>
            </div>
          )}
        </div>
      )}

      {/* Step 3: Start Conversion Button */}
      <div>
        <button
          type="button"
          onClick={handleStart}
          disabled={!selectedTool || isProcessing}
          className="w-full py-3.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm sm:text-base flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <span>Konversi Sekarang</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
