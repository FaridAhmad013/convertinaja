import { FileUp, Flame, LayoutGrid, BookOpen, ShieldCheck } from 'lucide-react'
import { useI18n } from '../i18n'
import type { LegalTab } from './LegalModal'

interface MobileBottomNavProps {
  onGoToUpload: () => void
  onGoToPopular: () => void
  onGoToCatalog: () => void
  onGoToGuides: () => void
  onOpenLegal: (tab: LegalTab) => void
  hasActiveJob: boolean
}

export function MobileBottomNav({
  onGoToUpload,
  onGoToPopular,
  onGoToCatalog,
  onGoToGuides,
  onOpenLegal,
  hasActiveJob,
}: MobileBottomNavProps) {
  const { lang } = useI18n()
  const isId = lang === 'id'

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E2E8F0] shadow-lg px-2 py-1.5 flex items-center justify-around safe-bottom"
    >
      <button
        type="button"
        onClick={onGoToUpload}
        className="flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-[#0F172A] hover:text-[#2563EB] active:scale-95 transition-all cursor-pointer relative"
      >
        <FileUp className="w-5 h-5 text-[#2563EB]" />
        <span className="text-[10px] font-semibold mt-0.5">
          {hasActiveJob ? (isId ? 'Hasil' : 'Result') : isId ? 'Konversi' : 'Convert'}
        </span>
        {hasActiveJob && (
          <span className="absolute top-1 right-2.5 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
        )}
      </button>

      <button
        type="button"
        onClick={onGoToPopular}
        className="flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-[#64748B] hover:text-[#2563EB] active:scale-95 transition-all cursor-pointer"
      >
        <Flame className="w-5 h-5" />
        <span className="text-[10px] font-medium mt-0.5">{isId ? 'Populer' : 'Popular'}</span>
      </button>

      <button
        type="button"
        onClick={onGoToCatalog}
        className="flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-[#64748B] hover:text-[#2563EB] active:scale-95 transition-all cursor-pointer"
      >
        <LayoutGrid className="w-5 h-5" />
        <span className="text-[10px] font-medium mt-0.5">{isId ? 'Katalog' : 'Catalog'}</span>
      </button>

      <button
        type="button"
        onClick={onGoToGuides}
        className="flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-[#64748B] hover:text-[#2563EB] active:scale-95 transition-all cursor-pointer"
      >
        <BookOpen className="w-5 h-5" />
        <span className="text-[10px] font-medium mt-0.5">{isId ? 'Panduan' : 'Guides'}</span>
      </button>

      <button
        type="button"
        onClick={() => onOpenLegal('privacy')}
        className="flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-[#64748B] hover:text-[#2563EB] active:scale-95 transition-all cursor-pointer"
      >
        <ShieldCheck className="w-5 h-5" />
        <span className="text-[10px] font-medium mt-0.5">{isId ? 'Privasi' : 'Privacy'}</span>
      </button>
    </nav>
  )
}
