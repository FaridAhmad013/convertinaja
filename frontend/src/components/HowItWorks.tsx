import { UploadCloud, RefreshCw, Download } from 'lucide-react'

export function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: '1. Unggah Dokumen',
      description: 'Pilih atau seret berkas Anda ke area upload. Sistem otomatis mendeteksi format dan memvalidasi ukuran file.',
      icon: UploadCloud,
    },
    {
      num: '02',
      title: '2. Pilih & Konversi',
      description: 'Sistem menampilkan pilihan tool yang kompatibel secara inline. Sesuaikan opsi lalu klik konversi instan.',
      icon: RefreshCw,
    },
    {
      num: '03',
      title: '3. Unduh Hasil',
      description: 'Unduh file secara langsung atau paket ZIP untuk banyak file. Berkas aman dan terhapus otomatis setelah 60 menit.',
      icon: Download,
    },
  ]

  return (
    <section className="bg-slate-50 border-y border-[#E2E8F0] py-12 sm:py-16">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight mb-2">
            Cara Kerja Sederhana 3 Langkah
          </h2>
          <p className="text-sm sm:text-base text-[#64748B]">
            Tidak ada pendaftaran, formulir rumit, atau unduhan software tambahan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {steps.map((step) => {
            const Icon = step.icon
            return (
              <div
                key={step.num}
                className="bg-white border border-[#E2E8F0] rounded-xl p-6 relative shadow-xs"
              >
                <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="absolute top-5 right-5 text-2xl font-black text-slate-200">
                  {step.num}
                </span>
                <h3 className="text-lg font-bold text-[#0F172A] mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-[#64748B] leading-relaxed">
                  {step.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
