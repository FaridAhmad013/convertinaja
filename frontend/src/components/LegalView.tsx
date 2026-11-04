import { useState, useEffect } from 'react'
import { ArrowLeft } from 'lucide-react'
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

  const tabs: { slug: LegalPageSlug; label: string }[] = [
    { slug: 'privacy', label: isId ? 'Kebijakan Privasi' : 'Privacy Policy' },
    { slug: 'terms', label: isId ? 'Persyaratan Layanan' : 'Terms of Service' },
    { slug: 'about', label: isId ? 'Tentang & Lisensi' : 'About & Licenses' },
    { slug: 'contact', label: isId ? 'Kontak' : 'Contact' },
  ]

  // Table of Contents per active page
  const privacyToc = isId
    ? [
        { id: 'pengantar', label: 'Pengantar' },
        { id: 'tanpa-retensi', label: 'Pemusnahan Berkas Seketika' },
        { id: 'tanpa-akun', label: 'Bebas Akun & Anonim' },
        { id: 'keamanan-data', label: 'Keamanan Pemrosesan' },
        { id: 'iklan-analitik', label: 'Iklan Pihak Ketiga' },
        { id: 'kontak-privasi', label: 'Kontak Privasi' },
      ]
    : [
        { id: 'pengantar', label: 'Introduction' },
        { id: 'tanpa-retensi', label: 'Instant File Destruction' },
        { id: 'tanpa-akun', label: 'Account-Free & Anonymous' },
        { id: 'keamanan-data', label: 'Processing Security' },
        { id: 'iklan-analitik', label: 'Third-Party Advertising' },
        { id: 'kontak-privasi', label: 'Privacy Contact' },
      ]

  const termsToc = isId
    ? [
        { id: 'ketentuan-umum', label: 'Penerimaan Ketentuan' },
        { id: 'batasan-penggunaan', label: 'Batasan Penggunaan' },
        { id: 'limit-sistem', label: 'Batas Teknis & 5 Menit' },
        { id: 'hak-kekayaan', label: 'Kepemilikan Berkas' },
        { id: 'penafian', label: 'Penafian Tanggung Jawab' },
      ]
    : [
        { id: 'ketentuan-umum', label: 'Acceptance of Terms' },
        { id: 'batasan-penggunaan', label: 'Acceptable Use' },
        { id: 'limit-sistem', label: 'Technical & 5-Min Limit' },
        { id: 'hak-kekayaan', label: 'Intellectual Property' },
        { id: 'penafian', label: 'Disclaimer of Warranties' },
      ]

  const aboutToc = isId
    ? [
        { id: 'mengenai-kami', label: 'Tentang ConvertinAja' },
        { id: 'lisensi-foss', label: 'Atribusi & Lisensi Mesin' },
        { id: 'arsitektur-transparan', label: 'Arsitektur Efemeral' },
      ]
    : [
        { id: 'mengenai-kami', label: 'About ConvertinAja' },
        { id: 'lisensi-foss', label: 'Engine Attribution & Licenses' },
        { id: 'arsitektur-transparan', label: 'Ephemeral Architecture' },
      ]

  const contactToc = isId
    ? [
        { id: 'saluran-kontak', label: 'Hubungi Kami' },
        { id: 'laporan-bug', label: 'Pelaporan Masalah' },
      ]
    : [
        { id: 'saluran-kontak', label: 'Contact Us' },
        { id: 'laporan-bug', label: 'Bug Reports' },
      ]

  const currentToc =
    activeSlug === 'privacy'
      ? privacyToc
      : activeSlug === 'terms'
        ? termsToc
        : activeSlug === 'about'
          ? aboutToc
          : contactToc

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="w-full bg-white text-[#0F172A]">
      {/* 1. Header Bar: Brand Context, Back Action & Horizontal Navigation Tabs (Google Privacy style) */}
      <div className="border-b border-[#E2E8F0] sticky top-16 z-30 bg-white/95 backdrop-blur-xs">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-[#64748B] hover:text-[#0F172A] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{isId ? 'Kembali ke Beranda' : 'Back to Home'}</span>
            </button>

            <span className="text-xs text-[#94A3B8] hidden sm:inline">
              ConvertinAja &bull; {isId ? 'Privasi & Persyaratan' : 'Privacy & Terms'}
            </span>
          </div>

          {/* Underline Tabs */}
          <nav className="flex space-x-8 overflow-x-auto no-scrollbar -mb-px">
            {tabs.map((tab) => {
              const isActive = activeSlug === tab.slug
              return (
                <button
                  key={tab.slug}
                  type="button"
                  onClick={() => setActiveSlug(tab.slug)}
                  className={`py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'border-[#2563EB] text-[#2563EB]'
                      : 'border-transparent text-[#64748B] hover:text-[#0F172A] hover:border-slate-300'
                  }`}
                >
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      {/* 2. Main Two-Column Layout: Left Sticky Outline (TOC) & Right Clean Editorial Content */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Minimal Clean TOC Sidebar (Desktop) */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-36 space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
                {isId ? 'Daftar Isi' : 'On this page'}
              </span>
              <ul className="space-y-2 text-sm text-[#64748B]">
                {currentToc.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => scrollToSection(item.id)}
                      className="text-left hover:text-[#2563EB] transition-colors cursor-pointer block py-0.5"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Right Column: Editorial Body Text */}
          <article className="lg:col-span-9 max-w-3xl space-y-12">
            {/* === PRIVACY POLICY === */}
            {activeSlug === 'privacy' && (
              <>
                <header className="space-y-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
                    {isId ? 'Kebijakan Privasi ConvertinAja' : 'ConvertinAja Privacy Policy'}
                  </span>
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight leading-tight">
                    {isId
                      ? 'Privasi Anda adalah fondasi utama arsitektur kami, bukan sekadar janji tertulis.'
                      : 'Your privacy is the core architecture of our platform, not an afterthought.'}
                  </h1>
                  <p className="text-base text-[#475569] leading-relaxed">
                    {isId
                      ? 'ConvertinAja dirancang sejak baris kode pertama untuk tidak menyimpan dokumen Anda. Kami tidak memiliki basis data pengguna, tidak menyimpan berkas secara permanen, dan tidak memperdagangkan data dokumen Anda kepada pihak mana pun.'
                      : 'ConvertinAja is built from the ground up to never retain your documents. We operate zero persistent databases for user files, gather zero personal identities, and never share or monetize your information.'}
                  </p>
                </header>

                <hr className="border-[#E2E8F0]" />

                <section id="pengantar" className="space-y-3 scroll-mt-36">
                  <h2 className="text-xl font-bold text-[#0F172A]">
                    {isId ? '1. Pengantar' : '1. Introduction'}
                  </h2>
                  <p className="text-sm text-[#475569] leading-relaxed">
                    {isId
                      ? 'Kebijakan Privasi ini menjelaskan bagaimana platform ConvertinAja memperlakukan dokumen yang Anda unggah dan informasi teknis yang terjadi selama proses konversi dokumen berlangsung.'
                      : 'This Privacy Policy explains how ConvertinAja handles documents you upload and technical metadata created during conversions.'}
                  </p>
                </section>

                <section id="tanpa-retensi" className="space-y-3 scroll-mt-36">
                  <h2 className="text-xl font-bold text-[#0F172A]">
                    {isId ? '2. Pemusnahan Berkas Mentah Seketika (Zero Retention)' : '2. Instant Raw File Destruction'}
                  </h2>
                  <p className="text-sm text-[#475569] leading-relaxed">
                    {isId
                      ? 'Begitu proses konversi dokumen selesai (baik berhasil maupun gagal), berkas mentah asli yang Anda unggah langsung dimusnahkan secara permanen dari server melalui fungsi penghapusan sistem berkas tingkat rendah (os.Remove). Server kami tidak mengarsipkan salinan cadangan.'
                      : 'As soon as conversion finishes (success or failure), original uploaded raw files are immediately and permanently erased using low-level filesystem removal (os.Remove). We keep zero backups.'}
                  </p>
                  <p className="text-sm text-[#475569] leading-relaxed">
                    {isId
                      ? 'Hasil konversi ditempatkan sementara pada memori efemeral terisolasi agar dapat Anda unduh. Sistem pembersih otomatis (fail-safe sweeper) berjalan secara berkala untuk memastikan tidak ada artefak berkas yang tertinggal pada media penyimpanan.'
                      : 'Converted output files reside temporarily in isolated ephemeral memory for your download. Background sweepers run continuously as a fail-safe to guarantee zero leftover files.'}
                  </p>
                </section>

                <section id="tanpa-akun" className="space-y-3 scroll-mt-36">
                  <h2 className="text-xl font-bold text-[#0F172A]">
                    {isId ? '3. Bebas Akun & Anonim' : '3. Account-Free & Fully Anonymous'}
                  </h2>
                  <p className="text-sm text-[#475569] leading-relaxed">
                    {isId
                      ? 'ConvertinAja tidak menyediakan pendaftaran akun, formulir login, atau pengumpulan data pribadi (nama, alamat email, atau nomor telepon). Sesi kerja Anda diidentifikasi hanya dengan token acak kriptografis (UUID v4) berumur pendek di peramban.'
                      : 'ConvertinAja requires no signups, logins, or personal details (such as names, emails, or phone numbers). Your session is authorized purely through short-lived cryptographic UUID v4 tokens on your browser.'}
                  </p>
                </section>

                <section id="keamanan-data" className="space-y-3 scroll-mt-36">
                  <h2 className="text-xl font-bold text-[#0F172A]">
                    {isId ? '4. Keamanan Pemrosesan & Transmisi' : '4. Processing & Transmission Security'}
                  </h2>
                  <p className="text-sm text-[#475569] leading-relaxed">
                    {isId
                      ? 'Seluruh lalu lintas transmisi antara peramban Anda dan server dienkripsi menggunakan protokol standar HTTPS (TLS 1.3). Pemrosesan biner konversi dijalankan di dalam container terisolasi tanpa akses interpreter shell eksternal.'
                      : 'All data in transit between your browser and our server is secured using modern TLS 1.3 encryption. Conversion execution runs inside isolated container sandboxes without external shell interpretation.'}
                  </p>
                </section>

                <section id="iklan-analitik" className="space-y-3 scroll-mt-36">
                  <h2 className="text-xl font-bold text-[#0F172A]">
                    {isId ? '5. Iklan Pihak Ketiga & Cookie' : '5. Third-Party Advertising & Cookies'}
                  </h2>
                  <p className="text-sm text-[#475569] leading-relaxed">
                    {isId
                      ? 'Untuk menjaga kelangsungan operasional server gratis, kami dapat menayangkan iklan melalui jaringan resmi seperti Google AdSense. Google dapat menggunakan cookie untuk menayangkan iklan berdasarkan kunjungan Anda ke situs ini atau situs web lain di internet. Anda dapat mengelola preferensi iklan melalui setelan Google Ads Settings.'
                      : 'To sustain server hosting costs, we may serve advertisements via certified providers like Google AdSense. Google may utilize cookies to serve ads based on prior web visits. You can customize cookie preferences via Google Ads Settings.'}
                  </p>
                </section>

                <section id="kontak-privasi" className="space-y-3 scroll-mt-36">
                  <h2 className="text-xl font-bold text-[#0F172A]">
                    {isId ? '6. Kontak Privasi' : '6. Privacy Contact'}
                  </h2>
                  <p className="text-sm text-[#475569] leading-relaxed">
                    {isId
                      ? 'Jika Anda memiliki pertanyaan mengenai penanganan privasi atau kepatuhan data pada platform ini, silakan hubungi pengembang melalui email faridahmad013@gmail.com.'
                      : 'For inquiries regarding data privacy compliance, reach out to the developer at faridahmad013@gmail.com.'}
                  </p>
                </section>
              </>
            )}

            {/* === TERMS OF SERVICE === */}
            {activeSlug === 'terms' && (
              <>
                <header className="space-y-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
                    {isId ? 'Persyaratan Layanan ConvertinAja' : 'ConvertinAja Terms of Service'}
                  </span>
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight leading-tight">
                    {isId
                      ? 'Ketentuan penggunaan platform konversi dokumen ConvertinAja.'
                      : 'Terms governing your use of ConvertinAja conversion utility.'}
                  </h1>
                  <p className="text-base text-[#475569] leading-relaxed">
                    {isId
                      ? 'Dengan mengakses atau menggunakan platform ini, Anda menyetujui persyaratan berikut. Kami menyajikan panduan ini secara transparan tanpa syarat tersembunyi.'
                      : 'By accessing or using ConvertinAja, you agree to these clear, transparent terms.'}
                  </p>
                </header>

                <hr className="border-[#E2E8F0]" />

                <section id="ketentuan-umum" className="space-y-3 scroll-mt-36">
                  <h2 className="text-xl font-bold text-[#0F172A]">
                    {isId ? '1. Penerimaan Ketentuan' : '1. Acceptance of Terms'}
                  </h2>
                  <p className="text-sm text-[#475569] leading-relaxed">
                    {isId
                      ? 'ConvertinAja disediakan untuk penggunaan perorangan dan profesional tanpa pungutan biaya langganan. Penggunaan platform harus mematuhi seluruh hukum yang berlaku di yurisdiksi Anda.'
                      : 'ConvertinAja is provided free of charge for personal and commercial usage. You must comply with all applicable local and international laws.'}
                  </p>
                </section>

                <section id="batasan-penggunaan" className="space-y-3 scroll-mt-36">
                  <h2 className="text-xl font-bold text-[#0F172A]">
                    {isId ? '2. Batasan Penggunaan Berkas' : '2. Acceptable Use'}
                  </h2>
                  <p className="text-sm text-[#475569] leading-relaxed">
                    {isId
                      ? 'Anda bertanggung jawab penuh atas dokumen yang Anda unggah. Pengguna dilarang mengunggah konten yang melanggar hukum, malware, materi berhak cipta tanpa izin, atau berkas berbahaya lainnya.'
                      : 'You retain sole responsibility for files submitted. Uploading malicious binaries, unlicensed copyrighted media, or unlawful content is strictly prohibited.'}
                  </p>
                </section>

                <section id="limit-sistem" className="space-y-3 scroll-mt-36">
                  <h2 className="text-xl font-bold text-[#0F172A]">
                    {isId ? '3. Batas Teknis & Batas Waktu 5 Menit' : '3. Technical Ceilings & 5-Minute Limit'}
                  </h2>
                  <p className="text-sm text-[#475569] leading-relaxed">
                    {isId
                      ? 'Untuk menjaga stabilitas performa server, batas ukuran berkas adalah maksimal 10 MB per berkas dengan batas antrean hingga 10 berkas. Setiap proses konversi terikat pada batas waktu maksimal 5 menit (300 detik). Proses yang melampaui 5 menit akan otomatis dihentikan paksa (SIGKILL) dan berkas terkait langsung dihapus.'
                      : 'To guarantee server stability, uploads are limited to 10 MB per file and max 10 files per batch. Each job is bound to a strict 5-minute (300-second) timeout. Processes exceeding 5 minutes are forcefully terminated (SIGKILL) and files erased.'}
                  </p>
                </section>

                <section id="hak-kekayaan" className="space-y-3 scroll-mt-36">
                  <h2 className="text-xl font-bold text-[#0F172A]">
                    {isId ? '4. Kepemilikan Hak Cipta Dokumen' : '4. Intellectual Property Rights'}
                  </h2>
                  <p className="text-sm text-[#475569] leading-relaxed">
                    {isId
                      ? 'ConvertinAja tidak mengklaim hak kepemilikan atas berkas yang Anda konversi. Seluruh hak kekayaan intelektual atas dokumen sumber dan hasil konversi tetap menjadi milik Anda sepenuhnya.'
                      : 'ConvertinAja claims zero ownership or rights over your documents. All intellectual property remains exclusively yours.'}
                  </p>
                </section>

                <section id="penafian" className="space-y-3 scroll-mt-36">
                  <h2 className="text-xl font-bold text-[#0F172A]">
                    {isId ? '5. Penafian Tanggung Jawab' : '5. Disclaimer of Warranties'}
                  </h2>
                  <p className="text-sm text-[#475569] leading-relaxed">
                    {isId
                      ? 'Layanan ini disediakan "sebagaimana adanya" (as-is) tanpa jaminan ketersediaan mutlak tanpa henti. Pengembang tidak bertanggung jawab atas kegagalan konversi atau kerusakan dokumen akibat berkas sumber yang korup atau rusak.'
                      : 'The service is provided "as is" without warranties of uninterrupted availability. We are not liable for failed conversions stemming from corrupted input files.'}
                  </p>
                </section>
              </>
            )}

            {/* === ABOUT & LICENSES === */}
            {activeSlug === 'about' && (
              <>
                <header className="space-y-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
                    {isId ? 'Tentang ConvertinAja & Lisensi FOSS' : 'About ConvertinAja & FOSS Licenses'}
                  </span>
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight leading-tight">
                    {isId
                      ? 'Dibangun di atas ekosistem open-source yang teruji dan transparan.'
                      : 'Built on top of proven, transparent open-source foundations.'}
                  </h1>
                  <p className="text-base text-[#475569] leading-relaxed">
                    {isId
                      ? 'ConvertinAja dikembangkan oleh Farid Ahmad sebagai antarmuka web modern yang cepat dan aman untuk mempermudah konversi dokumen sehari-hari.'
                      : 'ConvertinAja was developed by Farid Ahmad as a fast, secure web wrapper making daily document conversion accessible to everyone.'}
                  </p>
                </header>

                <hr className="border-[#E2E8F0]" />

                <section id="mengenai-kami" className="space-y-3 scroll-mt-36">
                  <h2 className="text-xl font-bold text-[#0F172A]">
                    {isId ? '1. Tentang Proyek' : '1. About the Project'}
                  </h2>
                  <p className="text-sm text-[#475569] leading-relaxed">
                    {isId
                      ? 'Banyak layanan konversi dokumen online mengharuskan pengguna mendaftar, membayar langganan, atau membiarkan berkas mereka tersimpan berjam-jam di server pihak ketiga. ConvertinAja hadir sebagai alternatif open-source: tanpa pendaftaran akun, tanpa paywall, dan berkas langsung musnah setelah diproses.'
                      : 'Many web converters require paid plans, account registration, or store user files indefinitely. ConvertinAja exists as an open-source alternative: no accounts, no subscriptions, and instant file destruction.'}
                  </p>
                </section>

                <section id="lisensi-foss" className="space-y-4 scroll-mt-36">
                  <h2 className="text-xl font-bold text-[#0F172A]">
                    {isId ? '2. Atribusi Mesin & Lisensi Perangkat Lunak' : '2. Engine Attribution & FOSS Licenses'}
                  </h2>
                  <p className="text-sm text-[#475569] leading-relaxed">
                    {isId
                      ? 'ConvertinAja mengeksekusi mesin konversi open-source standar industri melalui panggilan subproses mandiri (CLI subprocess) tanpa memodifikasi kode sumber mesin tersebut:'
                      : 'ConvertinAja leverages battle-tested open-source conversion engines via isolated CLI subprocess execution without proprietary source linking:'}
                  </p>

                  <div className="space-y-3 pt-2">
                    <div className="p-4 rounded-xl border border-[#E2E8F0] bg-slate-50">
                      <div className="font-bold text-sm text-[#0F172A]">Poppler Utilities (pdftoppm, pdfinfo)</div>
                      <p className="text-xs text-[#64748B] mt-1">
                        {isId
                          ? 'Lisensi: GNU General Public License v2 / v3 (GPLv2/GPLv3). Digunakan untuk rendering PDF ke gambar beresolusi tinggi 300 DPI.'
                          : 'License: GNU General Public License v2 / v3 (GPLv2/GPLv3). Leveraged for 300 DPI high-definition PDF-to-image rendering.'}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl border border-[#E2E8F0] bg-slate-50">
                      <div className="font-bold text-sm text-[#0F172A]">Ghostscript (gs)</div>
                      <p className="text-xs text-[#64748B] mt-1">
                        {isId
                          ? 'Lisensi: GNU Affero General Public License (AGPLv3). Digunakan untuk kompresi dan optimasi berkas PDF.'
                          : 'License: GNU Affero General Public License (AGPLv3). Used for robust PDF file compression.'}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl border border-[#E2E8F0] bg-slate-50">
                      <div className="font-bold text-sm text-[#0F172A]">LibreOffice Headless (soffice)</div>
                      <p className="text-xs text-[#64748B] mt-1">
                        {isId
                          ? 'Lisensi: Mozilla Public License v2.0 (MPL-2.0). Digunakan untuk konversi dokumen Office (DOCX, PPTX, XLSX) ke PDF.'
                          : 'License: Mozilla Public License v2.0 (MPL-2.0). Utilized for converting Office documents (DOCX, PPTX, XLSX) to PDF.'}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl border border-[#E2E8F0] bg-slate-50">
                      <div className="font-bold text-sm text-[#0F172A]">WebP Tools (cwebp, dwebp)</div>
                      <p className="text-xs text-[#64748B] mt-1">
                        {isId
                          ? 'Lisensi: BSD-3-Clause (Google LLC). Digunakan untuk encoding dan decoding gambar WebP modern.'
                          : 'License: BSD-3-Clause (Google LLC). Used for modern WebP encoding and decoding.'}
                      </p>
                    </div>
                  </div>
                </section>

                <section id="arsitektur-transparan" className="space-y-3 scroll-mt-36">
                  <h2 className="text-xl font-bold text-[#0F172A]">
                    {isId ? '3. Kode Sumber Terbuka' : '3. Open Source Codebase'}
                  </h2>
                  <p className="text-sm text-[#475569] leading-relaxed">
                    {isId
                      ? 'Seluruh kode sumber backend dan antarmuka web ConvertinAja didistribusikan secara transparan melalui repositori GitHub di github.com/faridahmad013/convertinaja.'
                      : 'The full backend and frontend codebase is publicly published at github.com/faridahmad013/convertinaja.'}
                  </p>
                </section>
              </>
            )}

            {/* === CONTACT === */}
            {activeSlug === 'contact' && (
              <>
                <header className="space-y-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
                    {isId ? 'Hubungi Pengembang' : 'Contact Developer'}
                  </span>
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight leading-tight">
                    {isId
                      ? 'Kami siap membantu menjawab pertanyaan Anda.'
                      : 'Get in touch for questions or feedback.'}
                  </h1>
                  <p className="text-base text-[#475569] leading-relaxed">
                    {isId
                      ? 'Apakah Anda memiliki pertanyaan seputar cara kerja konversi, pelaporan masalah teknis, atau permintaan kerja sama?'
                      : 'Have questions regarding conversions, technical bug reports, or inquiries? Reach out directly.'}
                  </p>
                </header>

                <hr className="border-[#E2E8F0]" />

                <section id="saluran-kontak" className="space-y-3 scroll-mt-36">
                  <h2 className="text-xl font-bold text-[#0F172A]">
                    {isId ? '1. Saluran Komunikasi Langsung' : '1. Direct Channels'}
                  </h2>
                  <p className="text-sm text-[#475569] leading-relaxed">
                    {isId
                      ? 'Email Resmi: faridahmad013@gmail.com'
                      : 'Direct Email: faridahmad013@gmail.com'}
                  </p>
                  <p className="text-sm text-[#475569] leading-relaxed">
                    {isId
                      ? 'Portofolio Pengembang: faridahmad.dev'
                      : 'Developer Portfolio: faridahmad.dev'}
                  </p>
                  <p className="text-sm text-[#475569] leading-relaxed">
                    {isId
                      ? 'LinkedIn: linkedin.com/in/faridahmad013'
                      : 'LinkedIn: linkedin.com/in/faridahmad013'}
                  </p>
                </section>

                <section id="laporan-bug" className="space-y-3 scroll-mt-36">
                  <h2 className="text-xl font-bold text-[#0F172A]">
                    {isId ? '2. Pelaporan Bug & Permintaan Fitur' : '2. Bug Reports & Feature Requests'}
                  </h2>
                  <p className="text-sm text-[#475569] leading-relaxed">
                    {isId
                      ? 'Untuk kendala teknis atau usulan penambahan format dokumen baru, silakan buka Issue di repositori resmi GitHub: github.com/faridahmad013/convertinaja/issues.'
                      : 'To report conversion errors or suggest new document formats, submit an issue on GitHub: github.com/faridahmad013/convertinaja/issues.'}
                  </p>
                </section>
              </>
            )}
          </article>
        </div>
      </div>
    </div>
  )
}
