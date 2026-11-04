# ConvertinAja

> **Platform Konversi Dokumen Cepat, Gratis & Nol Penyimpanan.**  
> Ubah format PDF, Gambar, dan Office langsung dari peramban tanpa akun, tanpa pelacakan, dan dengan pemusnahan berkas seketika di server.

- **Website Resmi:** [https://convertinaja.faridahmad.dev](https://convertinaja.faridahmad.dev)  
- **Pengembang:** [Farid Ahmad](https://faridahmad.dev)

---

## Nilai Utama ConvertinAja

1. **Nol Penyimpanan (Zero-Storage Guarantee):**  
   Server ConvertinAja tidak menyimpan file Anda. Berkas asli yang diunggah langsung dihapus seketika dari server saat konversi selesai atau gagal. Berkas hasil hanya berada sementara di memori server dan dihapus otomatis setelah diunduh.
2. **Tanpa Pendaftaran Akun:**  
   Tidak ada pembuatan akun, pengumpulan email, kata sandi, maupun profiling pengguna. Sesi anonim diamankan menggunakan token acak berumur pendek (UUID v4).
3. **Batas Eksekusi Aman (Maksimal 5 Menit):**  
   Untuk menjaga ketersediaan sumber daya server, proses konversi memiliki batas waktu ketat maksimal 5 menit sebelum dihentikan otomatis oleh sistem.
4. **Kualitas Tinggi 300 DPI:**  
   Rendering dokumen PDF ke format gambar (JPG/PNG) menghasilkan visual beresolusi tinggi yang tajam dan siap cetak.
5. **Open Source & Terbuka:**  
   Seluruh kode platform dilisensikan di bawah lisensi MIT.

---

## Mesin Konversi & Atribusi Lisensi Open-Source

ConvertinAja dibangun sebagai antarmuka orkestrasi web independen dan menghormati hak cipta perangkat lunak sumber terbuka:

- **[Poppler Utilities](https://poppler.freedesktop.org/)** (`pdftoppm`, `pdfunite`, `pdfseparate`, `pdftotext`, `pdfimages`) — Lisensi GPLv2 / GPLv3. Dijalankan sebagai proses CLI independen tanpa modifikasi biner.
- **[Ghostscript](https://www.ghostscript.com/)** (`gs`) — Hak Cipta Artifex Software, Inc. (Lisensi AGPLv3). Digunakan sebagai CLI subprocess untuk kompresi ukuran PDF.
- **[LibreOffice Headless](https://www.libreoffice.org/)** (`soffice`) — Lisensi MPL-2.0 / LGPLv3+. Digunakan untuk konversi dokumen Office (Word, Excel, PowerPoint, ODT) ke PDF.
- **[WebP Tools](https://chromium.googlesource.com/webm/libwebp)** (`cwebp`, `dwebp`) — Hak Cipta Google LLC (Lisensi BSD). Digunakan untuk encoding dan decoding gambar WebP.

---

## Fitur Alat Konversi

- **Alat PDF:** Gabung PDF, Pisah PDF, Kompres PDF, PDF ke JPG, PDF ke PNG, PDF ke Teks, PDF ke Markdown, PDF ke HTML, Ekstrak Gambar PDF.
- **Alat Gambar:** JPG ke PNG, PNG ke JPG, Gambar ke WebP, WebP ke JPG, WebP ke PNG, JPG/PNG ke PDF.
- **Alat Office Dokumen:** DOCX ke PDF, XLSX ke PDF, PPTX ke PDF, ODT ke PDF, TXT ke PDF.

---

## Lisensi

Kode ConvertinAja dilisensikan di bawah [MIT License](LICENSE).
