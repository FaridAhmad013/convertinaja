import { useState } from 'react'
import { FileCode2, Menu, X, Globe } from 'lucide-react'
import { useI18n } from '../i18n'
interface NavbarProps {
  onSelectCategory?: (category: string) => void
}

export function Navbar({ onSelectCategory: _onSelectCategory }: NavbarProps = {}) {
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
        <nav className="hidden md:flex items-center gap-6">
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

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            type="button"
            onClick={toggleLanguage}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-[#E2E8F0] bg-slate-50 text-xs font-semibold text-[#0F172A]"
          >
            <Globe className="w-3.5 h-3.5 text-[#2563EB]" />
            <span className="uppercase">{lang}</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#64748B] hover:text-[#0F172A] rounded-lg cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E2E8F0] bg-white px-4 pt-3 pb-6 space-y-3">
          <button
            type="button"
            onClick={() => scrollToSection('tools')}
            className="block w-full text-left py-2 text-sm font-medium text-[#0F172A] hover:text-[#2563EB]"
          >
            {t.nav.tools}
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('how-it-works')}
            className="block w-full text-left py-2 text-sm font-medium text-[#0F172A] hover:text-[#2563EB]"
          >
            {t.nav.howItWorks}
          </button>
        </div>
      )}
    </header>
  )
}
