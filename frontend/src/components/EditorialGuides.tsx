import { useState } from 'react'
import { BookOpen, HelpCircle, ShieldAlert, ChevronDown, ChevronUp, Image, FileCode2, Minimize2, Copy } from 'lucide-react'
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
          a: 'Sama sekali tidak. ConvertinAja menerapkan prinsip Zero-Storage & Ephemeral Computing. Berkas sumber yang Anda unggah langsung dimusnahkan secara permanen seketika setelah proses konversi selesai. Tidak ada salinan yang disimpan di database, diarsipkan ke cloud, maupun dibagikan ke pihak ketiga.',
        },
        {
          q: 'Bagaimana cara kerja pemilihan kualitas konversi (DPI)?',
          a: 'Secara default, ConvertinAja menggunakan resolusi HD (300 DPI) dan kompresi JPEG 95% agar teks dan gambar hasil konversi tajam setara kualitas cetak fisik. Anda juga dapat memilih opsi Standar (150 DPI) untuk ukuran berkas yang lebih hemat atau Ultra HD (600 DPI) untuk keperluan arsip mikroskopis.',
        },
        {
          q: 'Apakah saya perlu mendaftar akun atau memasukkan kartu kredit?',
          a: 'Tidak perlu. Seluruh fitur ConvertinAja 100% gratis tanpa paywall, tanpa pendaftaran akun, dan tanpa batasan langganan berbayar. Kami beroperasi secara terbuka untuk memudahkan masyarakat umum.',
        },
        {
          q: 'Berapa batasan ukuran berkas yang dapat dikonversi?',
          a: 'Ukuran maksimum per berkas adalah 50 MB untuk dokumen PDF dan gambar, serta mendukung hingga 10 berkas sekaligus dalam satu operasi penggabungan (merge).',
        },
        {
          q: 'Bagaimana cara menghapus berkas saya sebelum batas waktu habis?',
          a: 'Setelah konversi berhasil, tombol "Hapus Hasil dari Server Sekarang" tersedia di layar unduhan. Menekan tombol tersebut akan memicu pemusnahan total direktori pekerjaan Anda di server dalam hitungan milidetik.',
        },
        {
          q: 'Apakah ConvertinAja menggunakan berkas saya untuk melatih model AI?',
          a: 'Tidak pernah. Kami tidak memiliki analitik pengindeksan konten dokumen. Berkas Anda diproses secara terisolasi di dalam container sandbox native tanpa campur tangan manusia maupun AI crawler.',
        },
      ]
    : [
        {
          q: 'Are my uploaded documents stored on the ConvertinAja server?',
          a: 'Absolutely not. ConvertinAja operates on Zero-Storage & Ephemeral Computing. Your raw source files are permanently destroyed the exact millisecond conversion finishes. Nothing is stored in databases, cloud buckets, or shared with third parties.',
        },
        {
          q: 'How does the resolution quality option (DPI) work?',
          a: 'By default, ConvertinAja renders at print-grade HD (300 DPI) with 95% JPEG quality for razor-sharp typography. You can also select Standard (150 DPI) for smaller web-friendly file sizes, or Ultra HD (600 DPI) for microscopic archive details.',
        },
        {
          q: 'Do I need to create an account or provide payment details?',
          a: 'No. Every feature on ConvertinAja is 100% free with no paywall, no signup forms, and no hidden subscriptions. It is built as a transparent, open-source file utility.',
        },
        {
          q: 'What is the maximum file size limit?',
          a: 'The upload ceiling is 50 MB per document/image, with support for batch operations of up to 10 files simultaneously for operations like merging.',
        },
        {
          q: 'Can I delete my converted files immediately?',
          a: 'Yes. On the download screen, a "Delete from Server Now" button is provided. Clicking it triggers an immediate hard purge of your job folder on the backend server.',
        },
        {
          q: 'Are my files used to train artificial intelligence (AI) models?',
          a: 'Never. We have zero document scraping or inspection tools. Your documents are processed in an ephemeral Linux sandbox without human or AI access.',
        },
      ]

  return (
    <section className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-[#E2E8F0]">
      {/* 1. In-Depth Guides (AdSense Quality Defense) */}
      <div className="mb-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#2563EB] text-xs font-semibold uppercase tracking-wider mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{isId ? 'Panduan Penggunaan' : 'User Guides & Tutorials'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight mb-2">
            {isId ? 'Cara Mengonversi Dokumen dengan Hasil Maksimal' : 'How to Convert Your Documents with Peak Quality'}
          </h2>
          <p className="text-sm text-[#64748B]">
            {isId
              ? 'Pelajari teknik konversi terbaik untuk menjaga ketajaman resolusi dan integritas format dokumen Anda.'
              : 'Learn the best conversion techniques to retain maximum resolution and document integrity.'}
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
                ? 'Unggah beberapa berkas PDF sekaligus (hingga 10 file) dan satukan menjadi satu dokumen berurutan dalam sekejap. Mesin `pdfunite` memastikan penomoran dan orientasi halaman tetap utuh sempurna.'
                : 'Upload up to 10 PDF files simultaneously and merge them into a single coherent document. The underlying native `pdfunite` binary preserves page dimensions and rotation flawlessly.'}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Technical Zero-Storage Architecture Explanation */}
      <div className="mb-16 p-8 rounded-2xl bg-gradient-to-br from-slate-900 to-[#0F172A] text-white">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-3">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>{isId ? 'Jaminan Teknis Privasi' : 'Technical Privacy Guarantee'}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold mb-3 tracking-tight">
            {isId
              ? 'Bagaimana Sistem Kami Memastikan Berkas Anda Tidak Bocor?'
              : 'How Our Architecture Guarantees Zero Data Retention'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
            {isId
              ? 'ConvertinAja tidak menggunakan penyimpanan cloud jangka panjang (S3/GCS) untuk berkas pengguna. Seluruh pemrosesan berjalan di direktori terisolasi `/tmp/convertinaja/jobs/{uuid}`. Segera setelah konversi selesai, berkas sumber dimusnahkan seketika. Berkas hasil konversi dapat Anda musnahkan secara mandiri atau dibersihkan otomatis oleh sistem pembersih otomatis berulang.'
              : 'ConvertinAja does not use persistent cloud storage for user documents. All operations occur in an isolated Linux tmpfs volume `/tmp/convertinaja/jobs/{uuid}`. Uploaded source files are shredded immediately once processing completes. Output artifacts can be purged on demand or automatically by our background retention daemon.'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10 text-xs">
            <div>
              <span className="font-bold text-white block mb-0.5">0% Persistent Storage</span>
              <p className="text-slate-400">Berkas tidak pernah ditulis ke database.</p>
            </div>
            <div>
              <span className="font-bold text-white block mb-0.5">100% Ephemeral Linux Sandbox</span>
              <p className="text-slate-400">Proses terisolasi tanpa akses root.</p>
            </div>
            <div>
              <span className="font-bold text-white block mb-0.5">Instant Source Purge</span>
              <p className="text-slate-400">Berkas sumber langsung dihapus detik itu juga.</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. In-Depth FAQ Accordion (Search Intent & AdSense Requirement) */}
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
              ? 'Jawaban transparan seputar privasi, kompatibilitas, dan arsitektur ConvertinAja.'
              : 'Transparent answers regarding privacy, format support, and system architecture.'}
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
