import { useState } from 'react'
import { ArrowRight, Settings2, AlertTriangle, Layers, Check } from 'lucide-react'
import type { ToolDefinition, UploadedFile } from '../types/conversion'
import { getCompatibleTools } from '../services/toolsCatalog'
import { useI18n } from '../i18n'

interface InlineToolSelectorProps {
  files: UploadedFile[]
  initialToolId?: string | null
  onStartConversion: (tool: ToolDefinition, options: Record<string, unknown>) => void
  isProcessing?: boolean
}

export function InlineToolSelector({
  files,
  initialToolId,
  onStartConversion,
  isProcessing,
}: InlineToolSelectorProps) {
  const { t } = useI18n()
  const compatibleTools = getCompatibleTools(files)
  const [chosenToolId, setChosenToolId] = useState<string | null>(null)

  // Synchronize chosen tool safely without useEffect
  const selectedToolId =
    chosenToolId && compatibleTools.some((tool) => tool.id === chosenToolId)
      ? chosenToolId
      : initialToolId && compatibleTools.some((tool) => tool.id === initialToolId)
        ? initialToolId
        : (compatibleTools[0]?.id ?? '')

  // Conversion options state
  const [dpi, setDpi] = useState<number>(300) // Default: Best Quality (300 DPI)
  const [compressionLevel, setCompressionLevel] = useState<'low' | 'recommended' | 'high'>('recommended')
  const [pageRange, setPageRange] = useState<string>('all')

  // Image Optimization options state
  const [targetSizePreset, setTargetSizePreset] = useState<'none' | '100kb' | '300kb' | '500kb' | '1mb' | 'custom'>('none')
  const [customTargetSize, setCustomTargetSize] = useState<number>(300)
  const [customTargetUnit, setCustomTargetUnit] = useState<'KB' | 'MB'>('KB')
  const [resizePreset, setResizePreset] = useState<'original' | '1920' | '1600' | '1280' | '1080' | 'custom'>('original')
  const [customWidth, setCustomWidth] = useState<number>(1920)
  const [imageFormat, setImageFormat] = useState<'auto' | 'webp' | 'jpeg' | 'png' | 'avif'>('auto')
  const [qualityStrategy, setQualityStrategy] = useState<'balanced' | 'visual_hq' | 'aggressive'>('balanced')
  const [stripMetadata, setStripMetadata] = useState<boolean>(true)
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false)

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
          {t.selector.unsupportedComb}
        </h4>
        <p className="text-xs sm:text-sm text-amber-800 max-w-md mx-auto">
          {t.selector.unsupportedCombDesc}
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
    } else if (selectedTool.optionsType === 'image_optimizer') {
      options.mode = selectedTool.id === 'smart-optimize' ? 'smart' : 'manual'
      options.output_format = imageFormat
      options.quality_strategy = qualityStrategy
      options.remove_metadata = stripMetadata
      options.maintain_aspect_ratio = true

      if (targetSizePreset === '100kb') {
        options.target_size_value = 100
        options.target_size_unit = 'KB'
      } else if (targetSizePreset === '300kb') {
        options.target_size_value = 300
        options.target_size_unit = 'KB'
      } else if (targetSizePreset === '500kb') {
        options.target_size_value = 500
        options.target_size_unit = 'KB'
      } else if (targetSizePreset === '1mb') {
        options.target_size_value = 1
        options.target_size_unit = 'MB'
      } else if (targetSizePreset === 'custom' && customTargetSize > 0) {
        options.target_size_value = customTargetSize
        options.target_size_unit = customTargetUnit
      }

      if (resizePreset === '1920') {
        options.max_width = 1920
        options.max_height = 1920
      } else if (resizePreset === '1600') {
        options.max_width = 1600
        options.max_height = 1600
      } else if (resizePreset === '1280') {
        options.max_width = 1280
        options.max_height = 1280
      } else if (resizePreset === '1080') {
        options.max_width = 1080
        options.max_height = 1080
      } else if (resizePreset === 'custom' && customWidth > 0) {
        options.max_width = customWidth
      }
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
            {t.selector.chooseOperation}
          </label>
          <span className="text-xs text-[#64748B]">
            {t.selector.toolsAvailable(compatibleTools.length)}
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
                    {t.selector.output} <strong className="text-[#0F172A]">{tool.outputFormat}</strong>
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
            <span>{t.selector.optionsTitle(selectedTool.name)}</span>
          </div>

          {/* Image Quality (DPI) Selection */}
          {selectedTool.optionsType === 'quality' && (
            <div className="space-y-2">
              <label className="text-xs text-[#64748B] block">
                {t.selector.qualityLabel}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  {
                    val: 300,
                    label: t.selector.bestQuality,
                    sub: t.selector.bestQualitySub,
                    badge: t.selector.bestBadge,
                  },
                  {
                    val: 150,
                    label: t.selector.standardQuality,
                    sub: t.selector.standardQualitySub,
                  },
                  {
                    val: 600,
                    label: t.selector.ultraQuality,
                    sub: t.selector.ultraQualitySub,
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
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-[#1D4ED8]">
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
                {t.selector.compressionLabel}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  {
                    val: 'recommended',
                    label: t.selector.compRecommended,
                    sub: t.selector.compRecommendedSub,
                  },
                  {
                    val: 'low',
                    label: t.selector.compLow,
                    sub: t.selector.compLowSub,
                  },
                  {
                    val: 'high',
                    label: t.selector.compHigh,
                    sub: t.selector.compHighSub,
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

          {/* Image Optimizer Configuration */}
          {selectedTool.optionsType === 'image_optimizer' && (
            <div className="space-y-4">
              {/* Target File Size Selection */}
              <div>
                <label className="text-xs font-semibold text-[#0F172A] block mb-1.5">
                  {t.selector.targetSizeTitle}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                  {[
                    { id: 'none', label: t.selector.targetSizeAuto },
                    { id: '100kb', label: '≤ 100 KB' },
                    { id: '300kb', label: '≤ 300 KB' },
                    { id: '500kb', label: '≤ 500 KB' },
                    { id: '1mb', label: '≤ 1 MB' },
                    { id: 'custom', label: t.selector.targetSizeCustom },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setTargetSizePreset(p.id as typeof targetSizePreset)}
                      className={`px-2.5 py-2 text-xs font-medium rounded-lg border text-center transition-all cursor-pointer ${
                        targetSizePreset === p.id
                          ? 'border-[#2563EB] bg-[#EFF6FF] text-[#1D4ED8] ring-1 ring-[#2563EB]'
                          : 'border-[#E2E8F0] bg-white text-[#64748B] hover:border-slate-300'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                {targetSizePreset === 'custom' && (
                  <div className="mt-2.5 flex items-center gap-2">
                    <input
                      type="number"
                      min={10}
                      max={50000}
                      value={customTargetSize}
                      onChange={(e) => setCustomTargetSize(Number(e.target.value))}
                      className="w-32 bg-white border border-[#E2E8F0] rounded-lg px-3 py-1.5 text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                      placeholder={t.selector.targetSizePlaceholder}
                    />
                    <select
                      value={customTargetUnit}
                      onChange={(e) => setCustomTargetUnit(e.target.value as 'KB' | 'MB')}
                      className="bg-white border border-[#E2E8F0] rounded-lg px-2.5 py-1.5 text-xs text-[#0F172A] focus:outline-none"
                    >
                      <option value="KB">KB</option>
                      <option value="MB">MB</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Advanced Settings Toggle */}
              <div className="border-t border-[#E2E8F0] pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="text-xs text-[#2563EB] font-medium hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <Settings2 className="w-3.5 h-3.5" />
                  <span>{showAdvanced ? t.selector.advancedSettingsHide : t.selector.advancedSettingsShow}</span>
                </button>

                {showAdvanced && (
                  <div className="mt-3 space-y-3 pt-2">
                    {/* Resize Preset */}
                    <div>
                      <label className="text-[11px] font-medium text-[#64748B] block mb-1">
                        {t.selector.resizeResolutionLabel}
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                        {[
                          { id: 'original', label: t.selector.resizeOriginal },
                          { id: '1920', label: '1920 px (Large)' },
                          { id: '1600', label: '1600 px (Med)' },
                          { id: '1280', label: '1280 px (Std)' },
                          { id: '1080', label: '1080 px (Small)' },
                          { id: 'custom', label: t.selector.resizeCustom },
                        ].map((r) => (
                          <button
                            key={r.id}
                            type="button"
                            onClick={() => setResizePreset(r.id as typeof resizePreset)}
                            className={`px-2 py-1.5 text-[11px] rounded border text-center transition-all cursor-pointer ${
                              resizePreset === r.id
                                ? 'border-[#2563EB] bg-[#EFF6FF] text-[#1D4ED8]'
                                : 'border-[#E2E8F0] bg-white text-[#64748B]'
                            }`}
                          >
                            {r.label}
                          </button>
                        ))}
                      </div>

                      {resizePreset === 'custom' && (
                        <div className="mt-2 flex items-center gap-2">
                          <input
                            type="number"
                            min={100}
                            max={10000}
                            value={customWidth}
                            onChange={(e) => setCustomWidth(Number(e.target.value))}
                            className="w-32 bg-white border border-[#E2E8F0] rounded-lg px-2.5 py-1 text-xs text-[#0F172A]"
                            placeholder={t.selector.resizePlaceholder}
                          />
                          <span className="text-xs text-[#64748B]">{t.selector.longestSideUnit}</span>
                        </div>
                      )}
                    </div>

                    {/* Output Format & Strategy */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-medium text-[#64748B] block mb-1">{t.selector.outputFormatLabel}</label>
                        <select
                          value={imageFormat}
                          onChange={(e) => setImageFormat(e.target.value as typeof imageFormat)}
                          className="w-full bg-white border border-[#E2E8F0] rounded-lg px-2.5 py-1.5 text-xs text-[#0F172A]"
                        >
                          <option value="auto">{t.selector.optAuto}</option>
                          <option value="webp">{t.selector.optWebp}</option>
                          <option value="jpeg">{t.selector.optJpeg}</option>
                          <option value="png">{t.selector.optPng}</option>
                          <option value="avif">{t.selector.optAvif}</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] font-medium text-[#64748B] block mb-1">{t.selector.strategyLabel}</label>
                        <select
                          value={qualityStrategy}
                          onChange={(e) => setQualityStrategy(e.target.value as typeof qualityStrategy)}
                          className="w-full bg-white border border-[#E2E8F0] rounded-lg px-2.5 py-1.5 text-xs text-[#0F172A]"
                        >
                          <option value="balanced">{t.selector.stratBalanced}</option>
                          <option value="visual_hq">{t.selector.stratVisualHQ}</option>
                          <option value="aggressive">{t.selector.stratAggressive}</option>
                        </select>
                      </div>
                    </div>

                    {/* Metadata stripping */}
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="checkbox"
                        id="stripMetaCheckbox"
                        checked={stripMetadata}
                        onChange={(e) => setStripMetadata(e.target.checked)}
                        className="rounded border-[#CBD5E1] text-[#2563EB] focus:ring-[#2563EB]"
                      />
                      <label htmlFor="stripMetaCheckbox" className="text-xs text-[#64748B] cursor-pointer">
                        {t.selector.stripMetadataLabel}
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Page Range Selection */}
          {selectedTool.optionsType === 'page_range' && (
            <div className="space-y-1.5">
              <label htmlFor="pageRangeInput" className="text-xs text-[#64748B] block">
                {t.selector.pageRangeLabel}
              </label>
              <input
                id="pageRangeInput"
                type="text"
                value={pageRange}
                onChange={(e) => setPageRange(e.target.value)}
                placeholder={t.selector.pageRangePlaceholder}
                className="w-full bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              />
            </div>
          )}
        </div>
      )}

      {/* 3. Action Group */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#E2E8F0]">
        <div className="text-xs text-[#64748B]">
          {t.selector.privacyText(validFiles.length)}
        </div>

        <button
          type="button"
          disabled={isProcessing || !selectedTool}
          onClick={handleStart}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-sm shadow-xs transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <span>{t.selector.processingButton}</span>
          ) : (
            <>
              <span>{t.selector.convertButton}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  )
}
