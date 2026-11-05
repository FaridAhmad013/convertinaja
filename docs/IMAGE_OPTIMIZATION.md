# IMAGE OPTIMIZATION SPECIFICATION — ConvertinAja

> Spesifikasi teknis algoritma dan alur kerja fitur Image Tools.

---

## 1. Fitur Image Tools (Phase 2)

| Fitur | Input | Output | Deskripsi |
| :--- | :--- | :--- | :--- |
| **Compress Image** | JPG, PNG, WebP | Format sama | Mengurangi ukuran file via quality reduction + strip EXIF tanpa ubah dimensi. |
| **Resize Image** | JPG, PNG, WebP, AVIF | Format sama | Mengubah dimensi (px / %) dengan aspect ratio lock. Preset: 1920, 1600, 1280, 1080. |
| **Convert Image** | JPG, PNG, WebP, AVIF | Format tujuan | Transcoding antar-format. Menjaga transparency untuk PNG/WebP/AVIF. |
| **Smart Optimize** | JPG, PNG, WebP, AVIF | WebP / AVIF / Asli | Auto-downscale jika > 1920px, strip EXIF, quality 80-85, pilih format paling efisien. |
| **Target File Size** | JPG, PNG, WebP, AVIF | WebP / JPG | Mencapai target ukuran (e.g. 100KB, 300KB, 500KB) via iterasi quality dan scale. |

---

## 2. Algoritma Target File Size

Untuk mencapai target ukuran ($S_{target}$ bytes) tanpa komputasi berlebihan:

1. **Analisis Awal:** Baca ukuran awal $S_0$ dan dimensi $(W, H)$.
2. **Kondisi Lolos:** Jika $S_0 \le S_{target}$, lakukan strip metadata saja (`ponytail: no-op recompression`).
3. **Langkah 1 (Format & Scaling Kasar):**
   - Jika $S_0 > 2 \times S_{target}$ dan $\max(W,H) > 1920$, resize dimensi ke $\max(W,H) = 1920$ atau rasio $\sqrt{S_{target}/S_0}$.
4. **Langkah 2 (Binary Search Kualitas Encoding):**
   - Target format: WebP (atau JPG jika input JPG dan tidak ada transparansi).
   - Interval $Q \in [30, 85]$, batas maksimal 3 kali iterasi encoding.
   - Evaluasi ukuran output. Ambil $Q$ tertinggi yang menghasilkan ukuran $\le S_{target}$.
5. **Fallback:** Jika $Q=30$ masih melebihi $S_{target}$, resize dimensi turun 20% lalu encode ulang pada $Q=60$.

---

## 3. Parameter API (`POST /api/v1/conversions`)

```json
{
  "tool": "image_compress | image_resize | image_convert | image_smart | image_target_size",
  "options": {
    "target_format": "webp",
    "quality": 80,
    "max_width": 1920,
    "max_height": 1080,
    "target_size_kb": 300,
    "strip_metadata": true
  }
}
```
