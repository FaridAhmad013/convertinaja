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
    <footer className="w-full border-t border-[#E2E8F0] bg-[#F8FAFC]/80 text-[#0F172A] pt-14 pb-12 transition-colors">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Main Footer Grid: 4 Clean SaaS Columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          {/* Col 1: Brand & Deep Mission (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#2563EB] flex items-center justify-center text-white shadow-xs">
                <FileCode2 className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-lg text-[#0F172A] tracking-tight">
                Convertin<span className="text-[#2563EB]">Aja</span>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed pr-2">
              {isId
                ? 'ConvertinAja adalah utilitas konversi dokumen web open-source berkinerja tinggi. Dirancang dengan filosofi zero-retention: berkas mentah dimusnahkan seketika setelah diproses, tanpa registrasi, tanpa penyimpanan jangka panjang, dan sepenuhnya gratis.'
                : 'ConvertinAja is a high-performance open-source document conversion utility. Built on a strict zero-retention philosophy: raw files are destroyed immediately upon processing, requiring zero registration or accounts.'}
            </p>
          </div>

          {/* Col 2: Legal & Kebijakan (2 cols) */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">
              {isId ? 'Kebijakan' : 'Legal & Trust'}
            </h4>
            <ul className="space-y-2 text-xs text-[#64748B]">
              <li>
                <button
                  type="button"
                  onClick={() => onOpenLegal('privacy')}
                  className="hover:text-[#2563EB] transition-colors cursor-pointer text-left"
                >
                  {isId ? 'Kebijakan Privasi' : 'Privacy Policy'}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenLegal('terms')}
                  className="hover:text-[#2563EB] transition-colors cursor-pointer text-left"
                >
                  {isId ? 'Syarat & Ketentuan' : 'Terms of Service'}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenLegal('about')}
                  className="hover:text-[#2563EB] transition-colors cursor-pointer text-left"
                >
                  {isId ? 'Tentang & Lisensi FOSS' : 'About & FOSS Licenses'}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenLegal('contact')}
                  className="hover:text-[#2563EB] transition-colors cursor-pointer text-left"
                >
                  {isId ? 'Hubungi Pengembang' : 'Contact Developer'}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Tools Shortcuts (2 cols) */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">
              {isId ? 'Format Populer' : 'Popular Formats'}
            </h4>
            <ul className="space-y-2 text-xs text-[#64748B]">
              <li>
                <a href="#popular-tools" className="hover:text-[#2563EB] transition-colors">
                  PDF to Image (JPG/PNG)
                </a>
              </li>
              <li>
                <a href="#popular-tools" className="hover:text-[#2563EB] transition-colors">
                  Image to PDF
                </a>
              </li>
              <li>
                <a href="#popular-tools" className="hover:text-[#2563EB] transition-colors">
                  Compress PDF
                </a>
              </li>
              <li>
                <a href="#popular-tools" className="hover:text-[#2563EB] transition-colors">
                  Office to PDF
                </a>
              </li>
              <li>
                <a href="#tools" className="hover:text-[#2563EB] transition-colors">
                  WebP Converter
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Creator, Portfolio & Connect (3 cols) - Clean Text Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">
              {isId ? 'Pengembang' : 'Developer & Author'}
            </h4>
            <p className="text-xs text-[#64748B] leading-relaxed">
              {isId
                ? 'Dikelola secara independen sebagai proyek FOSS untuk kemudahan produktivitas digital.'
                : 'Independently engineered as a FOSS utility for everyday digital productivity.'}
            </p>

            <ul className="space-y-2.5 pt-1 text-xs text-[#64748B]">
              <li>
                <a
                  href="https://faridahmad.dev"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 font-medium text-[#0F172A] hover:text-[#2563EB] transition-colors"
                >
                  <span>Farid Ahmad (Portofolio)</span>
                  <ExternalLink className="w-3 h-3 text-[#94A3B8]" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/faridahmad013"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 font-medium text-[#0F172A] hover:text-[#0A66C2] transition-colors"
                >
                  <span>LinkedIn Profil</span>
                  <ExternalLink className="w-3 h-3 text-[#94A3B8]" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/faridahmad013"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 font-medium text-[#0F172A] hover:text-[#2563EB] transition-colors"
                >
                  <span>GitHub Profil</span>
                  <ExternalLink className="w-3 h-3 text-[#94A3B8]" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Attribution, Open-Source & Copyright */}
        <div className="pt-8 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#64748B]">
          <div className="flex items-center gap-1.5 text-center sm:text-left">
            <span>{isId ? 'Dibuat dengan' : 'Built with'}</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>oleh <strong className="font-semibold text-[#0F172A]">Farid Ahmad</strong></span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/faridahmad013/convertinaja"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-[#0F172A] hover:text-[#2563EB] font-medium transition-colors"
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
