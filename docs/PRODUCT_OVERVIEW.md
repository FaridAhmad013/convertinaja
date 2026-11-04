# PRODUCT OVERVIEW — ConvertinAja

> All your document conversions in one place.

ConvertinAja adalah platform konversi dokumen berbasis web yang memungkinkan pengguna mengubah berbagai format berkas secara praktis, cepat, dan gratis tanpa perlu registrasi akun, tanpa profiling, dan dengan jaminan pemusnahan berkas seketika di server.

---

## 1. Identitas Produk

| Atribut | Keterangan |
| :--- | :--- |
| **Nama Produk** | ConvertinAja |
| **Domain Resmi** | `https://convertinaja.faridahmad.dev` |
| **Model Layanan** | Gratis, Tanpa Akun (Sesi Anonim Efemeral) |
| **Pengembang** | Farid Ahmad (`https://faridahmad.dev`) |
| **Lisensi Kode** | MIT License (Open-Source) |

---

## 2. Prinsip Nol-Penyimpanan & Keamanan Server

1. **Pemusnahan Seketika di Sisi Server (Zero Data Retention):**  
   Server ConvertinAja tidak menyimpan arsip dokumen. Begitu proses konversi selesai (berhasil maupun gagal), berkas asli yang diunggah pengguna langsung dihapus permanen dari sistem (`os.Remove`).
2. **Tanpa Akun & Tanpa Database Pengguna:**  
   Tidak ada basis data pengguna, kata sandi, maupun cookie penelusuran identitas. Akses unduhan dikunci menggunakan token acak berumur pendek (UUID v4).
3. **Batas Eksekusi 5 Menit (Hard Resource Ceiling):**  
   Untuk menjaga ketersediaan sumber daya server VPS dan mencegah proses macet, batas waktu maksimal eksekusi adalah 5 menit. Proses konversi yang berjalan lebih dari 5 menit akan otomatis dibatalkan paksa oleh sistem.
4. **Kepatuhan Open-Source:**  
   ConvertinAja dibangun di atas orkestrasi mesin sumber terbuka terpercaya (Poppler, Ghostscript, LibreOffice, WebP Tools) yang dijalankan melalui proses terpisah (CLI subprocess) dengan atribusi lisensi yang jelas dan transparan.

---

## 3. Cakupan Fitur Alat Konversi

- **Alat PDF:** Merge PDF, Split PDF, Compress PDF, PDF to JPG, PDF to PNG, PDF to TXT, PDF to Markdown, PDF to HTML, Extract PDF Images.
- **Alat Gambar:** JPG to PNG, PNG to JPG, Image to WebP, WebP to JPG, WebP to PNG, JPG/PNG to PDF.
- **Alat Office Dokumen:** DOCX to PDF, XLSX to PDF, PPTX to PDF, ODT to PDF, TXT to PDF.
