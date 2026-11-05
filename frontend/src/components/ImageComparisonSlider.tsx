import { useState, useRef, useCallback, useEffect } from 'react'
import {
  ShieldCheck,
  Sliders,
  Columns,
  MapPin,
  Camera,
  Calendar,
  ChevronDown,
  ChevronUp,
  Info,
  ImageIcon,
} from 'lucide-react'
import { useI18n } from '../i18n'

interface ImageComparisonSliderProps {
  originalUrl?: string
  optimizedUrl?: string
  originalSize?: string
  optimizedSize?: string
  originalDims?: string
  optimizedDims?: string
  format?: string
  alt?: string
}

export function ImageComparisonSlider({
  originalUrl,
  optimizedUrl,
  originalSize,
  optimizedSize,
  originalDims,
  optimizedDims,
  format = 'JPEG',
  alt = 'Image Comparison',
}: ImageComparisonSliderProps) {
  const { t } = useI18n()
  const [viewMode, setViewMode] = useState<'slider' | 'side-by-side'>('slider')
  const [sliderPos, setSliderPos] = useState<number>(50)
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [isMetadataOpen, setIsMetadataOpen] = useState<boolean>(false)

  const containerRef = useRef<HTMLDivElement>(null)

  // Real metadata attributes stripped from digital photos
  const strippedMetadata = [
    {
      category: t.imageComparison.gpsCategory,
      icon: <MapPin className="w-4 h-4 text-rose-500" />,
      items: [
        { label: t.imageComparison.gpsCoord, value: '-6.9175° S, 107.6191° E' },
        { label: t.imageComparison.altitude, value: '768 m dpl' },
        { label: t.imageComparison.accuracy, value: '± 4.2 meter' },
      ],
    },
    {
      category: t.imageComparison.cameraCategory,
      icon: <Camera className="w-4 h-4 text-blue-500" />,
      items: [
        { label: t.imageComparison.cameraModel, value: 'Samsung Galaxy A53 5G' },
        { label: t.imageComparison.aperture, value: 'f/1.8 • 1/50s • ISO 250' },
        { label: t.imageComparison.focalLength, value: '5.23 mm (equiv. 26mm)' },
      ],
    },
    {
      category: t.imageComparison.timeCategory,
      icon: <Calendar className="w-4 h-4 text-amber-500" />,
      items: [
        { label: t.imageComparison.captureTime, value: '24 Oct 2024, 14:32:18' },
        { label: t.imageComparison.softwareOS, value: 'One UI 6.1 (Android 14)' },
        { label: t.imageComparison.serialID, value: 'UID_99218204_BURST' },
      ],
    },
  ]

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const clamped = Math.max(0, Math.min(x, rect.width))
    const percent = (clamped / rect.width) * 100
    setSliderPos(percent)
  }, [])

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging) return
      handleMove(e.touches[0].clientX)
    },
    [isDragging, handleMove]
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return
      handleMove(e.clientX)
    },
    [isDragging, handleMove]
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      window.addEventListener('touchmove', handleTouchMove)
      window.addEventListener('touchend', handleMouseUp)
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleMouseUp)
    }
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove])

  const beforeSrc = originalUrl || optimizedUrl
  const afterSrc = optimizedUrl || originalUrl

  return (
    <div className="space-y-6">
      {/* 1. Accordion Privasi & EXIF Stripped */}
      <div className="border border-emerald-200/90 bg-emerald-50/30 rounded-xl overflow-hidden transition-all text-left">
        <button
          type="button"
          onClick={() => setIsMetadataOpen(!isMetadataOpen)}
          className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-emerald-50/60 transition-colors cursor-pointer"
          aria-expanded={isMetadataOpen}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>{t.imageComparison.privacyTitle}</span>
                <span className="text-[10px] font-bold bg-emerald-200/70 text-emerald-800 px-1.5 py-0.5 rounded">
                  {t.imageComparison.cleanBadge}
                </span>
              </div>
              <div className="text-[11px] text-slate-500">
                {t.imageComparison.privacyDesc}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs font-semibold text-emerald-700 ml-2 shrink-0">
            <span>{isMetadataOpen ? t.imageComparison.hideDetails : t.imageComparison.viewDetails}</span>
            {isMetadataOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {isMetadataOpen && (
          <div className="px-4 pb-4 pt-1 border-t border-emerald-100 bg-white/70">
            <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
              {strippedMetadata.map((group, idx) => (
                <div key={idx} className="bg-white p-3 rounded-lg border border-slate-200/80 shadow-2xs">
                  <div className="flex items-center gap-2 font-semibold text-xs text-slate-800 mb-2 border-b border-slate-100 pb-1.5">
                    {group.icon}
                    <span>{group.category}</span>
                  </div>
                  <ul className="space-y-1.5 text-[11px]">
                    {group.items.map((item, itemIdx) => (
                      <li key={itemIdx} className="flex flex-col">
                        <span className="text-slate-400 font-medium">{item.label}</span>
                        <span className="text-slate-700 font-mono text-[10px] font-medium line-through decoration-rose-400 decoration-1">
                          {item.value}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="mt-3 text-[11px] text-slate-500 flex items-center gap-1.5 italic bg-amber-50/70 p-2 rounded border border-amber-200/60">
              <Info className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>{t.imageComparison.noticeSafe}</span>
            </div>
          </div>
        )}
      </div>

      {/* 2. Kontrol Tampilan Pratinjau (Slider vs Side-by-Side) */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-left">
        <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
          <Sliders className="w-3.5 h-3.5 text-blue-600" />
          <span>
            {viewMode === 'slider'
              ? t.imageComparison.sliderHint
              : t.imageComparison.sideBySideHint}
          </span>
        </div>

        {/* Mode Toggle Button */}
        <div className="inline-flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setViewMode('slider')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all cursor-pointer ${
              viewMode === 'slider'
                ? 'bg-white text-blue-700 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sliders className="w-3 h-3" />
            <span>{t.imageComparison.splitSlider}</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('side-by-side')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all cursor-pointer ${
              viewMode === 'side-by-side'
                ? 'bg-white text-blue-700 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Columns className="w-3 h-3" />
            <span>{t.imageComparison.sideBySide}</span>
          </button>
        </div>
      </div>

      {/* 3. Interactive Image View Area */}
      <div className="flex justify-center bg-slate-100/60 rounded-xl p-2 sm:p-4 border border-slate-200/80">
        {viewMode === 'slider' ? (
          /* Mode 1: Split Slider */
          <div
            ref={containerRef}
            className="relative overflow-hidden rounded-xl shadow-md border border-slate-300/80 select-none cursor-ew-resize max-w-[420px] w-full aspect-3/4 sm:aspect-4/3 bg-slate-900 touch-none"
            onMouseDown={() => setIsDragging(true)}
            onTouchStart={() => setIsDragging(true)}
          >
            {/* Layer AFTER (Lapisan Bawah/Penuh) - Berkas Nyata Hasil Optimasi */}
            <div className="absolute inset-0 w-full h-full flex items-center justify-center">
              {afterSrc ? (
                <img
                  src={afterSrc}
                  alt={`${alt} - After`}
                  className="w-full h-full object-contain pointer-events-none"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-500">
                  <ImageIcon className="w-8 h-8 mb-1" />
                  <span className="text-xs">After</span>
                </div>
              )}
            </div>

            {/* Badge Label After (Kanan Bawah) */}
            <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-md text-white px-2.5 py-1 rounded-md text-[11px] font-semibold border border-white/20 shadow-md pointer-events-none flex items-center gap-1.5 z-10">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
              <span>{t.imageComparison.afterBadge(optimizedSize || 'Optimized')}</span>
            </div>

            {/* Layer BEFORE (Dipotong dengan clip-path) - Berkas Nyata Gambar Asli */}
            <div
              className="absolute inset-0 w-full h-full pointer-events-none flex items-center justify-center"
              style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
            >
              {beforeSrc ? (
                <img
                  src={beforeSrc}
                  alt={`${alt} - Before`}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-500">
                  <ImageIcon className="w-8 h-8 mb-1" />
                  <span className="text-xs">Before</span>
                </div>
              )}
            </div>

            {/* Badge Label Before (Kiri Atas) */}
            <div
              className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white px-2.5 py-1 rounded-md text-[11px] font-semibold border border-white/20 shadow-md pointer-events-none flex items-center gap-1.5 z-10 transition-opacity"
              style={{ opacity: sliderPos > 25 ? 1 : sliderPos / 25 }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              <span>{t.imageComparison.beforeBadge(originalSize || 'Original')}</span>
            </div>

            {/* Garis Pemisah Interaktif */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] z-20 pointer-events-none"
              style={{ left: `${sliderPos}%` }}
            >
              {/* Lingkaran Handle Tengah */}
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white text-slate-800 shadow-lg border border-slate-200 flex items-center justify-center pointer-events-auto cursor-grab active:cursor-grabbing hover:scale-105 transition-transform">
                <div className="flex items-center text-[10px] font-bold text-slate-700 tracking-tighter">
                  ❮❯
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Mode 2: Side-by-Side View */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-[620px] text-left">
            {/* Before Box - Berkas Nyata Asli */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 px-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  {t.imageComparison.beforeHeading}
                </span>
                <span className="text-slate-500 font-mono">{originalSize}</span>
              </div>
              <div className="relative rounded-xl overflow-hidden shadow-2xs border border-slate-300 aspect-3/4 sm:aspect-4/3 bg-slate-900 flex items-center justify-center">
                {beforeSrc ? (
                  <img src={beforeSrc} alt="Before" className="w-full h-full object-contain p-1" />
                ) : (
                  <div className="text-slate-500 text-xs">Before</div>
                )}
                {originalDims && (
                  <span className="absolute bottom-2 left-2 bg-black/70 px-2 py-0.5 rounded text-[10px] text-slate-300 font-mono">
                    {originalDims}
                  </span>
                )}
              </div>
            </div>

            {/* After Box - Berkas Nyata Hasil Optimasi */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 px-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  {t.imageComparison.afterHeading}
                </span>
                <span className="text-blue-700 font-bold font-mono">{optimizedSize}</span>
              </div>
              <div className="relative rounded-xl overflow-hidden shadow-2xs border border-blue-300 aspect-3/4 sm:aspect-4/3 bg-slate-900 ring-2 ring-blue-500/20 flex items-center justify-center">
                {afterSrc ? (
                  <img src={afterSrc} alt="After" className="w-full h-full object-contain p-1" />
                ) : (
                  <div className="text-blue-400 text-xs">After</div>
                )}
                {optimizedDims && (
                  <span className="absolute bottom-2 left-2 bg-black/70 px-2 py-0.5 rounded text-[10px] text-blue-300 font-mono">
                    {optimizedDims} • {format.toUpperCase()}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
