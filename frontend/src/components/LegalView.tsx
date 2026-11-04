import { useState, useEffect } from 'react'
import {
  ShieldCheck,
  FileText,
  Info,
  Mail,
  ArrowLeft,
  CheckCircle2,
  Lock,
  ServerOff,
  Code2,
  ExternalLink,
  Clock,
  Trash2,
} from 'lucide-react'
import { useI18n } from '../i18n'

export type LegalPageSlug = 'privacy' | 'terms' | 'about' | 'contact'

interface LegalViewProps {
  initialSlug: LegalPageSlug
  onBack: () => void
}

export function LegalView({ initialSlug, onBack }: LegalViewProps) {
  const { lang } = useI18n()
  const isId = lang === 'id'
  const [activeSlug, setActiveSlug] = useState<LegalPageSlug>(initialSlug)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [activeSlug])

  const navItems = [
    { slug: 'privacy' as LegalPageSlug, label: isId ? 'Kebijakan Privasi' : 'Privacy Policy', icon: ShieldCheck },
    { slug: 'terms' as LegalPageSlug, label: isId ? 'Syarat & Ketentuan' : 'Terms of Service', icon: FileText },
    { slug: 'about' as LegalPageSlug, label: isId ? 'Tentang & Lisensi' : 'About & Licenses', icon: Info },
    { slug: 'contact' as LegalPageSlug, label: isId ? 'Hubungi Kami' : 'Contact', icon: Mail },
  ]

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] py-8 sm:py-12">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E2E8F0]">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[#CBD5E1] bg-white hover:bg-slate-50 text-xs sm:text-sm font-semibold text-[#0F172A] transition-colors cursor-pointer shadow-2xs w-fit"
          >
            <ArrowLeft className="w-4 h-4 text-[#2563EB]" />
            <span>{isId ? 'Kembali ke Beranda' : 'Back to Home'}</span>
          </button>

          {/* Quick Tab Selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activeSlug === item.slug
              return (
                <button
                  key={item.slug}
                  type="button"
                  onClick={() => setActiveSlug(item.slug)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-[#2563EB] text-white shadow-2xs'
                      : 'text-[#64748B] hover:text-[#0F172A] hover:bg-slate-200/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs p-6 sm:p-10 space-y-8 text-sm sm:text-base leading-relaxed">
          {/* ==================================================== */}
          {/* 1. PRIVACY POLICY */}
          {/* ==================================================== */}
          {activeSlug === 'privacy' && (
            <article className="space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB] bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200/60">
                  {isId ? 'Kebijakan Privasi Resmi' : 'Official Privacy Policy'}
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F172A]">
                  {isId ? 'Kebijakan Privasi (Zero Data Retention)' : 'Privacy Policy (Zero Data Retention)'}
                </h1>
                <p className="text-xs sm:text-sm text-[#64748B]">
                  {isId ? 'Terakhir diperbarui: Maret 2026 • Kebijakan Tanpa Kompromi' : 'Last updated: March 2026 • Strict Zero-Storage'}
                </p>
              </div>

              {/* Box Pernyataan Utama */}
              <div className="p-5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-emerald-950 space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-emerald-900">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>
                    {isId
                      ? 'Pernyataan Resmi: Kami Tidak Menyimpan Maupun Membaca Dokumen Anda'
                      : 'Official Statement: We Do Not Store Or Read Your Documents'}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-emerald-900/90 leading-relaxed">
                  {isId
                    ? 'ConvertinAja dibangun atas prinsip dasar Nol-Penyimpanan (Zero-Storage). Berkas Anda bukan komoditas kami. Kami tidak pernah mengarsipkan, tidak menjual, tidak memprofiling, dan tidak pernah menggunakan dokumen Anda untuk pelatihan model kecerdasan buatan (AI).'
                    : 'ConvertinAja is built on Zero-Storage principles. Your files are not our product. We never archive, sell, profile, or use your documents to train artificial intelligence models.'}
                </p>
              </div>

              {/* Poin-Poin Kebijakan */}
              <div className="space-y-6 pt-2 text-[#334155]">
                <section className="space-y-2">
                  <h2 className="text-base sm:text-lg font-bold text-[#0F172A] flex items-center gap-2">
                    <Trash2 className="w-5 h-5 text-[#2563EB]" />
                    <span>{isId ? '1. Pemusnahan Berkas Seketika di Sisi Server' : '1. Instant Source File Destruction on Server'}</span>
                  </h2>
                  <p className="text-xs sm:text-sm leading-relaxed">
                    {isId
                      ? 'Begitu proses konversi selesai (baik berstatus berhasil maupun gagal), berkas mentah asli yang Anda unggah langsung dimusnahkan secara permanen dari server tanpa jejak. Berkas hasil konversi hanya berada di memori efemeral sementara untuk diunduh oleh Anda dan akan langsung dibersihkan otomatis begitu proses selesai.'
                      : 'As soon as conversion finishes (success or failure), raw uploaded source files are immediately and permanently shredded from the server. Converted outputs reside purely in ephemeral memory for your download and are cleared immediately once retrieved.'}
                  </p>
                </section>

                <section className="space-y-2">
                  <h2 className="text-base sm:text-lg font-bold text-[#0F172A] flex items-center gap-2">
                    <Lock className="w-5 h-5 text-[#2563EB]" />
                    <span>{isId ? '2. Tanpa Akun, Tanpa Profiling & Tanpa Database Pengguna' : '2. No Accounts, No Profiling & No User Database'}</span>
                  </h2>
                  <p className="text-xs sm:text-sm leading-relaxed">
                    {isId
                      ? 'Layanan ConvertinAja tidak memiliki registrasi akun, formulir pendaftaran, maupun basis data pengguna. Setiap sesi bersifat anonim. Tautan unduhan dilindungi oleh token acak berumur pendek (UUID v4) yang hanya diketahui oleh peramban Anda.'
                      : 'ConvertinAja does not feature user registrations, logins, or user databases. Every session is anonymous. Download links are gated via cryptographically random UUID v4 tokens known exclusively to your browser session.'}
                  </p>
                </section>

                <section className="space-y-2">
                  <h2 className="text-base sm:text-lg font-bold text-[#0F172A] flex items-center gap-2">
                    <Clock className="w-5 h-5 text-[#2563EB]" />
                    <span>{isId ? '3. Batas Waktu Proses Maksimal 5 Menit' : '3. 5-Minute Maximum Execution Hard Limit'}</span>
                  </h2>
                  <p className="text-xs sm:text-sm leading-relaxed">
                    {isId
                      ? 'Untuk mencegah beban berlebih dan menjaga kestabilan sumber daya server, setiap proses konversi dibatasi waktu maksimal 5 menit (300 detik). Proses yang melampaui batas ini akan otomatis dihentikan paksa oleh sistem dan seluruh berkas terkait langsung dihapus.'
                      : 'To prevent resource starvation and maintain VPS server stability, all conversion jobs are bound to a strict 5-minute (300s) hard limit. Any process exceeding this duration is forcefully terminated and associated files are shredded.'}
                  </p>
                </section>

                <section className="space-y-2">
                  <h2 className="text-base sm:text-lg font-bold text-[#0F172A] flex items-center gap-2">
                    <ServerOff className="w-5 h-5 text-[#2563EB]" />
                    <span>{isId ? '4. Pembersihan Darurat Terjadwal (Fail-safe Sweep)' : '4. Automated Fail-safe Sweeps'}</span>
                  </h2>
                  <p className="text-xs sm:text-sm leading-relaxed">
                    {isId
                      ? 'Sistem pembersih otomatis berjalan setiap saat di latar belakang semata-mata sebagai jaring pengaman (fail-safe) untuk skenario tak terduga (seperti koneksi internet pengguna terputus di tengah proses) agar direktori kerja sementara selalu bersih dari berkas tertinggal.'
                      : 'Automated background sweeps operate continuously purely as a safety net for edge-case failures (such as client network drops mid-conversion) ensuring no orphan files linger on disk.'}
                  </p>
                </section>
              </div>
            </article>
          )}

          {/* ==================================================== */}
          {/* 2. TERMS OF SERVICE */}
          {/* ==================================================== */}
          {activeSlug === 'terms' && (
            <article className="space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB] bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200/60">
                  {isId ? 'Ketentuan Layanan Resmi' : 'Terms of Service'}
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F172A]">
                  {isId ? 'Syarat & Ketentuan Penggunaan' : 'Terms of Service'}
                </h1>
                <p className="text-xs sm:text-sm text-[#64748B]">
                  {isId ? 'Berlaku untuk seluruh pengunjung dan pengguna platform ConvertinAja' : 'Applicable to all visitors and users of ConvertinAja'}
                </p>
              </div>

              <div className="space-y-6 pt-2 text-[#334155] text-xs sm:text-sm leading-relaxed">
                <section className="space-y-2">
                  <h2 className="text-base sm:text-lg font-bold text-[#0F172A]">
                    {isId ? '1. Kepemilikan Dokumen & Hak Cipta' : '1. Document Ownership & Intellectual Property'}
                  </h2>
                  <p>
                    {isId
                      ? 'Hak cipta, kepemilikan intelektual, dan isi dari seluruh berkas yang Anda unggah sepenuhnya tetap berada di tangan Anda. ConvertinAja tidak memiliki hak kepemilikan, lisensi sekunder, maupun klaim apa pun atas dokumen Anda.'
                      : 'You retain 100% intellectual property rights, copyright, and ownership over any files you process. ConvertinAja asserts zero ownership, secondary licensing, or proprietary claims over your documents.'}
                  </p>
                </section>

                <section className="space-y-2">
                  <h2 className="text-base sm:text-lg font-bold text-[#0F172A]">
                    {isId ? '2. Kebijakan Batasan Penggunaan Wajar (Fair Use)' : '2. Fair Use & Capacity Boundaries'}
                  </h2>
                  <ul className="list-disc pl-5 space-y-1.5">
                    <li>
                      <strong>{isId ? 'Batas Ukuran:' : 'Size Cap:'}</strong> {isId ? 'Maksimal 10 MB per berkas.' : 'Maximum 10 MB per individual file.'}
                    </li>
                    <li>
                      <strong>{isId ? 'Batas Batch:' : 'Batch Limit:'}</strong> {isId ? 'Maksimal 10 berkas dalam satu proses unggah.' : 'Maximum 10 files per conversion batch.'}
                    </li>
                    <li>
                      <strong>{isId ? 'Batas Waktu Komputasi:' : 'Computation Ceiling:'}</strong> {isId ? 'Proses konversi yang membutuhkan waktu lebih dari 5 menit akan otomatis dihentikan untuk menjaga kestabilan server.' : 'Any task requiring longer than 5 minutes will be forcefully terminated to preserve server capacity.'}
                    </li>
                    <li>
                      <strong>{isId ? 'Larangan Konten:' : 'Prohibited Content:'}</strong> {isId ? 'Dilarang mengunggah malware, executable berbahaya, arsip beracun (zip-bomb), atau berkas yang melanggar hukum.' : 'You must not upload malware, malicious binaries, decompression bombs, or unlawful material.'}
                    </li>
                  </ul>
                </section>

                <section className="space-y-2">
                  <h2 className="text-base sm:text-lg font-bold text-[#0F172A]">
                    {isId ? '3. Ketiadaan Garansi & Batasan Tanggung Jawab (As-Is)' : '3. Disclaimer of Warranties & Limitation of Liability'}
                  </h2>
                  <p>
                    {isId
                      ? 'Platform ini disediakan secara gratis atas dasar "sebagaimana adanya" (as-is) tanpa jaminan ketersediaan tanpa henti atau kecocokan untuk tujuan tertentu. Pengembang tidak bertanggung jawab atas kehilangan data, kerusakan sistem, atau kerugian tidak langsung yang timbul akibat penggunaan layanan ini.'
                      : 'This platform is delivered free of charge on an "as-is" basis without warranties of uninterrupted uptime or fitness for a particular purpose. Developers are not liable for direct, indirect, or consequential damages resulting from platform use.'}
                  </p>
                </section>
              </div>
            </article>
          )}

          {/* ==================================================== */}
          {/* 3. ABOUT & LICENSES */}
          {/* ==================================================== */}
          {activeSlug === 'about' && (
            <article className="space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB] bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200/60">
                  {isId ? 'Transparansi Penuh' : 'Full Transparency'}
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F172A]">
                  {isId ? 'Tentang Platform & Atribusi Lisensi Open-Source' : 'About Platform & Open-Source Licenses'}
                </h1>
                <p className="text-xs sm:text-sm text-[#64748B]">
                  {isId ? 'Pernyataan keterbukaan dan kepatuhan lisensi perangkat lunak sumber terbuka (FOSS)' : 'Commitment to open-source software (FOSS) attribution and integrity'}
                </p>
              </div>

              <div className="space-y-4 pt-1 text-[#334155] text-xs sm:text-sm leading-relaxed">
                <p>
                  {isId
                    ? 'ConvertinAja adalah platform antarmuka web (web wrapper interface) gratis dan open-source yang dirancang untuk mempermudah alur konversi dokumen harian tanpa iklan mengganggu, tanpa paywall, dan dengan penghormatan tertinggi terhadap privasi pengguna.'
                    : 'ConvertinAja is an open-source web wrapper interface designed to simplify daily document conversions without invasive paywalls, forced signups, or data tracking.'}
                </p>

                {/* Developer Credit Box */}
                <div className="p-4 rounded-xl bg-slate-50 border border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs text-[#64748B] block font-medium">{isId ? 'Inisiator & Pengembang' : 'Author & Developer'}</span>
                    <strong className="text-base text-[#0F172A]">Farid Ahmad</strong>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href="https://faridahmad.dev"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#BFDBFE] bg-[#EFF6FF] hover:bg-blue-100 text-xs font-semibold text-[#2563EB] transition-colors"
                    >
                      <span>Portofolio</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <a
                      href="https://www.linkedin.com/in/faridahmad013"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#CBD5E1] bg-white hover:bg-slate-50 text-xs font-semibold text-[#0A66C2] transition-colors"
                    >
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.6 1.6 0 0 0-1.6 1.6 1.6 1.6 0 0 0 1.6 1.6 1.6 1.6 0 0 0 1.6-1.6 1.6 1.6 0 0 0-1.6-1.6Z" />
                      </svg>
                      <span>LinkedIn</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* Legal & Open Source Engines Attribution */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-2 font-bold text-sm text-[#0F172A]">
                    <Code2 className="w-5 h-5 text-[#2563EB]" />
                    <span>{isId ? 'Atribusi Mesin & Lisensi Pihak Ketiga' : 'Engine Attributions & Open-Source Licenses'}</span>
                  </div>
                  <p className="text-xs text-[#64748B]">
                    {isId
                      ? 'ConvertinAja tidak mengklaim kepemilikan atas perangkat lunak mesin konversi asli. Seluruh biner dijalankan sebagai proses CLI terpisah (subprocess) tanpa modifikasi kode:'
                      : 'ConvertinAja asserts zero proprietary authorship over the underlying conversion engines. All engines are invoked as unmodified discrete CLI subprocesses:'}
                  </p>

                  <div className="grid grid-cols-1 gap-3">
                    <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#0F172A] text-xs sm:text-sm">Poppler Utilities (`pdftoppm`, `pdfunite`, `pdftotext`, `pdfimages`)</span>
                        <span className="text-[11px] px-2 py-0.5 rounded bg-blue-100 text-[#1D4ED8] font-bold">GPLv2 / GPLv3</span>
                      </div>
                      <p className="text-xs text-[#64748B]">
                        {isId
                          ? 'Dikembangkan oleh freedesktop.org & kontributor Xpdf. Digunakan untuk perenderan PDF resolusi tinggi (300 DPI HD), penggabungan dokumen, ekstraksi halaman, dan konversi teks.'
                          : 'Developed by freedesktop.org & Xpdf contributors. Used for high-definition 300 DPI PDF rendering, merging, extraction, and text conversion.'}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#0F172A] text-xs sm:text-sm">Ghostscript (`gs`)</span>
                        <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">AGPLv3</span>
                      </div>
                      <p className="text-xs text-[#64748B]">
                        {isId
                          ? 'Hak Cipta Artifex Software, Inc. Digunakan sebagai mesin biner baris perintah mandiri untuk kompresi ukuran PDF tanpa tautan pustaka dinamis/statis.'
                          : 'Copyright Artifex Software, Inc. Invoked strictly as an external command-line binary for PDF compression without static or dynamic code linkage.'}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#0F172A] text-xs sm:text-sm">LibreOffice Headless (`soffice`)</span>
                        <span className="text-[11px] px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold">MPL-2.0 / LGPLv3+</span>
                      </div>
                      <p className="text-xs text-[#64748B]">
                        {isId
                          ? 'Hak Cipta The Document Foundation. Dijalankan dalam mode headless terisolasi untuk konversi dokumen Office (DOCX, PPTX, XLSX, ODT, TXT) ke PDF.'
                          : 'Copyright The Document Foundation. Invoked in isolated headless CLI mode for Office document (DOCX, PPTX, XLSX, ODT, TXT) to PDF conversions.'}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#0F172A] text-xs sm:text-sm">Google WebP Tools (`cwebp`, `dwebp`)</span>
                        <span className="text-[11px] px-2 py-0.5 rounded bg-sky-100 text-sky-900 font-bold">BSD 3-Clause</span>
                      </div>
                      <p className="text-xs text-[#64748B]">
                        {isId
                          ? 'Hak Cipta Google LLC. Digunakan untuk encoding dan decoding gambar WebP modern dengan efisiensi kompresi tinggi.'
                          : 'Copyright Google LLC. Used for state-of-the-art WebP image encoding and decoding.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          )}

          {/* ==================================================== */}
          {/* 4. CONTACT */}
          {/* ==================================================== */}
          {activeSlug === 'contact' && (
            <article className="space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB] bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200/60">
                  {isId ? 'Kontak & Bantuan' : 'Contact Us'}
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F172A]">
                  {isId ? 'Hubungi Pengembang' : 'Contact Developer'}
                </h1>
                <p className="text-xs sm:text-sm text-[#64748B]">
                  {isId ? 'Saluran komunikasi untuk pelaporan bug, usulan fitur, atau pertanyaan lisensi' : 'Communication channels for bug reports, feature requests, or inquiries'}
                </p>
              </div>

              <div className="space-y-4 pt-1 text-[#334155] text-xs sm:text-sm leading-relaxed">
                <p>
                  {isId
                    ? 'ConvertinAja dikelola secara aktif sebagai proyek open-source. Jika Anda mendapati kendala teknis atau ingin berkontribusi, silakan gunakan saluran berikut:'
                    : 'ConvertinAja is actively maintained as an open-source project. For technical inquiries, bug disclosures, or feature suggestions, reach out through:'}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-slate-50 border border-[#E2E8F0] space-y-1">
                    <span className="text-xs text-[#64748B] font-medium block">{isId ? 'Email Pengembang' : 'Developer Email'}</span>
                    <a
                      href="mailto:contact@faridahmad.dev"
                      className="font-bold text-[#2563EB] hover:underline text-sm break-all"
                    >
                      contact@faridahmad.dev
                    </a>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-[#E2E8F0] space-y-1">
                    <span className="text-xs text-[#64748B] font-medium block">{isId ? 'Repositori GitHub' : 'GitHub Repository'}</span>
                    <a
                      href="https://github.com/faridahmad013/convertinaja"
                      target="_blank"
                      rel="noreferrer"
                      className="font-bold text-[#0F172A] hover:text-[#2563EB] transition-colors text-sm inline-flex items-center gap-1.5"
                    >
                      <span>faridahmad013/convertinaja</span>
                      <ExternalLink className="w-3.5 h-3.5 text-[#64748B]" />
                    </a>
                  </div>
                </div>
              </div>
            </article>
          )}
        </div>
      </div>
    </div>
  )
}
