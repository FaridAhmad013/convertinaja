import { X, ShieldCheck, FileText, Info, Mail, Lock, Trash2, ServerOff, CheckCircle2 } from 'lucide-react'
import { useI18n } from '../i18n'

export type LegalTab = 'privacy' | 'terms' | 'about' | 'contact'

interface LegalModalProps {
  isOpen: boolean
  tab: LegalTab
  onClose: () => void
  onSelectTab: (tab: LegalTab) => void
}

export function LegalModal({ isOpen, tab, onClose, onSelectTab }: LegalModalProps) {
  const { lang } = useI18n()
  const isId = lang === 'id'

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-[#E2E8F0] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header & Tabs */}
        <div className="p-4 sm:p-6 border-b border-[#E2E8F0] flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2 overflow-x-auto">
            <button
              type="button"
              onClick={() => onSelectTab('privacy')}
              className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                tab === 'privacy'
                  ? 'bg-[#2563EB] text-white shadow-xs'
                  : 'text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isId ? 'Kebijakan Privasi' : 'Privacy Policy'}</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectTab('terms')}
              className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                tab === 'terms'
                  ? 'bg-[#2563EB] text-white shadow-xs'
                  : 'text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>{isId ? 'Syarat & Ketentuan' : 'Terms of Service'}</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectTab('about')}
              className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                tab === 'about'
                  ? 'bg-[#2563EB] text-white shadow-xs'
                  : 'text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100'
              }`}
            >
              <Info className="w-4 h-4" />
              <span>{isId ? 'Tentang Kami' : 'About Us'}</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectTab('contact')}
              className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                tab === 'contact'
                  ? 'bg-[#2563EB] text-white shadow-xs'
                  : 'text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>{isId ? 'Hubungi Kami' : 'Contact'}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 rounded-lg cursor-pointer ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-[#0F172A] text-sm leading-relaxed">
          {/* 1. Privacy Policy */}
          {tab === 'privacy' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-xl font-bold tracking-tight mb-1 flex items-center gap-2 text-[#2563EB]">
                  <ShieldCheck className="w-6 h-6" />
                  {isId ? 'Kebijakan Privasi (Zero-Data Retention)' : 'Privacy Policy (Zero-Data Retention)'}
                </h3>
                <p className="text-xs text-[#64748B]">
                  {isId
                    ? 'Terakhir diperbarui: Maret 2026 • Kebijakan Tanpa Kompromi'
                    : 'Last updated: March 2026 • Zero-Compromise Policy'}
                </p>
              </div>

              {/* Highlight Box */}
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-2">
                <div className="font-bold text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    {isId
                      ? 'Pernyataan Resmi: Kami Tidak Menyimpan Maupun Membaca Dokumen Anda'
                      : 'Official Statement: We Do Not Store Or Read Your Documents'}
                  </span>
                </div>
                <p className="text-xs text-emerald-900 leading-relaxed">
                  {isId
                    ? 'ConvertinAja dibangun atas prinsip dasar "Zero Storage & Ephemeral Computing". Dokumen Anda tidak pernah diarsipkan, tidak pernah dijual, dan tidak pernah digunakan untuk melatih kecerdasan buatan (AI).'
                    : 'ConvertinAja is built on "Zero Storage & Ephemeral Computing". Your documents are never archived, never sold, and never used to train artificial intelligence models.'}
                </p>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-[#475569]">
                <div>
                  <h4 className="font-bold text-[#0F172A] mb-1 flex items-center gap-1.5">
                    <ServerOff className="w-4 h-4 text-[#2563EB]" />
                    {isId ? '1. Pemusnahan Otomatis Seketika (Instant Destruction)' : '1. Instant Source File Destruction'}
                  </h4>
                  <p>
                    {isId
                      ? 'Begitu proses konversi berhasil atau gagal, berkas mentah yang Anda unggah langsung dimusnahkan seketika dari sistem menggunakan fungsi penghapusan file permanen. Hanya berkas keluaran terkonversi yang tersisa sementara di memori sementara agar Anda dapat mengunduhnya.'
                      : 'As soon as conversion succeeds or fails, your uploaded source files are immediately purged from system disk. Only the resulting converted artifact remains temporarily so you can download it.'}
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-[#0F172A] mb-1 flex items-center gap-1.5">
                    <Lock className="w-4 h-4 text-[#2563EB]" />
                    {isId ? '2. Tanpa Akun, Tanpa Profiling, Tanpa Database Pengguna' : '2. No Accounts, No Profiling, No User Database'}
                  </h4>
                  <p>
                    {isId
                      ? 'Platform ini tidak menyediakan fitur registrasi atau login. Akses file dilindungi secara kriptografis menggunakan token acak pendek (UUID v4) yang kedaluwarsa otomatis. Kami tidak mengumpulkan nama, email, maupun nomor telepon.'
                      : 'This platform operates with zero user signups. File access is protected via cryptographically generated short-lived random UUID tokens. We do not collect names, emails, or personal identities.'}
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-[#0F172A] mb-1 flex items-center gap-1.5">
                    <Trash2 className="w-4 h-4 text-[#2563EB]" />
                    {isId ? '3. Hak Pembersihan Mandiri Kapan Saja' : '3. Immediate Self-Purge Option'}
                  </h4>
                  <p>
                    {isId
                      ? 'Pengguna memiliki kendali penuh melalui tombol "Hapus dari Server Sekarang" untuk memusnahkan berkas hasil konversi detik itu juga tanpa perlu menunggu waktu retensi.'
                      : 'Users have full control via the "Delete from Server Now" button to destroy the converted artifact instantly without waiting for any retention timer.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 2. Terms of Service */}
          {tab === 'terms' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold tracking-tight mb-1 flex items-center gap-2 text-[#2563EB]">
                  <FileText className="w-6 h-6" />
                  {isId ? 'Syarat & Ketentuan Layanan' : 'Terms of Service'}
                </h3>
                <p className="text-xs text-[#64748B]">
                  {isId ? 'Berlaku untuk seluruh pengguna ConvertinAja' : 'Applicable to all ConvertinAja users'}
                </p>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-[#475569]">
                <p>
                  {isId
                    ? 'Dengan mengakses dan menggunakan ConvertinAja, Anda menyetujui ketentuan berikut:'
                    : 'By accessing and using ConvertinAja, you agree to the following terms:'}
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>{isId ? 'Kepemilikan Berkas:' : 'Document Ownership:'}</strong>{' '}
                    {isId
                      ? 'Hak cipta dan kepemilikan seluruh dokumen yang diunggah sepenuhnya tetap berada di tangan Anda. ConvertinAja tidak memiliki hak klaim apa pun atas konten berkas Anda.'
                      : 'All copyright and ownership rights remain with you. ConvertinAja claims zero ownership or intellectual rights over your files.'}
                  </li>
                  <li>
                    <strong>{isId ? 'Batasan Penggunaan:' : 'Fair Use & Limitations:'}</strong>{' '}
                    {isId
                      ? 'Dilarang menggunakan layanan ini untuk mengunggah materi berbahaya, malware, berkas ilegal, atau melanggar hak kekayaan intelektual pihak lain. Batas ukuran berkas adalah 50 MB per proses.'
                      : 'You may not upload malicious payloads, malware, or illegal documents. File sizes are capped at 50 MB per job.'}
                  </li>
                  <li>
                    <strong>{isId ? 'Ketiadaan Garansi (As-Is):' : 'No Warranty (As-Is):'}</strong>{' '}
                    {isId
                      ? 'Layanan disediakan secara cuma-cuma "sebagaimana adanya". Pengembang tidak bertanggung jawab atas kerugian tidak langsung akibat ketidakakuratan hasil konversi pihak ketiga.'
                      : 'The service is provided free of charge "as is". Developers are not liable for indirect losses resulting from third-party conversion rendering.'}
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* 3. About Us */}
          {tab === 'about' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold tracking-tight mb-1 flex items-center gap-2 text-[#2563EB]">
                  <Info className="w-6 h-6" />
                  {isId ? 'Tentang ConvertinAja' : 'About ConvertinAja'}
                </h3>
                <p className="text-xs text-[#64748B]">
                  {isId ? 'Misi alat konversi terbuka dan bebas paywall' : 'Open-source document conversion mission'}
                </p>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-[#475569]">
                <p>
                  {isId
                    ? 'ConvertinAja lahir dari kegelisahan terhadap layanan konversi daring komersial yang membatasi unduhan harian, memasang jebakan berlangganan (paywall), atau meminta registrasi email hanya untuk mengubah berkas PDF sederhana.'
                    : 'ConvertinAja was created to solve frustrations with commercial online tools that restrict daily limits, enforce aggressive paywalls, or require email registration just to convert a simple PDF file.'}
                </p>
                <p>
                  {isId
                    ? 'Kami percaya bahwa utilitas berkas harian harus dapat diakses secara gratis, cepat, dan transparan oleh siapa saja di seluruh dunia. Seluruh kode backend dan frontend bersifat open-source dan dapat diaudit secara publik di GitHub.'
                    : 'We believe basic file utilities should be free, fast, and transparent to everyone worldwide. Our code is 100% open-source and publicly auditable on GitHub.'}
                </p>
                <div className="p-4 rounded-xl bg-slate-50 border border-[#E2E8F0]">
                  <span className="font-semibold text-xs text-[#0F172A] block mb-1">
                    {isId ? 'Teknologi di Balik Layar:' : 'Powered by Trusted Open-Source Engines:'}
                  </span>
                  <p className="text-xs text-[#64748B]">
                    Poppler Utils, Ghostscript CLI, Go (Golang) Microservice, React 19, Tailwind CSS v4, Docker containerized sandbox.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 4. Contact */}
          {tab === 'contact' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold tracking-tight mb-1 flex items-center gap-2 text-[#2563EB]">
                  <Mail className="w-6 h-6" />
                  {isId ? 'Hubungi Pengembang' : 'Contact Us'}
                </h3>
                <p className="text-xs text-[#64748B]">
                  {isId ? 'Pertanyaan, saran fitur, atau laporan keamanan' : 'Questions, feedback, or security disclosures'}
                </p>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-[#475569]">
                <p>
                  {isId
                    ? 'Jika Anda menemukan bug, memiliki saran alat baru, atau membutuhkan bantuan seputar ConvertinAja, jangan ragu untuk menghubungi kami melalui saluran resmi berikut:'
                    : 'If you encountered an issue, have feature suggestions, or need assistance, feel free to reach out via our official channels:'}
                </p>
                <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200/80 space-y-2 text-[#0F172A]">
                  <div>
                    <span className="text-xs text-[#64748B] block">Email Dukungan:</span>
                    <a
                      href="mailto:contact@convertinaja.org"
                      className="text-sm font-semibold text-[#2563EB] hover:underline"
                    >
                      contact@convertinaja.org
                    </a>
                  </div>
                  <div>
                    <span className="text-xs text-[#64748B] block">GitHub Repository & Issues:</span>
                    <a
                      href="https://github.com/faridahmad013/convertinaja"
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-semibold text-[#2563EB] hover:underline"
                    >
                      github.com/faridahmad013/convertinaja
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E2E8F0] bg-slate-50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold cursor-pointer shadow-xs"
          >
            {isId ? 'Mengerti & Tutup' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  )
}
