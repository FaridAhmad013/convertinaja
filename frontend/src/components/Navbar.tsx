import { useState } from 'react'
import { FileCode2, Menu, X, Globe, History } from 'lucide-react'
import { useI18n } from '../i18n'

interface NavbarProps {
  onOpenHistory: () => void
  onSelectCategory?: (category: string) => void
}

export function Navbar({ onOpenHistory }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { lang, setLang, t } = useI18n()

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false)
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const toggleLanguage = () => {
    setLang(lang === 'id' ? 'en' : 'id')
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-[#E2E8F0]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="/" className="flex items-center gap-2 group cursor-pointer">
          <div className="w-9 h-9 rounded-lg bg-[#2563EB] flex items-center justify-center text-white shadow-xs group-hover:bg-[#1D4ED8] transition-colors">
            <FileCode2 className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg text-[#0F172A] tracking-tight">
            Convertin<span className="text-[#2563EB]">Aja</span>
          </span>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-5">
          <button
            type="button"
            onClick={() => scrollToSection('tools')}
            className="text-sm font-medium text-[#64748B] hover:text-[#0F172A] transition-colors cursor-pointer"
          >
            {t.nav.tools}
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('how-it-works')}
            className="text-sm font-medium text-[#64748B] hover:text-[#0F172A] transition-colors cursor-pointer"
          >
            {t.nav.howItWorks}
          </button>

          {/* Local History Trigger */}
          <button
            type="button"
            onClick={onOpenHistory}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#64748B] hover:text-[#2563EB] transition-colors cursor-pointer"
          >
            <History className="w-4 h-4" />
            <span>{t.nav.history}</span>
          </button>

          {/* Language Toggle */}
          <button
            type="button"
            onClick={toggleLanguage}
            title={t.nav.changeLang}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[#E2E8F0] bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-[#0F172A] cursor-pointer transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-[#2563EB]" />
            <span className="uppercase">{lang}</span>
          </button>
        </nav>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={toggleLanguage}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-md border border-[#E2E8F0] bg-slate-50 text-xs font-semibold text-[#0F172A]"
          >
            <span className="uppercase">{lang}</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#64748B] hover:text-[#0F172A] focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#E2E8F0] bg-white px-4 py-4 space-y-2">
          <button
            type="button"
            onClick={() => scrollToSection('tools')}
            className="w-full text-left py-2 text-sm font-medium text-[#64748B] hover:text-[#0F172A]"
          >
            {t.nav.tools}
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('how-it-works')}
            className="w-full text-left py-2 text-sm font-medium text-[#64748B] hover:text-[#0F172A]"
          >
            {t.nav.howItWorks}
          </button>
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false)
              onOpenHistory()
            }}
            className="w-full text-left py-2 text-sm font-medium text-[#2563EB] flex items-center gap-2"
          >
            <History className="w-4 h-4" />
            <span>{t.nav.history}</span>
          </button>
        </div>
      )}
    </header>
  )
}
