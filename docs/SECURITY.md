# SECURITY GUIDELINES — ConvertinAja

> Kebijakan Keamanan, Pemusnahan Berkas, dan Batasan Sistem

---

## 1. Kebijakan Nol Penyimpanan (Zero-Storage Policy)

ConvertinAja dirancang dengan arsitektur efemeral yang memprioritaskan privasi penuh:
- **Pemusnahan Berkas Seketika:** Berkas mentah yang diunggah pengguna langsung dihapus seketika dari server (`os.Remove`) tepat setelah proses konversi selesai atau mengalami kegagalan.
- **Isolasi Berkas:** Setiap sesi diproses dalam direktori terisolasi berbasis UUID acak (`/tmp/convertinaja/jobs/{job_id}/`).
- **Pembersihan Darurat (Fail-safe Sweep):** Sistem pembersih otomatis menyapu direktori efemeral secara berkala semata-mata sebagai jaring pengaman skenario kegagalan sistem agar tidak ada berkas tertinggal di server.

---

## 2. Batas Waktu & Pengendalian Sumber Daya Server (5-Minute Hard Cap)

- **Batas Maksimal Eksekusi:** Seluruh proses konversi dibatasi waktu maksimum **5 menit (300 detik)** menggunakan `context.WithTimeout`.
- **Penghentian Paksa:** Jika dokumen terlalu kompleks atau biner konversi mengalami proses menggantung yang melebihi batas 5 menit, proses akan dihentikan paksa dan direktori kerja langsung dimusnahkan untuk menjaga stabilitas memori server.
- **Batas Ukuran & Batch:** Maksimal 10 MB per berkas, maksimal 10 berkas per proses unggahan.
- **Batas Halaman:** Maksimal 200 halaman per berkas PDF.

---

## 3. Sandboxing & Pencegahan Eksekusi Berbahaya

1. **Inspeksi Magic Bytes:** Memeriksa 512 byte pertama untuk memastikan berkas sesuai header asli (PDF `%PDF-`, PNG, JPEG, WebP, OOXML/ODF) sebelum diproses.
2. **Pencegahan Command Injection:** Semua pemanggilan engine biner (Poppler `pdftoppm`, Ghostscript `gs`, LibreOffice `soffice`, `cwebp`) dipanggil sebagai token slice terpisah tanpa shell interpreter (`sh -c`).
3. **Hak Akses Rendah (Least Privilege):** Biner API dan worker dijalankan menggunakan non-root user (`UID 10001` / `appuser`) di dalam container Docker.
