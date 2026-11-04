import { useState, useEffect } from 'react'
import { ShieldCheck, X } from 'lucide-react'
import { useI18n } from '../i18n'
import type { LegalPageSlug } from './LegalView'

const PRIVACY_DISMISSED_KEY = 'convertinaja_privacy_dismissed'

interface PrivacyBannerProps {
  onOpenPrivacy: (slug: LegalPageSlug) => void
}

export function PrivacyBanner({ onOpenPrivacy }: PrivacyBannerProps) {
  const { lang } = useI18n()
  const isId = lang === 'id'
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Only show if user has not previously acknowledged
    const dismissed = localStorage.getItem(PRIVACY_DISMISSED_KEY)
    if (!dismissed) {
      const timer = setTimeout(() => setIsVisible(true), 800)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    localStorage.setItem(PRIVACY_DISMISSED_KEY, 'true')
  }

  const handleLearnMore = () => {
    onOpenPrivacy('privacy')
  }

  if (!isVisible) return null

  return (
    <aside
      aria-label="Privacy Notice"
      className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40 max-w-sm w-[calc(100vw-2rem)] bg-white border border-[#E2E8F0] rounded-2xl shadow-lg p-4 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
        </div>

        <div className="flex-1 min-w-0 pr-2">
          <h4 className="text-xs font-bold text-[#0F172A] tracking-tight">
            {isId ? 'Privasi Dokumen Terjamin' : 'Zero-Storage Privacy'}
          </h4>
          <p className="text-xs text-[#64748B] leading-relaxed mt-1">
            {isId
              ? 'Berkas mentah langsung dimusnahkan seketika setelah diproses. Tanpa registrasi akun dan tanpa database penyimpanan.'
              : 'Raw source files are destroyed immediately after conversion. Zero user accounts, zero persistent storage.'}
          </p>

          <div className="flex items-center gap-4 mt-3 pt-1 border-t border-[#F1F5F9] text-xs">
            <button
              type="button"
              onClick={handleLearnMore}
              className="font-semibold text-[#2563EB] hover:underline cursor-pointer"
            >
              {isId ? 'Pelajari Kebijakan' : 'Learn More'}
            </button>
            <button
              type="button"
              onClick={handleDismiss}
              className="px-3.5 py-1 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-medium text-xs transition-colors cursor-pointer shadow-2xs"
            >
              {isId ? 'Mengerti' : 'Got it'}
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDismiss}
          className="text-[#94A3B8] hover:text-[#0F172A] p-1 rounded-md transition-colors cursor-pointer shrink-0"
          aria-label="Close privacy notice"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  )
}
