import { useState, useEffect, createContext, useContext } from 'react'

export type Language = 'id' | 'en'

export interface Translations {
  nav: {
    tools: string
    howItWorks: string
    history: string
    changeLang: string
  }
  hero: {
    badge: string
    title: string
    subtitle: string
  }
  upload: {
    dropTitle: string
    dropSubtitle: string
    chooseButton: string
    maxLimits: string
    privacyNotice: string
  }
  popular: {
    title: string
    pdfConverter: string
    pdfConverterDesc: string
    imageConverter: string
    imageConverterDesc: string
    compressPdf: string
    compressPdfDesc: string
    mergePdf: string
    mergePdfDesc: string
  }
  files: {
    title: string
    validBadge: (valid: number, total: number) => string
    addMore: string
    ready: string
    remove: string
  }
  selector: {
    chooseOperation: string
    toolsAvailable: (n: number) => string
    output: string
    optionsTitle: (name: string) => string
    qualityLabel: string
    bestQuality: string
    bestQualitySub: string
    bestBadge: string
    standardQuality: string
    standardQualitySub: string
    ultraQuality: string
    ultraQualitySub: string
    compressionLabel: string
    compRecommended: string
    compRecommendedSub: string
    compLow: string
    compLowSub: string
    compHigh: string
    compHighSub: string
    pageRangeLabel: string
    pageRangePlaceholder: string
    privacyText: (n: number) => string
    convertButton: string
    processingButton: string
    unsupportedComb: string
    unsupportedCombDesc: string
  }
  status: {
    uploading: string
    validating: string
    queued: string
    processing: string
    completed: string
    failed: string
    completedSub: string
    processingSub: string
    downloadButton: string
    downloadZipButton: string
    retentionNotice: string
    purgeNow: string
    purgedSuccess: string
    convertAgain: string
  }
  history: {
    title: string
    subtitle: string
    empty: string
    clearAll: string
    download: string
    expired: string
  }
  catalog: {
    title: string
    subtitle: string
    allTools: string
    pdfTools: string
    imageTools: string
    officeTools: string
    useTool: string
  }
  howItWorks: {
    title: string
    subtitle: string
    step1Title: string
    step1Desc: string
    step2Title: string
    step2Desc: string
    step3Title: string
    step3Desc: string
  }
  footer: {
    tagline: string
    privacyGuaranteed: string
    openSource: string
  }
}

export const translations: Record<Language, Translations> = {
  id: {
    nav: {
      tools: 'Peralatan',
      howItWorks: 'Cara Kerja',
      history: 'Riwayat Konversi',
      changeLang: 'Ganti Bahasa',
    },
    hero: {
      badge: 'KONVERSI BERKAS PRAKTIS',
      title: 'Ubah berkas Anda. Cepat dan bebas ribet.',
      subtitle: 'Semua alat konversi dokumen, gambar, dan PDF dalam satu tempat. 100% gratis tanpa perlu daftar akun.',
    },
    upload: {
      dropTitle: 'Tarik & letakkan berkas Anda ke sini',
      dropSubtitle: 'atau klik untuk memilih dari perangkat',
      chooseButton: 'Pilih Berkas',
      maxLimits: 'Mendukung PDF, JPG, PNG, WEBP, DOCX, XLSX, PPTX hingga 50 MB',
      privacyNotice: 'Privasi Terjamin: Berkas diproses di memori sementara dan dihapus permanen dalam 60 menit.',
    },
    popular: {
      title: 'Peralatan Populer',
      pdfConverter: 'PDF ke Gambar (JPG/PNG)',
      pdfConverterDesc: 'Render halaman PDF menjadi gambar resolusi tinggi',
      imageConverter: 'Gambar ke PDF',
      imageConverterDesc: 'Gabungkan foto JPG/PNG menjadi satu berkas PDF',
      compressPdf: 'Kompres PDF',
      compressPdfDesc: 'Kecilkan ukuran berkas PDF dengan tetap tajam',
      mergePdf: 'Gabung PDF (Merge)',
      mergePdfDesc: 'Satukan beberapa berkas PDF menjadi satu urutan',
    },
    files: {
      title: 'Daftar Berkas Terunggah',
      validBadge: (v, t) => `${v} dari ${t} siap diproses`,
      addMore: 'Tambah Berkas',
      ready: 'Siap',
      remove: 'Hapus berkas ini',
    },
    selector: {
      chooseOperation: 'Pilih Operasi Konversi',
      toolsAvailable: (n) => `${n} alat konversi cocok`,
      output: 'Output:',
      optionsTitle: (name) => `Pengaturan: ${name}`,
      qualityLabel: 'Pilih Kualitas Gambar (DPI):',
      bestQuality: 'Kualitas Terbaik (HD)',
      bestQualitySub: '300 DPI — Sangat tajam untuk cetak & teks',
      bestBadge: 'Default',
      standardQuality: 'Standar (Web)',
      standardQualitySub: '150 DPI — Ukuran file lebih hemat',
      ultraQuality: 'Ultra HD',
      ultraQualitySub: '600 DPI — Detail mikroskopis arsip',
      compressionLabel: 'Pilih Tingkat Kompresi:',
      compRecommended: 'Rekomendasi',
      compRecommendedSub: 'Seimbang (ukuran berkurang signifikan)',
      compLow: 'Kompresi Rendah',
      compLowSub: 'Kualitas tertinggi (300 DPI)',
      compHigh: 'Kompresi Tinggi',
      compHighSub: 'Ukuran paling kecil (72 DPI)',
      pageRangeLabel: 'Rentang Halaman (contoh: "1-5", "1,3,7", atau "all"):',
      pageRangePlaceholder: 'all',
      privacyText: (n) => `${n} berkas dipilih • Dihapus permanen dalam 60 menit`,
      convertButton: 'Mulai Konversi Sekarang',
      processingButton: 'Sedang Mengonversi...',
      unsupportedComb: 'Kombinasi Berkas Belum Didukung',
      unsupportedCombDesc: 'Format atau jumlah berkas belum memiliki operasi yang cocok. Pastikan berkas seragam.',
    },
    status: {
      uploading: 'Mengunggah berkas ke server...',
      validating: 'Memeriksa keamanan dan format berkas...',
      queued: 'Masuk dalam antrean pemrosesan...',
      processing: 'Sedang memproses dengan kualitas tinggi...',
      completed: 'Konversi Berhasil Selesai!',
      failed: 'Konversi Gagal',
      completedSub: 'Berkas Anda selesai diproses dengan kualitas terbaik dan siap diunduh.',
      processingSub: 'Mohon tunggu sejenak, sistem sedang menjalankan operasi konversi.',
      downloadButton: 'Unduh Hasil Konversi',
      downloadZipButton: 'Unduh Semua (.zip)',
      retentionNotice: 'Berkas akan otomatis dihapus permanen oleh sistem dalam 60 menit.',
      purgeNow: 'Hapus dari Server Sekarang',
      purgedSuccess: 'Berkas berhasil dihapus permanen dari server!',
      convertAgain: 'Konversi Dokumen Lain',
    },
    history: {
      title: 'Riwayat Konversi Lokal',
      subtitle: 'Tersimpan hanya di perangkat/browser Anda untuk privasi total. Tidak pernah dikirim ke database publik.',
      empty: 'Belum ada riwayat konversi di browser ini.',
      clearAll: 'Bersihkan Riwayat Lokal',
      download: 'Unduh',
      expired: 'Kedaluwarsa',
    },
    catalog: {
      title: 'Jelajahi Beragam Peralatan Konversi',
      subtitle: 'Semua fitur gratis, tanpa registrasi, tanpa batasan langganan berbayar.',
      allTools: 'Semua Alat',
      pdfTools: 'Alat PDF',
      imageTools: 'Alat Gambar',
      officeTools: 'Alat Dokumen',
      useTool: 'Gunakan Alat',
    },
    howItWorks: {
      title: 'Bagaimana Cara Kerjanya?',
      subtitle: 'Tiga langkah cepat tanpa perlu registrasi akun sama sekali.',
      step1Title: '1. Unggah Berkas',
      step1Desc: 'Pilih atau seret berkas Anda ke zona unggah. Sistem otomatis mengenali format dan batas ukuran.',
      step2Title: '2. Sesuaikan Pengaturan',
      step2Desc: 'Pilih operasi konversi dan opsi kualitas (HD 300 DPI default).',
      step3Title: '3. Unduh & Aman',
      step3Desc: 'Unduh langsung hasilnya. Berkas otomatis terhapus permanen dalam 60 menit atau hapus langsung seketika.',
    },
    footer: {
      tagline: 'Platform konversi dokumen gratis, open-source, dan mengutamakan privasi Anda.',
      privacyGuaranteed: 'Zero-Tracking • Hapus Otomatis 60 Menit • Tanpa Akun',
      openSource: 'Proyek Open-Source',
    },
  },
  en: {
    nav: {
      tools: 'Tools',
      howItWorks: 'How it works',
      history: 'Recent History',
      changeLang: 'Change Language',
    },
    hero: {
      badge: 'SIMPLE FILE CONVERSION',
      title: 'Convert your files. Simply and quickly.',
      subtitle: 'All your document, image, and PDF conversion tools in one place. 100% free with no account required.',
    },
    upload: {
      dropTitle: 'Drop your files here',
      dropSubtitle: 'or click to browse from device',
      chooseButton: 'Choose Files',
      maxLimits: 'Supports PDF, JPG, PNG, WEBP, DOCX, XLSX, PPTX up to 50 MB',
      privacyNotice: 'Privacy Guaranteed: Files are processed in ephemeral storage and auto-deleted in 60 minutes.',
    },
    popular: {
      title: 'Popular tools',
      pdfConverter: 'PDF to Image (JPG/PNG)',
      pdfConverterDesc: 'Render PDF pages into high-resolution images',
      imageConverter: 'Image to PDF',
      imageConverterDesc: 'Bundle JPG/PNG images into a single PDF',
      compressPdf: 'Compress PDF',
      compressPdfDesc: 'Reduce PDF file size while maintaining clarity',
      mergePdf: 'Merge PDF',
      mergePdfDesc: 'Combine multiple PDF files into one ordered document',
    },
    files: {
      title: 'Uploaded Files',
      validBadge: (v, t) => `${v} of ${t} ready`,
      addMore: 'Add More Files',
      ready: 'Ready',
      remove: 'Remove this file',
    },
    selector: {
      chooseOperation: 'Select Conversion Tool',
      toolsAvailable: (n) => `${n} tools available`,
      output: 'Output:',
      optionsTitle: (name) => `Options: ${name}`,
      qualityLabel: 'Image Quality (DPI Resolution):',
      bestQuality: 'Best Quality (HD)',
      bestQualitySub: '300 DPI — Crisp text for printing (Default)',
      bestBadge: 'Default',
      standardQuality: 'Standard (Web)',
      standardQualitySub: '150 DPI — Smaller file size',
      ultraQuality: 'Ultra HD',
      ultraQualitySub: '600 DPI — Archival micro details',
      compressionLabel: 'Document Compression Level:',
      compRecommended: 'Recommended',
      compRecommendedSub: 'Balanced quality and size reduction',
      compLow: 'Low Compression',
      compLowSub: 'Highest print quality (300 DPI)',
      compHigh: 'Extreme Compression',
      compHighSub: 'Smallest file size (72 DPI)',
      pageRangeLabel: 'Page Range (e.g. "1-5", "1,3,7", or "all"):',
      pageRangePlaceholder: 'all',
      privacyText: (n) => `${n} files selected • Permanently purged after 60 min`,
      convertButton: 'Convert Now',
      processingButton: 'Converting...',
      unsupportedComb: 'Unsupported File Combination',
      unsupportedCombDesc: 'The uploaded file formats do not match a common operation. Please upload uniform types.',
    },
    status: {
      uploading: 'Uploading files to server...',
      validating: 'Verifying file integrity and format...',
      queued: 'Queued for processing...',
      processing: 'Converting with high fidelity...',
      completed: 'Conversion Completed!',
      failed: 'Conversion Failed',
      completedSub: 'Your document was processed with maximum quality and is ready for download.',
      processingSub: 'Please wait a moment while the conversion engine finishes.',
      downloadButton: 'Download Converted File',
      downloadZipButton: 'Download All (.zip)',
      retentionNotice: 'Files are automatically deleted from server memory within 60 minutes.',
      purgeNow: 'Delete from Server Now',
      purgedSuccess: 'File permanently deleted from server!',
      convertAgain: 'Convert Another File',
    },
    history: {
      title: 'Local Conversion History',
      subtitle: 'Stored exclusively in your local browser for maximum privacy. Never sent to an external server.',
      empty: 'No conversion history on this device yet.',
      clearAll: 'Clear Local History',
      download: 'Download',
      expired: 'Expired',
    },
    catalog: {
      title: 'Explore All Conversion Tools',
      subtitle: 'All tools are free, registration-free, with no paid subscription traps.',
      allTools: 'All Tools',
      pdfTools: 'PDF Tools',
      imageTools: 'Image Tools',
      officeTools: 'Office Tools',
      useTool: 'Use Tool',
    },
    howItWorks: {
      title: 'How It Works',
      subtitle: 'Three simple steps without creating any account.',
      step1Title: '1. Upload Files',
      step1Desc: 'Drop your files into the upload area. Format and size constraints are verified instantly.',
      step2Title: '2. Configure & Options',
      step2Desc: 'Select your target tool and quality resolution (300 DPI HD default).',
      step3Title: '3. Download & Secure',
      step3Desc: 'Download the result immediately. Files are permanently wiped after 60 minutes or on demand.',
    },
    footer: {
      tagline: 'An open-source, privacy-focused document conversion platform.',
      privacyGuaranteed: 'Zero Tracking • 60-Min Auto Delete • No Accounts',
      openSource: 'Open-Source Project',
    },
  },
}

function detectDefaultLanguage(): Language {
  if (typeof window === 'undefined') return 'en'
  const saved = localStorage.getItem('convertinaja_lang')
  if (saved === 'id' || saved === 'en') return saved
  const browserLang = (navigator.language || '').toLowerCase()
  return browserLang.startsWith('id') ? 'id' : 'en'
}

interface I18nContextType {
  lang: Language
  setLang: (lang: Language) => void
  t: Translations
}

export const I18nContext = createContext<I18nContextType>({
  lang: 'en',
  setLang: () => {},
  t: translations.en,
})

export function useI18n() {
  return useContext(I18nContext)
}

export function useI18nState() {
  const [lang, setLangState] = useState<Language>(detectDefaultLanguage)

  useEffect(() => {
    localStorage.setItem('convertinaja_lang', lang)
  }, [lang])

  const setLang = (newLang: Language) => {
    setLangState(newLang)
  }

  return {
    lang,
    setLang,
    t: translations[lang],
  }
}
