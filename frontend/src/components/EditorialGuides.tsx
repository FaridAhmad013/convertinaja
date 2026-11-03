import { useState } from 'react'
import { BookOpen, HelpCircle, ShieldCheck, ChevronDown, ChevronUp, Image, FileCode2, Minimize2, Copy } from 'lucide-react'
import { useI18n } from '../i18n'

export function EditorialGuides() {
  const { lang } = useI18n()
  const isId = lang === 'id'

  const [openFaq, setOpenFaq] = useState<number | null>(0)

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  const faqs = isId
    ? [
        {
          q: 'Apakah dokumen yang saya unggah disimpan di server ConvertinAja?',
          a: 'Sama sekali tidak. Berkas mentah yang Anda unggah langsung dimusnahkan seketika setelah proses konversi selesai. Berkas hasil konversi hanya disimpan di direktori memori sementara dan otomatis terhapus total dalam 10 menit. Tidak ada database persisten berkas.',
        },
        {
          q: 'Berapa batasan ukuran dan jumlah berkas yang dapat dikonversi?',
          a: 'Ukuran maksimum per berkas adalah 10 MB, dengan dukungan hingga 10 berkas sekaligus dalam satu kali proses (misalnya untuk penggabungan dokumen PDF). Batasan 10 MB ini dirancang agar server tetap ringan, cepat, dan responsif.',
        },
        {
          q: 'Bagaimana cara kerja pemilihan kualitas konversi (DPI)?',
          a: 'Secara default, ConvertinAja menggunakan resolusi HD (300 DPI) dan profil kompresi JPEG 95% agar teks dan gambar hasil konversi tajam setara kualitas cetak fisik. Anda juga dapat memilih opsi Standar (150 DPI) untuk ukuran berkas lebih hemat atau Ultra HD (600 DPI) untuk kebutuhan arsip detail tinggi.',
        },
        {
          q: 'Apakah saya perlu mendaftar akun atau membayar langganan?',
          a: 'Tidak perlu. Seluruh fitur ConvertinAja 100% gratis tanpa paywall, tanpa formulir pendaftaran akun, dan tanpa langganan tersembunyi.',
        },
        {
          q: 'Berapa lama berkas hasil konversi tersedia untuk diunduh?',
          a: 'Berkas hasil konversi tersedia selama maksimal 10 menit. Setelah 10 menit, sistem pembersih otomatis (retention worker) akan menghapus seluruh direktori pekerjaan tanpa sisa.',
        },
        {
          q: 'Apakah berkas saya aman dari penggunaan pelatihan model AI?',
          a: 'Sangat aman. Sistem kami tidak menjalankan modul analitik scraping teks untuk AI. Dokumen Anda diproses secara terisolasi di dalam container native Linux.',
        },
      ]
    : [
        {
          q: 'Are my uploaded documents stored on the server?',
          a: 'No. Uploaded raw source files are immediately destroyed once conversion completes. Output files reside only in temporary memory and are completely wiped after 10 minutes. There is zero persistent file database.',
        },
        {
          q: 'What is the maximum file size and batch limit?',
          a: 'The ceiling is 10 MB per file, with up to 10 files in a single batch (e.g. for PDF merging). The 10 MB limit ensures high-speed conversion and server lightweight performance.',
        },
        {
          q: 'How does the resolution quality option (DPI) work?',
          a: 'By default, ConvertinAja renders at print-grade HD (300 DPI) with 95% JPEG quality. You can also select Standard (150 DPI) for smaller web-friendly file sizes, or Ultra HD (600 DPI) for archival work.',
        },
        {
          q: 'Do I need an account or subscription?',
          a: 'No. Every feature on ConvertinAja is 100% free with no paywall, no signup forms, and no hidden subscriptions.',
        },
        {
          q: 'How long are converted files available for download?',
          a: 'Output files are available for up to 10 minutes. After 10 minutes, our automated retention worker purges the job workspace directory permanently.',
        },
        {
          q: 'Are files protected against AI scraping and training?',
          a: 'Completely protected. We run zero document inspection or scraping engines. Everything is processed inside an isolated native container sandbox.',
        },
      ]

  return (
    <section className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-[#E2E8F0]">
      {/* 1. In-Depth Guides (AdSense Quality Defense) */}
      <div className="mb-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFF6FF] text-[#2563EB] text-xs font-semibold uppercase tracking-wider mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{isId ? 'Panduan Penggunaan' : 'User Guides & Tutorials'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight mb-2">
            {isId ? 'Cara Mengonversi Dokumen dengan Hasil Maksimal' : 'How to Convert Your Documents with Peak Quality'}
          </h2>
          <p className="text-sm text-[#64748B]">
            {isId
              ? 'Pelajari teknik konversi terbaik untuk menjaga ketajaman resolusi dan integritas dokumen (Maks. 10 MB & 10 Berkas).'
              : 'Learn the best conversion techniques to retain maximum resolution (Max 10 MB & 10 Files).'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Guide Card 1: PDF to Image */}
          <div className="p-6 rounded-2xl border border-[#E2E8F0] bg-white shadow-2xs hover:border-[#93C5FD] transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-[#DC2626] flex items-center justify-center">
              <Image className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-[#0F172A]">
              {isId ? 'Konversi PDF ke JPG / PNG Resolusi Tinggi (300 DPI)' : 'Convert PDF to High-Resolution JPG / PNG (300 DPI)'}
            </h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              {isId
                ? 'Sebagian besar converter online hanya menghasilkan gambar buram pada resolusi 72-150 DPI. Di ConvertinAja, mesin Poppler kami otomatis merasterisasi teks pada 300 DPI dengan profil JPEG Quality 95%. Hasilnya dapat dicetak ke kertas format besar tanpa pecah atau pixelated.'
                : 'Most online converters produce blurry images at 72-150 DPI. On ConvertinAja, our native Poppler engine defaults to 300 DPI with 95% JPEG quality, ensuring vector-grade sharpness suitable for physical printing.'}
            </p>
          </div>

          {/* Guide Card 2: PDF to Markdown */}
          <div className="p-6 rounded-2xl border border-[#E2E8F0] bg-white shadow-2xs hover:border-[#93C5FD] transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center">
              <FileCode2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-[#0F172A]">
              {isId ? 'Ekstraksi PDF ke Markdown (.md) untuk Catatan & LLM' : 'Extract PDF to Clean Markdown (.md) for LLMs & Notes'}
            </h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              {isId
                ? 'Format Markdown sangat ideal untuk dokumentasi teknis, catatan Obsidian / Notion, serta input prompt AI (LLM). Fitur PDF to Markdown mempertahankan alur paragraf dan tata letak teks bersih tanpa tagging HTML yang membingungkan.'
                : 'Markdown format is ideal for technical documentation, Obsidian/Notion notes, and LLM prompts. Our PDF to Markdown preserves paragraph flow while removing noisy styling markup.'}
            </p>
          </div>

          {/* Guide Card 3: PDF Compression */}
          <div className="p-6 rounded-2xl border border-[#E2E8F0] bg-white shadow-2xs hover:border-[#93C5FD] transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Minimize2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-[#0F172A]">
              {isId ? 'Kompresi PDF Menggunakan Engine Ghostscript Teruji' : 'Intelligent PDF Compression via Ghostscript Engine'}
            </h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              {isId
                ? 'Gunakan opsi "Rekomendasi" untuk mengecilkan dokumen PDF hingga 60-80% tanpa membuat tulisan menjadi kabur. Sangat berguna untuk pengiriman formulir kerja, beasiswa, atau unggahan berkas portal instansi pemerintah.'
                : 'Select our "Recommended" level to cut PDF sizes by 60-80% without degrading readable text. Perfect for government portal uploads, job applications, and scholarship submissions.'}
            </p>
          </div>

          {/* Guide Card 4: Merge PDF */}
          <div className="p-6 rounded-2xl border border-[#E2E8F0] bg-white shadow-2xs hover:border-[#93C5FD] transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Copy className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-[#0F172A]">
              {isId ? 'Menggabungkan Dokumen Terpisah Menjadi Satu PDF' : 'Combine Multiple Separate Documents into One PDF'}
            </h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              {isId
                ? 'Unggah beberapa berkas PDF sekaligus (hingga 10 file, masing-masing maks. 10 MB) dan satukan menjadi satu dokumen berurutan dalam sekejap. Mesin `pdfunite` memastikan penomoran dan rotasi halaman tetap utuh sempurna.'
                : 'Upload up to 10 PDF files simultaneously (each up to 10 MB) and merge them into a single coherent document. The underlying native `pdfunite` binary preserves page dimensions flawlessly.'}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Neutral Light Architecture Card (Replaces dark slate-900 block) */}
      <div className="mb-16 p-6 sm:p-8 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A]">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFF6FF] text-[#2563EB] text-xs font-semibold mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{isId ? 'Jaminan Arsitektur Sistem' : 'System Architecture Guarantee'}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold mb-3 tracking-tight text-[#0F172A]">
            {isId
              ? 'Arsitektur Efemeral: Perlindungan Data Tanpa Kompromi'
              : 'Ephemeral Architecture: Uncompromised Data Protection'}
          </h3>
          <p className="text-xs sm:text-sm text-[#475569] leading-relaxed mb-6">
            {isId
              ? 'ConvertinAja tidak menggunakan penyimpanan berkas jangka panjang. Seluruh pemrosesan berjalan di direktori terisolasi sementara `/tmp/convertinaja/jobs/{uuid}`. Berkas mentah yang Anda unggah langsung dimusnahkan seketika setelah diproses. Hasil konversi otomatis dibersihkan total dalam 10 menit oleh daemon pembersih berkala.'
              : 'ConvertinAja does not use persistent file storage. Operations occur inside an isolated temporary directory `/tmp/convertinaja/jobs/{uuid}`. Your raw uploaded files are destroyed immediately after conversion. Converted output files are automatically purged after 10 minutes.'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#E2E8F0]">
            <div className="p-3.5 rounded-xl bg-white border border-[#E2E8F0]">
              <span className="font-bold text-xs text-[#0F172A] block mb-0.5">Maks. 10 MB / File</span>
              <p className="text-xs text-[#64748B]">Batas ukuran optimal untuk kecepatan prima.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-[#E2E8F0]">
              <span className="font-bold text-xs text-[#0F172A] block mb-0.5">Pemusnahan Seketika</span>
              <p className="text-xs text-[#64748B]">Berkas sumber langsung dihapus saat selesai.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-[#E2E8F0]">
              <span className="font-bold text-xs text-[#0F172A] block mb-0.5">Auto-Purge 10 Menit</span>
              <p className="text-xs text-[#64748B]">Hasil konversi hilang otomatis tanpa jejak.</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. In-Depth FAQ Accordion */}
      <div>
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-[#0F172A] text-xs font-semibold uppercase tracking-wider mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>FAQ</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight mb-2">
            {isId ? 'Pertanyaan yang Sering Diajukan' : 'Frequently Asked Questions'}
          </h2>
          <p className="text-sm text-[#64748B]">
            {isId
              ? 'Jawaban transparan seputar privasi, kompatibilitas, dan spesifikasi ConvertinAja.'
              : 'Transparent answers regarding privacy, format support, and system specifications.'}
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx
            return (
              <div
                key={idx}
                className="rounded-xl border border-[#E2E8F0] bg-white overflow-hidden transition-all shadow-2xs"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 sm:p-5 text-left font-semibold text-sm sm:text-base text-[#0F172A] flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/50"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#2563EB] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#64748B] shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-[#64748B] leading-relaxed border-t border-[#E2E8F0]/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
