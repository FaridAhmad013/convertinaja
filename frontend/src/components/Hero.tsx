import { Shield, Zap, Sparkles } from 'lucide-react'

export function Hero() {
  return (
    <section className="text-center pt-8 pb-4 sm:pt-12 sm:pb-8 max-w-[900px] mx-auto px-4">
      {/* Privacy Notice Pill */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs sm:text-sm font-medium mb-4">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Konversi Dokumen Cepat, Bebas Biaya & Tanpa Login</span>
      </div>

      {/* Main Headline */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0F172A] tracking-tight leading-tight sm:leading-tight mb-4">
        All your document conversions <br className="hidden sm:inline" />
        <span className="text-blue-600">in one place.</span>
      </h1>

      {/* Supporting Subtitle */}
      <p className="text-base sm:text-lg text-[#64748B] max-w-2xl mx-auto leading-relaxed mb-6">
        Ubah, gabungkan, kompres, dan kelola dokumen PDF, gambar, dan berkas Office dengan aman langsung dari peramban Anda.
      </p>

      {/* Feature Micro-Badges */}
      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-[#64748B]">
        <div className="flex items-center gap-1.5">
          <Zap className="w-4 h-4 text-amber-500" />
          <span>Proses Instan</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Shield className="w-4 h-4 text-emerald-600" />
          <span>Otomatis Dihapus (60 Menit)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-blue-600" />
          <span>Tanpa Akun Pengguna</span>
        </div>
      </div>
    </section>
  )
}
