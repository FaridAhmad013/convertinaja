import { FileCode2, ExternalLink, Heart } from 'lucide-react'
import { useI18n } from '../i18n'
import type { LegalPageSlug } from './LegalView'

interface FooterProps {
  onOpenLegal: (slug: LegalPageSlug) => void
}

export function Footer({ onOpenLegal }: FooterProps) {
  const { lang, t } = useI18n()
  const isId = lang === 'id'

  return (
    <footer className="w-full border-t border-[#E2E8F0] bg-white py-10 transition-colors">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Section: App Identity, Description & Author */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-lg">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#2563EB] flex items-center justify-center text-white shadow-2xs">
                <FileCode2 className="w-4 h-4" />
              </div>
              <span className="font-bold text-base text-[#0F172A] tracking-tight">
                Convertin<span className="text-[#2563EB]">Aja</span>
              </span>
            </div>
            <p className="text-xs text-[#64748B] leading-relaxed">
              {isId
                ? 'Platform konversi dokumen gratis, instan, dan aman. Mengubah PDF, Gambar, dan Office langsung di peramban dengan pemusnahan berkas seketika di server.'
                : 'Free, instant, and secure document conversion platform. Convert PDF, Images, and Office directly in your browser with zero data retention.'}
            </p>
          </div>

          {/* Clean Author Button Badges */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-xs font-medium text-[#0F172A]">
              <span>{isId ? 'Dibuat dengan' : 'Built with'}</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
              <span>oleh <strong className="font-semibold text-[#0F172A]">Farid Ahmad</strong></span>
            </div>

            <a
              href="https://faridahmad.dev"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#BFDBFE] bg-[#EFF6FF] hover:bg-blue-100 text-xs font-semibold text-[#2563EB] transition-colors shadow-2xs"
              title="Portofolio Farid Ahmad"
            >
              <span>Portofolio</span>
              <ExternalLink className="w-3 h-3 text-[#2563EB]" />
            </a>

            <a
              href="https://www.linkedin.com/in/faridahmad013"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#CBD5E1] bg-white hover:bg-slate-50 text-xs font-semibold text-[#0A66C2] transition-colors shadow-2xs"
              title="LinkedIn Farid Ahmad"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.6 1.6 0 0 0-1.6 1.6 1.6 1.6 0 0 0 1.6 1.6 1.6 1.6 0 0 0 1.6-1.6 1.6 1.6 0 0 0-1.6-1.6Z" />
              </svg>
              <span>LinkedIn</span>
              <ExternalLink className="w-3 h-3 text-[#0A66C2]" />
            </a>
          </div>
        </div>

        {/* Bottom Section: Legal Navigation & Copyright */}
        <div className="pt-6 border-t border-[#F1F5F9] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#64748B]">
          {/* Dedicated Legal Pages Navigation Links */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 sm:gap-6 font-medium">
            <button
              type="button"
              onClick={() => onOpenLegal('privacy')}
              className="hover:text-[#2563EB] transition-colors cursor-pointer"
            >
              {isId ? 'Kebijakan Privasi' : 'Privacy Policy'}
            </button>
            <button
              type="button"
              onClick={() => onOpenLegal('terms')}
              className="hover:text-[#2563EB] transition-colors cursor-pointer"
            >
              {isId ? 'Syarat & Ketentuan' : 'Terms of Service'}
            </button>
            <button
              type="button"
              onClick={() => onOpenLegal('about')}
              className="hover:text-[#2563EB] transition-colors cursor-pointer"
            >
              {isId ? 'Tentang & Lisensi' : 'About & Licenses'}
            </button>
            <button
              type="button"
              onClick={() => onOpenLegal('contact')}
              className="hover:text-[#2563EB] transition-colors cursor-pointer"
            >
              {isId ? 'Hubungi Kami' : 'Contact'}
            </button>
          </div>

          {/* Links & Open-Source Copyright */}
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/faridahmad013/convertinaja"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-[#0F172A] transition-colors"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span>{t.footer.openSource}</span>
            </a>
            <span>•</span>
            <span>&copy; ConvertinAja</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
