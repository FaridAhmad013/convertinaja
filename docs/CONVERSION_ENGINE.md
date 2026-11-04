# ConvertinAja — Dokumentasi Arsitektur & Kebijakan Nol Penyimpanan (Zero-Storage)

> **All your document conversions in one place.**  
> Konversi dokumen instan berbasis web: PDF, Gambar, dan Office. Tanpa akun, tanpa pelacakan, dan dengan kebijakan pemusnahan berkas seketika di sisi server.

---

## 1. Ikhtisar & Prinsip Dasar
ConvertinAja dibangun atas 4 pilar arsitektur:
1. **Nol Akun (Zero-Account):** Tidak ada pendaftaran, login, profil pengguna, maupun cookie pelacakan. Sesi anonim dilindungi oleh token acak berumur pendek (UUID v4).
2. **Nol Penyimpanan & Pemusnahan Seketika (Zero-Storage Guarantee):** Server tidak berfungsi sebagai gudang penyimpanan data. Berkas mentah yang diunggah pengguna **langsung dimusnahkan seketika (`os.Remove`)** saat proses konversi selesai atau gagal.
3. **Penyimpanan Hasil Efemeral:** Berkas keluaran hasil konversi hanya berada di memori sementara server untuk diambil oleh pengguna dan otomatis terhapus permanen setelah pengguna mengunduhnya atau melalui mekanisme *fail-safe cleanup* terjadwal.
4. **Batas Waktu Eksekusi Maksimum 5 Menit (5-Minute Resource Hard Ceiling):** Setiap proses CLI subprocess dibatasi secara ketat dengan *context timeout* maksimum 5 menit (300 detik). Proses yang melampaui batas ini akan otomatis dihentikan paksa (*SIGKILL*) untuk melindungi performa dan memori server VPS dari ancaman *resource exhaustion* / DoS.

---

## 2. Atribusi Lisensi Mesin Konversi (FOSS Attribution)
ConvertinAja bertindak sebagai lapisan orkestrasi web (*wrapper interface*) dan secara transparan menghormati lisensi sumber terbuka dari mesin CLI independen yang digunakan:

| Perangkat Lunak | Pemegang Hak Cipta / Pengembang | Lisensi | Peran di ConvertinAja |
| :--- | :--- | :--- | :--- |
| **Poppler** (`pdftoppm`, `pdfunite`, `pdfseparate`, `pdftotext`, `pdfimages`) | freedesktop.org & kontributor Xpdf | **GPLv2 / GPLv3** | Subprocess CLI independen tanpa modifikasi kode sumber biner untuk rendering PDF ke gambar, teks, dan penggabungan/pemisahan halaman. |
| **Ghostscript** (`gs`) | Artifex Software, Inc. | **AGPLv3** | Subprocess CLI independen untuk algoritma kompresi dokumen PDF. |
| **LibreOffice** (`soffice`) | The Document Foundation | **MPL-2.0 / LGPLv3+** | Mode CLI headless (`--headless`) untuk konversi format dokumen Office (DOCX, PPTX, XLSX, ODT, TXT) ke PDF. |
| **WebP Tools** (`cwebp`, `dwebp`) | Google LLC | **BSD 3-Clause** | Subprocess CLI independen untuk encoding gambar ke WebP dan decoding WebP ke gambar standar. |
| **ConvertinAja Platform** | Farid Ahmad | **MIT License** | Antarmuka web pengguna (React 19) dan Go Chi HTTP REST API. |

> **Catatan Hukum & Kepatuhan:** ConvertinAja **tidak** melakukan linking statis maupun dinamis dengan pustaka GPL/AGPL di tingkat kode backend Go. Seluruh interaksi dengan Poppler, Ghostscript, dan LibreOffice dilakukan semata-mata melalui eksekusi perintah baris (*external CLI subprocess execution*) dengan argumen string terisolasi (`exec.CommandContext`), mematuhi prinsip *mere aggregation* dan klausul transparansi open-source.

---

## 3. Kebijakan Keamanan & Siklus Berkas (File Lifecycle)

```
[ Pengguna ]
    │
    ▼ 1. Unggah berkas (Maks 10 MB per berkas, maks 10 berkas)
[ Go Chi API Engine ]
    ├── Validasi Magic Bytes & Ekstensi (PDF, JPEG, PNG, WebP, OOXML/ODF)
    ├── Simpan sementara di direktori terisolasi /tmp/convertinaja/jobs/{job_id}/
    │
    ▼ 2. Eksekusi CLI Subprocess (Batas Waktu Maksimal 5 Menit)
[ Poppler / Ghostscript / LibreOffice / cwebp ]
    │
    ▼ 3. Konversi Selesai
[ Pemusnahan Seketika ]
    ├── Berkas mentah unggahan LANGSUNG DIHAPUS dari server (os.Remove)
    └── Berkas hasil siap diunduh secara privat via UUID v4 token
```

- **Ukuran Maksimum:** 10 MB per berkas, maksimum 10 berkas per proses.
- **Batas Waktu Komputasi:** Maksimal 5 menit per proses konversi; proses yang melebihi batas langsung dihentikan oleh sistem.
- **Perlindungan Injeksi:** Tidak ada pemanggilan shell (`sh -c` atau `bash`). Seluruh argumen dikirim sebagai token array terpisah.
