# IMAGE ENGINE SPECIFICATION — ConvertinAja

> Konfigurasi libvips CLI dan eksekusi subprocess.

---

## 1. Engine Rationale

- **Engine:** `libvips-tools` (`vips`, `vipsthumbnail`).
- **Alasan:**
  1. Eksekusi CLI via `os/exec` tanpa CGO (`CGO_ENABLED=0` tetap valid untuk Go binary).
  2. Jauh lebih hemat RAM (streaming architecture) dan lebih cepat dibanding ImageMagick.
  3. Dukungan native format: JPEG (`libjpeg-turbo`), PNG, WebP, AVIF (`libheif`).

---

## 2. CLI Invocation Patterns

### A. Convert & Quality Tuning
```bash
# JPEG to WebP dengan quality 80 dan strip metadata
vips copy input.jpg output.webp[Q=80,strip=true]

# Any to AVIF dengan quality 70
vips copy input.png output.avif[Q=70,strip=true]

# JPEG Compression (strip EXIF + quality reduction)
vips copy input.jpg output.jpg[Q=75,strip=true,optimize_coding=true]
```

### B. Resize / Thumbnailing (Preserve Aspect Ratio)
```bash
# Resize ke max bounding box 1920x1080 tanpa distorsi
vipsthumbnail input.jpg --size 1920x1080 -o output.webp[Q=80,strip=true]
```

---

## 3. Sandboxing & Resource Limits

1. **Timeout:** Maksimal 30 detik per subprocess image.
2. **Memory Limit:** Env `VIPS_CONCURRENCY=2` dan `VIPS_DISC_THRESHOLD=50m` untuk mencegah spike memori container.
3. **Validasi Input:**
   - Magic byte header (`image/jpeg`, `image/png`, `image/webp`).
   - Max file size: 50MB.
   - Max dimension: 10000x10000 px.
