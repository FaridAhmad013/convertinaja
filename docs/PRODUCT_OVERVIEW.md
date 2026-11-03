# PRODUCT OVERVIEW — ConvertinAja

> All your document conversions in one place.

ConvertinAja adalah platform konversi dokumen berbasis web yang memungkinkan pengguna mengubah berbagai format file secara praktis, cepat, dan gratis tanpa perlu registrasi atau login akun.

---

## 1. Identitas Produk

| Atribut | Keterangan |
| :--- | :--- |
| **Nama Produk** | ConvertinAja |
| **Jenis Produk** | Web-based Document Conversion Platform |
| **Model Layanan** | Free, No Account Required (Anonymous Session) |
| **Target Pengguna** | Mahasiswa, pekerja kantor, dan pengguna umum yang membutuhkan konversi file instan |
| **Platform** | Web browser (Desktop & Mobile responsive) |

---

## 2. Prinsip Utama Produk

1. **No Account Required** — Tidak ada pendaftaran, login, atau pengumpulan identitas pengguna.
2. **Simple Experience** — Alur 3 langkah: pilih jenis konversi, unggah file, unduh hasil.
3. **Free to Use** — Fitur utama dapat diakses gratis tanpa paywall tersembunyi.
4. **Privacy Focused** — File pengguna diisolasi per job dan dihapus otomatis setelah masa kedaluwarsa.
5. **Multiple Conversions** — Mendukung spektrum konversi dokumen PDF, Gambar, dan Office dalam satu wadah.
6. **Accessible** — Berjalan langsung di peramban modern tanpa instalasi software di sisi klien.

---

## 3. Cakupan Fitur & Prioritas

### 3.1 PDF Tools (Prioritas Utama / MVP)
- Merge PDF
- Split PDF
- Compress PDF
- PDF to JPG
- PDF to PNG
- PDF to TXT
- PDF to HTML
- Extract PDF Images

### 3.2 Image Conversion
- JPG to PDF
- PNG to PDF
- JPG to PNG
- PNG to JPG
- Image to WebP
- WebP to JPG

### 3.3 Office Conversion
- DOCX to PDF
- XLSX to PDF
- PPTX to PDF
- DOC to PDF
- ODT to PDF

> **Fokus Rilis Pertama (Phase 1):** Fitur kategori **PDF Tools** diselesaikan dan distabilkan terlebih dahulu sebelum Image dan Office.

---

## 4. Arsitektur Komponen & Teknologi

| Lapisan | Teknologi | Tanggung Jawab |
| :--- | :--- | :--- |
| **Frontend** | React 19, Vite, TypeScript, Tailwind CSS | UI interaktif, drag-and-drop file upload, visualisasi progres job |
| **Code Quality** | Oxlint, Prettier | Linting dan formatting kode frontend |
| **Backend API** | Go 1.24+, Chi router | REST API, validasi file, anonymous job tokens, rate limiting |
| **Logging** | Zerolog | Structured JSON logging |
| **Database** | PostgreSQL | Metadata job konversi, status pengerjaan, dan audit retensi |
| **Queue / Cache** | Redis | Antrean pekerjaan asinkron dan koordinasi status worker |
| **Storage** | Filesystem / Volume Storage | Penyimpanan sementara file mentah dan hasil konversi (bukan di DB) |
| **Reverse Proxy** | Nginx | SSL termination, reverse proxy, client payload size limit |
| **Container** | Docker & Docker Compose | Standardisasi runtime development dan production |

### 4.1 Conversion Engine Strategy

| Engine | Penggunaan | Keterangan |
| :--- | :--- | :--- |
| **Poppler** | PDF rendering, merge, split, extraction | Menggunakan CLI (`pdfunite`, `pdfseparate`, `pdftoppm`, `pdftotext`, `pdfimages`) |
| **Ghostscript** | PDF compression | Dedicated engine untuk kompresi ukuran file PDF (karena Poppler tidak memiliki fitur kompresi umum) |
| **LibreOffice** | Office to PDF | Headless mode untuk konversi DOCX/XLSX/PPTX/ODT ke PDF |
| **Go Native / Libs** | Image processing | Diproses via package Go native terlebih dahulu; evaluasi CLI ImageMagick hanya jika format/fitur native tidak memadai |

---

## 5. Mekanisme Akses & Alur Kerja Sistem

### 5.1 Anonymous Job Token
Sistem tidak memiliki login, namun membatasi hak akses file hasil konversi menggunakan pasangan ID dan token akses:

```
[ Frontend ]
     │
     │ 1. POST /api/v1/conversions (Upload file + target format)
     ▼
[ Backend API ]
     │
     │ 2. Return: { "job_id": "...", "access_token": "..." }
     ▼
[ Frontend ]
     │
     │ 3. GET /api/v1/conversions/{job_id}?token={access_token} (Polling status)
     │ 4. GET /api/v1/conversions/{job_id}/download?token={access_token}
     ▼
[ Backend API ] -> Stream file hasil dari temporary storage
```

Token ini berumur pendek, terikat pada satu `job_id`, dan mencegah pihak ketiga menebak ID atau mengakses file pengguna lain.

### 5.2 Alur Pemrosesan Job

```
[ Pengguna ]
     │
     ▼ (Upload file)
[ React Frontend ]
     │
     ▼ (Multipart POST)
[ Go Backend API ]
     ├── Validasi MIME type, magic bytes, ukuran file
     ├── Simpan raw file ke temporary job directory
     ├── Simpan metadata job ke PostgreSQL
     └── Push job payload ke Redis Queue
           │
           ▼
[ Worker Engine ] ── Poppler / Ghostscript / LibreOffice
           │
           ├── Tulis hasil ke job directory
           ├── Update status job di PostgreSQL & Redis
           ▼
[ Go Backend API ] ◄── Download request via token
     │
     ▼
[ Pengguna ] (Unduh hasil konversi)
```

---

## 6. Batasan & Aturan Keamanan (Guardrails)

### 6.1 Validasi Input & File
- **MIME Sniffing:** Validasi magic bytes di layer Go backend, tidak percaya hanya pada ekstensi file.
- **Path Traversal Prevention:** Sanitasi nama file, penamaan ulang acak berbasis UUID untuk file temporary di filesystem.
- **Batas Ukuran:**
  - PDF & Image: Maksimal 50MB per file.
  - Office: Maksimal 30MB per file.
- **Batas Halaman:** PDF dibatasi maksimal 200 halaman per proses.
- **Batas File:** Maksimal 10 file per batch job (misal: Merge PDF).

### 6.2 Isolasi Worker & Resource Guard
- **Workspace Isolation:** Setiap job dieksekusi di direktori temporary terisolasi (`/tmp/convertinaja/jobs/{job_id}/`).
- **Resource Limits:** Pembatasan memori dan CPU untuk proses konversi diterapkan di level container (Docker cgroups / OS limits), bukan hanya Go context.
- **Timeout Sandbox:** Subprocess CLI diikat dengan context timeout ketat (default 120 detik per job).
- **Cleanup Otomatis saat Gagal:** Jika proses timeout, crash, atau dibatalkan, direktori temporary job segera dihapus.
- **TTL Penyimpanan:** File mentah dan file hasil otomatis dihapus permanen oleh cleanup worker dalam 60 menit.
- **Rate Limiting:** Batasan jumlah job aktif dan frekuensi request per alamat IP untuk mencegah DoS.
