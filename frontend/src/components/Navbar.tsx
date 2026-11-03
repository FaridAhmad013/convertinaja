import { useState } from 'react'
import { FileText, Menu, X } from 'lucide-react'

interface NavbarProps {
  onSelectCategory?: (category: string) => void
}

export function Navbar({ onSelectCategory: _onSelectCategory }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    el?.scrollIntoView({ behavior: 'smooth' })
    setMobileMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#E2E8F0]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 h-[64px] flex items-center justify-between">
        {/* Brand Logo */}
        <a href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center text-white shadow-sm group-hover:bg-[#1D4ED8] transition-colors">
            <FileText className="w-4 h-4" />
          </div>
          <span className="font-bold text-lg text-[#0F172A] tracking-tight">
            ConvertinAja
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <button
            type="button"
            onClick={() => scrollToSection('tools')}
            className="text-sm font-medium text-[#64748B] hover:text-[#0F172A] transition-colors cursor-pointer"
          >
            Tools
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('how-it-works')}
            className="text-sm font-medium text-[#64748B] hover:text-[#0F172A] transition-colors cursor-pointer"
          >
            How it works
          </button>
        </nav>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#64748B] hover:text-[#0F172A] rounded-lg transition-colors"
            aria-label="Buka menu navigasi"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#E2E8F0] bg-white px-4 py-3 space-y-2">
          <button
            type="button"
            onClick={() => scrollToSection('tools')}
            className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-[#0F172A] hover:bg-[#F8FAFC]"
          >
            Tools
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('how-it-works')}
            className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-[#0F172A] hover:bg-[#F8FAFC]"
          >
            How it works
          </button>
        </div>
      )}
    </header>
  )
}
