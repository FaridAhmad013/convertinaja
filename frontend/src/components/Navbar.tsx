import { useState } from 'react'
import { FileText, Menu, X, Shield, Sparkles } from 'lucide-react'

interface NavbarProps {
  onSelectCategory?: (category: string) => void
}

export function Navbar({ onSelectCategory }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleNavClick = (cat: string) => {
    onSelectCategory?.(cat)
    setMobileMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#E2E8F0]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 h-[64px] sm:h-[72px] flex items-center justify-between">
        {/* Brand Logo */}
        <a href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm group-hover:bg-blue-700 transition-colors">
            <FileText className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg sm:text-xl text-[#0F172A] tracking-tight">
              Convertin<span className="text-blue-600">Aja</span>
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={() => handleNavClick('pdf')}
            className="px-3.5 py-2 text-sm font-medium text-[#64748B] hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
          >
            PDF Tools
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('image')}
            className="px-3.5 py-2 text-sm font-medium text-[#64748B] hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
          >
            Image Tools
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('office')}
            className="px-3.5 py-2 text-sm font-medium text-[#64748B] hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
          >
            Office Tools
          </button>
        </nav>

        {/* Right Badge: Privacy & Free */}
        <div className="hidden md:flex items-center gap-2 text-xs text-[#64748B] bg-slate-100 px-3 py-1.5 rounded-full border border-[#E2E8F0]">
          <Shield className="w-3.5 h-3.5 text-blue-600" />
          <span>Tanpa Akun • 100% Gratis</span>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Buka menu navigasi"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#E2E8F0] bg-white px-4 pt-2 pb-4 space-y-1">
          <button
            type="button"
            onClick={() => handleNavClick('pdf')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-[#0F172A] hover:bg-blue-50 hover:text-blue-600"
          >
            PDF Tools
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('image')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-[#0F172A] hover:bg-blue-50 hover:text-blue-600"
          >
            Image Tools
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('office')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-[#0F172A] hover:bg-blue-50 hover:text-blue-600"
          >
            Office Tools
          </button>
          <div className="pt-2 border-t border-[#E2E8F0] flex items-center gap-2 text-xs text-[#64748B] px-3 py-1">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Tanpa Registrasi • Hapus Otomatis 60 Menit</span>
          </div>
        </div>
      )}
    </header>
  )
}
