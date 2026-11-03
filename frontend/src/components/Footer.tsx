import { FileText, Shield } from 'lucide-react'

const CURRENT_YEAR = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="bg-white border-t border-[#E2E8F0] pt-12 pb-8">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <FileText className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg text-[#0F172A] tracking-tight">
                Convertin<span className="text-blue-600">Aja</span>
              </span>
            </div>
            <p className="text-sm text-[#64748B] max-w-sm leading-relaxed">
              Platform konversi dokumen gratis, aman, dan tanpa login. Sederhanakan pekerjaan dokumen Anda dalam hitungan detik.
            </p>
            <div className="inline-flex items-center gap-1.5 text-xs text-[#64748B] bg-slate-50 px-2.5 py-1 rounded border border-[#E2E8F0]">
              <Shield className="w-3.5 h-3.5 text-blue-600" />
              <span>Privasi Terjamin: File terhapus otomatis setelah 60 menit</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#0F172A] mb-3">
              Kategori Konversi
            </h4>
            <ul className="space-y-2 text-sm text-[#64748B]">
              <li><a href="#tools" className="hover:text-blue-600 transition-colors">PDF Tools (Merge, Split)</a></li>
              <li><a href="#tools" className="hover:text-blue-600 transition-colors">Kompres PDF</a></li>
              <li><a href="#tools" className="hover:text-blue-600 transition-colors">Image to PDF & WebP</a></li>
              <li><a href="#tools" className="hover:text-blue-600 transition-colors">Office to PDF</a></li>
            </ul>
          </div>

          {/* Legal & Contact */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#0F172A] mb-3">
              Kebijakan & Dukungan
            </h4>
            <ul className="space-y-2 text-sm text-[#64748B]">
              <li><a href="#privacy" className="hover:text-blue-600 transition-colors">Privacy Policy</a></li>
              <li><a href="#terms" className="hover:text-blue-600 transition-colors">Terms of Service</a></li>
              <li><a href="#contact" className="hover:text-blue-600 transition-colors">Kontak & Feedback</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#64748B]">
          <p>© {CURRENT_YEAR} ConvertinAja. Hak cipta dilindungi.</p>
          <p>Dibuat untuk produktivitas dokumen yang cepat dan aman.</p>
        </div>
      </div>
    </footer>
  )
}
