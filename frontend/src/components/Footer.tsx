import { ShieldCheck, FileCode2 } from 'lucide-react'
import { useI18n } from '../i18n'

export function Footer() {
  const { t } = useI18n()

  return (
    <footer className="w-full bg-white border-t border-[#E2E8F0]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          {/* Logo & Tagline */}
          <div className="space-y-1">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#2563EB] flex items-center justify-center text-white">
                <FileCode2 className="w-4 h-4" />
              </div>
              <span className="font-bold text-base text-[#0F172A] tracking-tight">
                Convertin<span className="text-[#2563EB]">Aja</span>
              </span>
            </div>
            <p className="text-xs text-[#64748B]">
              {t.footer.tagline}
            </p>
          </div>

          {/* Privacy highlights */}
          <div className="flex items-center gap-2 text-xs text-[#64748B] bg-slate-50 px-3.5 py-2 rounded-lg border border-[#E2E8F0]">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>{t.footer.privacyGuaranteed}</span>
          </div>

          {/* Links / Copyright */}
          <div className="flex items-center gap-4 text-xs text-[#64748B]">
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
