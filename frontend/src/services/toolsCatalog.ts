import type { ToolDefinition, FileFormat, UploadedFile } from '../types/conversion'

export const AVAILABLE_TOOLS: ToolDefinition[] = [
  // PDF Tools (Phase 1 Priority)
  {
    id: 'merge-pdf',
    name: 'Merge PDF',
    category: 'pdf',
    description: 'Gabungkan beberapa file PDF menjadi satu dokumen berurutan.',
    allowedFormats: ['pdf'],
    minFiles: 2,
    maxFiles: 10,
    outputFormat: 'PDF',
  },
  {
    id: 'split-pdf',
    name: 'Split PDF',
    category: 'pdf',
    description: 'Pisahkan halaman atau rentang halaman tertentu dari dokumen PDF.',
    allowedFormats: ['pdf'],
    minFiles: 1,
    maxFiles: 1,
    outputFormat: 'PDF (ZIP)',
    requiresOptions: true,
    optionsType: 'page_range',
  },
  {
    id: 'compress-pdf',
    name: 'Compress PDF',
    category: 'pdf',
    description: 'Kecilkan ukuran file PDF tanpa mengurangi keterbacaan teks.',
    allowedFormats: ['pdf'],
    minFiles: 1,
    maxFiles: 5,
    outputFormat: 'PDF',
    requiresOptions: true,
    optionsType: 'compression_level',
  },
  {
    id: 'pdf-to-jpg',
    name: 'PDF to JPG',
    category: 'pdf',
    description: 'Ekstrak setiap halaman PDF menjadi gambar format JPG.',
    allowedFormats: ['pdf'],
    minFiles: 1,
    maxFiles: 5,
    outputFormat: 'JPG (ZIP)',
    requiresOptions: true,
    optionsType: 'quality',
  },
  {
    id: 'pdf-to-png',
    name: 'PDF to PNG',
    category: 'pdf',
    description: 'Render halaman PDF menjadi gambar beresolusi tinggi dengan transparansi.',
    allowedFormats: ['pdf'],
    minFiles: 1,
    maxFiles: 5,
    outputFormat: 'PNG (ZIP)',
    requiresOptions: true,
    optionsType: 'quality',
  },
  {
    id: 'pdf-to-txt',
    name: 'PDF to TXT',
    category: 'pdf',
    description: 'Ekstrak teks mentah dari dokumen PDF.',
    allowedFormats: ['pdf'],
    minFiles: 1,
    maxFiles: 5,
    outputFormat: 'TXT',
  },
  {
    id: 'pdf-to-md',
    name: 'PDF to Markdown',
    category: 'pdf',
    description: 'Konversi dan ekstrak isi dokumen PDF ke format Markdown (.md).',
    allowedFormats: ['pdf'],
    minFiles: 1,
    maxFiles: 5,
    outputFormat: 'MD',
  },
  {
    id: 'pdf-to-html',
    name: 'PDF to HTML',
    category: 'pdf',
    description: 'Konversi konten PDF ke dokumen HTML web.',
    allowedFormats: ['pdf'],
    minFiles: 1,
    maxFiles: 3,
    outputFormat: 'HTML',
  },
  {
    id: 'extract-pdf-images',
    name: 'Extract PDF Images',
    category: 'pdf',
    description: 'Ambil semua gambar yang tertanam di dalam dokumen PDF.',
    allowedFormats: ['pdf'],
    minFiles: 1,
    maxFiles: 3,
    outputFormat: 'ZIP',
  },

  // Image Tools (Phase 2 Priority)
  {
    id: 'smart-optimize',
    name: 'Smart Optimize',
    category: 'image',
    description: 'Optimasi gambar otomatis: seimbangkan ketajaman visual HD dan pengurangan ukuran file drastis.',
    descriptionEn: 'Automatic image optimization: balanced HD visual clarity with drastic file size reduction.',
    allowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
    minFiles: 1,
    maxFiles: 10,
    outputFormat: 'WebP / Auto',
    requiresOptions: true,
    optionsType: 'image_optimizer',
  },
  {
    id: 'compress-image',
    name: 'Compress Image',
    category: 'image',
    description: 'Kurangi ukuran file foto secara signifikan dengan target size atau balanced encoding.',
    descriptionEn: 'Significantly reduce photo file size with target size bounds or balanced encoding.',
    allowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
    minFiles: 1,
    maxFiles: 10,
    outputFormat: 'Auto / Sama',
    requiresOptions: true,
    optionsType: 'image_optimizer',
  },
  {
    id: 'resize-image',
    name: 'Resize Image',
    category: 'image',
    description: 'Ubah dimensi foto secara proporsional dengan preset 1920px, 1600px, 1280px, atau kustom.',
    descriptionEn: 'Resize photo dimensions proportionally with presets (1920px, 1600px, 1280px) or custom values.',
    allowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
    minFiles: 1,
    maxFiles: 10,
    outputFormat: 'Auto / Sama',
    requiresOptions: true,
    optionsType: 'image_optimizer',
  },
  {
    id: 'convert-image',
    name: 'Convert Image',
    category: 'image',
    description: 'Ubah format gambar antar JPG, PNG, WebP, dan AVIF dengan transparansi utuh.',
    descriptionEn: 'Transcode formats across JPG, PNG, WebP, and AVIF preserving full alpha transparency.',
    allowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
    minFiles: 1,
    maxFiles: 10,
    outputFormat: 'WebP / JPG / PNG / AVIF',
    requiresOptions: true,
    optionsType: 'image_optimizer',
  },

  // Image Conversion (Phase 2)
  {
    id: 'jpg-to-pdf',
    name: 'JPG to PDF',
    category: 'image',
    description: 'Ubah satu atau banyak gambar JPG menjadi satu dokumen PDF.',
    allowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
    minFiles: 1,
    maxFiles: 10,
    outputFormat: 'PDF',
  },
  {
    id: 'png-to-pdf',
    name: 'PNG to PDF',
    category: 'image',
    description: 'Ubah koleksi gambar PNG menjadi dokumen PDF berkualitas.',
    allowedFormats: ['png', 'jpg', 'jpeg', 'webp'],
    minFiles: 1,
    maxFiles: 10,
    outputFormat: 'PDF',
  },
  {
    id: 'jpg-to-png',
    name: 'JPG to PNG',
    category: 'image',
    description: 'Konversi gambar format JPG ke PNG tanpa kompresi.',
    allowedFormats: ['jpg', 'jpeg'],
    minFiles: 1,
    maxFiles: 10,
    outputFormat: 'PNG',
  },
  {
    id: 'png-to-jpg',
    name: 'PNG to JPG',
    category: 'image',
    description: 'Konversi gambar format PNG ke JPG dengan ukuran lebih ringkas.',
    allowedFormats: ['png'],
    minFiles: 1,
    maxFiles: 10,
    outputFormat: 'JPG',
  },
  {
    id: 'image-to-webp',
    name: 'Image to WebP',
    category: 'image',
    description: 'Optimalkan gambar JPG/PNG ke format WebP untuk web.',
    allowedFormats: ['jpg', 'jpeg', 'png'],
    minFiles: 1,
    maxFiles: 10,
    outputFormat: 'WebP',
  },
  {
    id: 'webp-to-jpg',
    name: 'WebP to JPG',
    category: 'image',
    description: 'Ubah gambar format WebP kembali ke JPG standar.',
    allowedFormats: ['webp'],
    minFiles: 1,
    maxFiles: 10,
    outputFormat: 'JPG',
  },

  // Office Conversion (Phase 3)
  {
    id: 'docx-to-pdf',
    name: 'DOCX to PDF',
    category: 'office',
    description: 'Konversi dokumen Word DOCX ke format PDF yang rapi.',
    allowedFormats: ['docx', 'doc'],
    minFiles: 1,
    maxFiles: 5,
    outputFormat: 'PDF',
  },
  {
    id: 'xlsx-to-pdf',
    name: 'XLSX to PDF',
    category: 'office',
    description: 'Ubah lembar kerja Excel XLSX menjadi dokumen PDF siap cetak.',
    allowedFormats: ['xlsx'],
    minFiles: 1,
    maxFiles: 5,
    outputFormat: 'PDF',
  },
  {
    id: 'pptx-to-pdf',
    name: 'PPTX to PDF',
    category: 'office',
    description: 'Konversi slide presentasi PowerPoint PPTX menjadi PDF.',
    allowedFormats: ['pptx'],
    minFiles: 1,
    maxFiles: 5,
    outputFormat: 'PDF',
  },
  {
    id: 'odt-to-pdf',
    name: 'ODT to PDF',
    category: 'office',
    description: 'Konversi dokumen OpenDocument Text (ODT) ke PDF.',
    allowedFormats: ['odt'],
    minFiles: 1,
    maxFiles: 5,
    outputFormat: 'PDF',
  },
  {
    id: 'txt-to-pdf',
    name: 'TXT to PDF',
    category: 'office',
    description: 'Ubah file teks biasa TXT menjadi dokumen PDF rapi.',
    allowedFormats: ['txt'],
    minFiles: 1,
    maxFiles: 5,
    outputFormat: 'PDF',
  },
]

export function detectFileFormat(file: File): FileFormat {
  const ext = file.name.split('.').pop()?.toLowerCase() || ''
  const mime = file.type.toLowerCase()

  if (ext === 'pdf' || mime === 'application/pdf') return 'pdf'
  if (ext === 'jpg' || ext === 'jpeg' || mime === 'image/jpeg') return 'jpg'
  if (ext === 'png' || mime === 'image/png') return 'png'
  if (ext === 'webp' || mime === 'image/webp') return 'webp'
  if (ext === 'docx' || mime.includes('wordprocessingml.document')) return 'docx'
  if (ext === 'doc' || mime === 'application/msword') return 'doc'
  if (ext === 'xlsx' || mime.includes('spreadsheetml.sheet')) return 'xlsx'
  if (ext === 'pptx' || mime.includes('presentationml.presentation')) return 'pptx'
  if (ext === 'odt' || mime.includes('opendocument.text')) return 'odt'
  if (ext === 'txt' || mime === 'text/plain') return 'txt'

  return 'unknown'
}

export function validateUploadedFile(file: File): { isValid: boolean; errorMessage?: string; format: FileFormat } {
  const format = detectFileFormat(file)
  
  if (format === 'unknown') {
    return {
      isValid: false,
      errorMessage: 'Format file tidak didukung.',
      format,
    }
  }

  // Size constraints: Max 10MB per file to keep processing lightweight
  const maxBytes = 10 * 1024 * 1024

  if (file.size > maxBytes) {
    return {
      isValid: false,
      errorMessage: 'Ukuran file melebihi batas 10 MB.',
      format,
    }
  }

  return { isValid: true, format }
}

export function getCompatibleTools(files: UploadedFile[]): ToolDefinition[] {
  const validFiles = files.filter((f) => f.isValid)
  if (validFiles.length === 0) return []

  const count = validFiles.length

  // Filter tools that accept every file format in the uploaded list
  return AVAILABLE_TOOLS.filter((tool) => {
    // Check count constraint
    if (count < tool.minFiles || count > tool.maxFiles) {
      return false
    }

    // Every file format must be present in the tool's allowed formats
    const allCompatible = validFiles.every((f) => tool.allowedFormats.includes(f.format))
    return allCompatible
  })
}
