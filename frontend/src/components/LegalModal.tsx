import { X, ShieldCheck, FileText, Info, Mail, Lock, ServerOff, CheckCircle2, Code2, ExternalLink } from 'lucide-react'
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
              <span>{isId ? 'Tentang & Lisensi' : 'About & Licenses'}</span>
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
                      ? 'Begitu proses konversi selesai (berhasil maupun gagal), berkas mentah yang Anda unggah langsung dimusnahkan seketika dari sistem tanpa jejak. Berkas hasil konversi hanya berada di memori efemeral sementara dan langsung dibersihkan begitu proses selesai.'
                      : 'As soon as conversion completes (success or failure), raw uploaded files are immediately shredded from the server. Converted outputs reside only in temporary ephemeral memory and are cleared promptly.'}
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-[#0F172A] mb-1 flex items-center gap-1.5">
                    <Lock className="w-4 h-4 text-[#2563EB]" />
                    {isId ? '2. Tanpa Akun, Tanpa Profiling, Tanpa Database Pengguna' : '2. No Accounts, No Profiling, No User Database'}
                  </h4>
                  <p>
                    {isId
                      ? 'Platform ini tidak menyediakan registrasi atau login. Akses unduhan dilindungi token acak pendek (UUID v4) yang kedaluwarsa otomatis. Kami tidak mengumpulkan data pribadi apa pun.'
                      : 'This platform operates with zero user signups. Download access is gated via short-lived random UUID tokens. We collect zero personal identity data.'}
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
                      ? 'Dilarang menggunakan layanan ini untuk mengunggah materi berbahaya, malware, berkas ilegal, atau melanggar hak pihak lain. Batas ukuran berkas adalah 10 MB per berkas dengan maksimum 10 berkas per proses.'
                      : 'You may not upload malicious payloads or illegal documents. File sizes are capped at 10 MB per file, with a maximum of 10 files per batch.'}
                  </li>
                  <li>
                    <strong>{isId ? 'Ketiadaan Garansi (As-Is):' : 'No Warranty (As-Is):'}</strong>{' '}
                    {isId
                      ? 'Layanan disediakan secara cuma-cuma "sebagaimana adanya". Pengembang tidak bertanggung jawab atas kerugian tidak langsung akibat ketidakakuratan hasil konversi.'
                      : 'The service is provided free of charge "as is". Developers are not liable for indirect losses resulting from third-party conversion rendering.'}
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* 3. About Us & Open Source Attribution */}
          {tab === 'about' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-xl font-bold tracking-tight mb-1 flex items-center gap-2 text-[#2563EB]">
                  <Info className="w-6 h-6" />
                  {isId ? 'Tentang Kami & Lisensi Open Source' : 'About Us & Open Source Licenses'}
                </h3>
                <p className="text-xs text-[#64748B]">
                  {isId ? 'Komitmen integritas open-source dan transparansi penuh' : 'Commitment to open-source integrity and full transparency'}
                </p>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-[#475569]">
                <p>
                  {isId
                    ? 'ConvertinAja adalah platform antarmuka web (web interface wrapper) gratis dan open-source yang dibangun oleh Farid Ahmad untuk mempermudah konversi berkas secara cepat tanpa jebakan paywall, tanpa login akun, dan tanpa menyimpan data pengguna.'
                    : 'ConvertinAja is a free, open-source web interface wrapper built by Farid Ahmad to make document conversion quick and painless without paywalls, signups, or data retention.'}
                </p>

                {/* Open Source License Transparency & Legal Compliance */}
                <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
                  <div className="flex items-center gap-2 font-bold text-xs text-[#0F172A]">
                    <Code2 className="w-4 h-4 text-[#2563EB]" />
                    <span>{isId ? 'Atribusi Lisensi Perangkat Lunak Terbuka (FOSS):' : 'Open-Source (FOSS) Software Attributions:'}</span>
                  </div>
                  <p className="text-xs text-[#64748B] leading-relaxed">
                    {isId
                      ? 'ConvertinAja menghormati komunitas open-source sepenuhnya dan mencantumkan sumber mesin asli secara jujur tanpa mengklaimnya sebagai buatan sendiri:'
                      : 'ConvertinAja respects the open-source community and transparently attributes underlying native engines without claiming proprietary authorship:'}
                  </p>
                  <ul className="text-xs space-y-2 text-[#475569]">
                    <li className="p-2.5 rounded-lg bg-white border border-[#E2E8F0]">
                      <div className="font-semibold text-[#0F172A] flex items-center justify-between">
                        <span>Poppler Utilities (pdftoppm, pdfunite, pdftotext)</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-blue-50 text-[#2563EB] font-bold">GPLv2 / GPLv3</span>
                      </div>
                      <p className="text-[11px] text-[#64748B] mt-1">
                        Dikembangkan oleh freedesktop.org & kontributor Xpdf. ConvertinAja mengeksekusi biner CLI Poppler tanpa modifikasi sebagai proses terpisah (subprocess).
                      </p>
                    </li>
                    <li className="p-2.5 rounded-lg bg-white border border-[#E2E8F0]">
                      <div className="font-semibold text-[#0F172A] flex items-center justify-between">
                        <span>Ghostscript CLI (gs)</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold">AGPLv3</span>
                      </div>
                      <p className="text-[11px] text-[#64748B] mt-1">
                        Hak cipta Artifex Software, Inc. Digunakan untuk kompresi PDF melalui eksekusi perintah baris eksternal.
                      </p>
                    </li>
                    <li className="p-2.5 rounded-lg bg-white border border-[#E2E8F0]">
                      <div className="font-semibold text-[#0F172A] flex items-center justify-between">
                        <span>ConvertinAja Web Platform</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-purple-50 text-purple-700 font-bold">MIT License</span>
                      </div>
                      <p className="text-[11px] text-[#64748B] mt-1">
                        Seluruh kode frontend (React 19) dan backend (Go Chi) dapat diaudit dan diakses secara publik di GitHub.
                      </p>
                    </li>
                  </ul>
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
                    ? 'Jika Anda menemukan bug, memiliki saran alat baru, atau membutuhkan bantuan seputar ConvertinAja, hubungi kami melalui saluran berikut:'
                    : 'If you encountered an issue, have feature suggestions, or need assistance, feel free to reach out via:'}
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
                    <span className="text-xs text-[#64748B] block">Portofolio Pengembang:</span>
                    <a
                      href="https://faridahmad.dev"
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-semibold text-[#2563EB] hover:underline inline-flex items-center gap-1"
                    >
                      <span>faridahmad.dev</span>
                      <ExternalLink className="w-3.5 h-3.5" />
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
