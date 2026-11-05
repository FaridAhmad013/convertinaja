import type React from 'react'
import { useState, useEffect, createContext, useContext } from 'react'

export type Language = 'id' | 'en'

export interface Translations {
  nav: {
    tools: string
    howItWorks: string
    privacy: string
    terms: string
    creator: string
    changeLang: string
  }
  hero: {
    badge: string
    title: string
    subtitle: string
    freeBadge: string
    supportCreator: string
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
    smartOptimize: string
    smartOptimizeDesc: string
    compressImage: string
    compressImageDesc: string
    compressPdf: string
    compressPdfDesc: string
    imageConverter: string
    imageConverterDesc: string
    pdfConverter: string
    pdfConverterDesc: string
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
    // Image Optimizer Strings
    targetSizeTitle: string
    targetSizeAuto: string
    targetSizeCustom: string
    targetSizePlaceholder: string
    advancedSettingsShow: string
    advancedSettingsHide: string
    resizeResolutionLabel: string
    resizeOriginal: string
    resizeCustom: string
    resizePlaceholder: string
    longestSideUnit: string
    outputFormatLabel: string
    optAuto: string
    optWebp: string
    optJpeg: string
    optPng: string
    optAvif: string
    strategyLabel: string
    stratBalanced: string
    stratVisualHQ: string
    stratAggressive: string
    stripMetadataLabel: string
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
    // Image status strings
    imageResultTitle: string
    targetReached: string
    hdOptimal: string
    beforeLabel: string
    afterLabel: string
    savedLabel: string
    reducedPercent: (n: number) => string
    fasterLoad: string
    convertOtherFormat: string
    convertResultFile: string
    downloadSelected: (n: number, isZip: boolean) => string
    selectedCount: (selected: number, total: number) => string
    selectAll: string
    deselectAll: string
    pageLabel: (page: number) => string
    previewButton: string
    downloadSingle: string
  }
  imageComparison: {
    privacyTitle: string
    cleanBadge: string
    privacyDesc: string
    viewDetails: string
    hideDetails: string
    noticeSafe: string
    sliderHint: string
    sideBySideHint: string
    splitSlider: string
    sideBySide: string
    beforeHeading: string
    afterHeading: string
    beforeBadge: (size: string) => string
    afterBadge: (size: string) => string
    gpsCategory: string
    gpsCoord: string
    altitude: string
    accuracy: string
    cameraCategory: string
    cameraModel: string
    aperture: string
    focalLength: string
    timeCategory: string
    captureTime: string
    softwareOS: string
    serialID: string
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
      privacy: 'Privasi',
      terms: 'Ketentuan',
      creator: 'Farid Ahmad',
      changeLang: 'Ganti Bahasa',
    },
    hero: {
      badge: 'KONVERSI & OPTIMASI BERKAS CEPAT',
      title: 'Ubah dan kompres berkas Anda. Cepat & bebas ribet.',
      subtitle: 'Semua alat konversi dokumen, kompresi gambar, dan PDF dalam satu tempat. 100% gratis tanpa perlu registrasi.',
      freeBadge: 'Gratis tanpa batasan biaya atau langganan',
      supportCreator: 'Dukung kreator dengan berbagi platform ini',
    },
    upload: {
      dropTitle: 'Tarik & letakkan berkas Anda ke sini',
      dropSubtitle: 'atau klik untuk memilih dari perangkat',
      chooseButton: 'Pilih Berkas',
      maxLimits: 'Mendukung PDF, JPG, PNG, WEBP, DOCX, XLSX, PPTX hingga 10 MB (Maks. 10 berkas)',
      privacyNotice: 'Privasi Terjamin: Berkas sumber Anda dimusnahkan seketika setelah diproses.',
    },
    popular: {
      title: 'Peralatan Populer',
      smartOptimize: 'Optimasi Gambar Cerdas',
      smartOptimizeDesc: 'Kompres & pertahankan ketajaman visual HD secara otomatis',
      compressImage: 'Kompres Gambar (Target Ukuran)',
      compressImageDesc: 'Kecilkan ukuran file foto ke batas tertentu (≤ 100KB, 300KB, dsb.)',
      imageConverter: 'Gambar ke PDF',
      imageConverterDesc: 'Gabungkan foto JPG/PNG menjadi satu berkas PDF rapi',
      compressPdf: 'Kompres PDF',
      compressPdfDesc: 'Kecilkan ukuran berkas PDF dengan tetap tajam',
      pdfConverter: 'PDF ke Gambar (JPG/PNG)',
      pdfConverterDesc: 'Render halaman PDF menjadi gambar resolusi tinggi',
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
      privacyText: (n) => `${n} berkas dipilih • Zero-Storage (Dimusnahkan Langsung)`,
      convertButton: 'Mulai Konversi Sekarang',
      processingButton: 'Sedang Mengonversi...',
      unsupportedComb: 'Kombinasi Berkas Belum Didukung',
      unsupportedCombDesc: 'Format atau jumlah berkas belum memiliki operasi yang cocok. Pastikan berkas seragam.',
      targetSizeTitle: 'Target Ukuran File (Opsional)',
      targetSizeAuto: 'Bebas / Otomatis',
      targetSizeCustom: 'Kustom',
      targetSizePlaceholder: 'Contoh: 300',
      advancedSettingsShow: 'Tampilkan Pengaturan Lanjutan (Dimensi, Format, Kualitas)',
      advancedSettingsHide: 'Sembunyikan Pengaturan Lanjutan',
      resizeResolutionLabel: 'Batas Resolusi Maksimal (Rasio Aspek Terjaga)',
      resizeOriginal: 'Asli',
      resizeCustom: 'Kustom px',
      resizePlaceholder: 'Maksimal px',
      longestSideUnit: 'piksel sisi terpanjang',
      outputFormatLabel: 'Format Output',
      optAuto: 'Otomatis (Paling Ringan & Efisien)',
      optWebp: 'WebP (Modern, Ringan, Transparan)',
      optJpeg: 'JPEG (Universal Foto)',
      optPng: 'PNG (Tanpa Kompresi Lossy)',
      optAvif: 'AVIF (Ultra Kompresi Terbaru)',
      strategyLabel: 'Strategi Kualitas Visual',
      stratBalanced: 'Seimbang (Kualitas HD & Hemat Ukuran)',
      stratVisualHQ: 'Kualitas Tinggi (Prioritaskan Ketajaman)',
      stratAggressive: 'Kompresi Maksimal (Ukuran Terkecil)',
      stripMetadataLabel: 'Hapus metadata EXIF & lokasi GPS untuk menghemat ukuran dan melindungi privasi',
    },
    status: {
      uploading: 'Mengunggah berkas ke server...',
      validating: 'Memeriksa keamanan dan format berkas...',
      queued: 'Masuk dalam antrean pemrosesan...',
      processing: 'Sedang memproses dengan kualitas tinggi...',
      completed: 'Konversi Berhasil Selesai!',
      failed: 'Konversi Gagal',
      completedSub: 'Dokumen Anda selesai diproses. Berkas sumber langsung dimusnahkan dari server demi privasi Anda.',
      processingSub: 'Mohon tunggu sejenak, sistem sedang menjalankan operasi konversi.',
      downloadButton: 'Unduh Hasil Konversi',
      downloadZipButton: 'Unduh Semua (.zip)',
      retentionNotice: 'Berkas sumber dimusnahkan seketika dari server. Privasi Anda terjaga sepenuhnya.',
      purgeNow: 'Hapus dari Server Sekarang',
      purgedSuccess: 'Berkas telah berhasil dimusnahkan permanen dari server!',
      convertAgain: 'Konversi Dokumen Lain',
      imageResultTitle: 'Hasil Optimasi Gambar',
      targetReached: 'Target Tercapai',
      hdOptimal: 'Kualitas HD Optimal',
      beforeLabel: 'Sebelum',
      afterLabel: 'Sesudah (Optimasi)',
      savedLabel: 'Total Hemat Ukuran',
      reducedPercent: (n) => `Berkurang ${n}%`,
      fasterLoad: 'Waktu muat lebih cepat',
      convertOtherFormat: 'Ubah Format Lain',
      convertResultFile: 'Lanjut Konversi Hasil',
      downloadSelected: (n, isZip) => `Unduh Terpilih (${n}${isZip ? ' .ZIP' : ''})`,
      selectedCount: (s, t) => `${s} / ${t} dipilih`,
      selectAll: 'Pilih Semua',
      deselectAll: 'Batal Pilih Semua',
      pageLabel: (p) => `Halaman ${p}`,
      previewButton: 'Pratinjau',
      downloadSingle: 'Unduh',
    },
    imageComparison: {
      privacyTitle: 'Privasi Terlindungi: EXIF & GPS Dihapus',
      cleanBadge: 'Bersih 100%',
      privacyDesc: 'Informasi lokasi GPS, jenis kamera, dan identitas perangkat telah dimusnahkan.',
      viewDetails: 'Lihat Detail',
      hideDetails: 'Tutup Detail',
      noticeSafe: 'File output aman untuk dibagikan di internet tanpa meninggalkan jejak lokasi sensitif.',
      sliderHint: 'Geser pembatas di tengah untuk membandingkan ketajaman visual',
      sideBySideHint: 'Tampilan berdampingan untuk evaluasi warna & kontras',
      splitSlider: 'Bilah Geser (Split)',
      sideBySide: 'Berdampingan',
      beforeHeading: 'Sebelum (Asli)',
      afterHeading: 'Sesudah (Optimasi Cerdas)',
      beforeBadge: (size) => `Sebelum: ${size}`,
      afterBadge: (size) => `Sesudah: ${size}`,
      gpsCategory: 'Lokasi & GPS',
      gpsCoord: 'Koordinat GPS',
      altitude: 'Ketinggian (Altitude)',
      accuracy: 'Akurasi GPS',
      cameraCategory: 'Identitas Perangkat & Lensa',
      cameraModel: 'Model Kamera',
      aperture: 'Bukaan (Aperture)',
      focalLength: 'Panjang Fokus',
      timeCategory: 'Waktu & Perangkat Lunak',
      captureTime: 'Waktu Pengambilan',
      softwareOS: 'Software / OS',
      serialID: 'Serial ID File',
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
      step3Title: '3. Unduh & Langsung Bersih',
      step3Desc: 'Unduh langsung hasilnya. Berkas sumber langsung dimusnahkan otomatis demi privasi.',
    },
    footer: {
      tagline: 'Platform konversi dokumen gratis, open-source, dan mengutamakan privasi Anda.',
      privacyGuaranteed: 'Zero-Storage: Kami tidak pernah menyimpan dokumen Anda di server.',
      openSource: 'Proyek Open-Source',
    },
  },
  en: {
    nav: {
      tools: 'Tools',
      howItWorks: 'How it works',
      privacy: 'Privacy',
      terms: 'Terms',
      creator: 'Farid Ahmad',
      changeLang: 'Change Language',
    },
    hero: {
      badge: 'SIMPLE CONVERSION & OPTIMIZATION',
      title: 'Convert and optimize files. Fast & effortless.',
      subtitle: 'All your document conversion, image optimization, and PDF tools in one place. 100% free with no registration.',
      freeBadge: 'Completely free with no paywall or subscriptions',
      supportCreator: 'Support the creator by sharing this tool',
    },
    upload: {
      dropTitle: 'Drop your files here',
      dropSubtitle: 'or click to browse from device',
      chooseButton: 'Choose Files',
      maxLimits: 'Supports PDF, JPG, PNG, WEBP, DOCX, XLSX, PPTX up to 10 MB (Max 10 files)',
      privacyNotice: 'Zero-Storage: Source files are destroyed immediately after conversion.',
    },
    popular: {
      title: 'Popular tools',
      smartOptimize: 'Smart Image Optimizer',
      smartOptimizeDesc: 'Compress photos with perceptual HD clarity and zero artifacts',
      compressImage: 'Compress Image (Target Size)',
      compressImageDesc: 'Reduce photo file size to exact quotas (≤ 100KB, 300KB, custom)',
      imageConverter: 'Image to PDF',
      imageConverterDesc: 'Bundle JPG/PNG images into a single clean PDF document',
      compressPdf: 'Compress PDF',
      compressPdfDesc: 'Reduce PDF file size while maintaining readability',
      pdfConverter: 'PDF to Image (JPG/PNG)',
      pdfConverterDesc: 'Render PDF pages into high-resolution images',
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
      privacyText: (n) => `${n} files selected • Zero-Storage (Instant Destruction)`,
      convertButton: 'Convert Now',
      processingButton: 'Converting...',
      unsupportedComb: 'Unsupported File Combination',
      unsupportedCombDesc: 'The uploaded file formats do not match a common operation. Please upload uniform types.',
      targetSizeTitle: 'Target File Size (Optional)',
      targetSizeAuto: 'Auto / Free',
      targetSizeCustom: 'Custom',
      targetSizePlaceholder: 'e.g. 300',
      advancedSettingsShow: 'Show Advanced Settings (Dimensions, Format, Quality)',
      advancedSettingsHide: 'Hide Advanced Settings',
      resizeResolutionLabel: 'Maximum Resolution Limit (Maintains Aspect Ratio)',
      resizeOriginal: 'Original',
      resizeCustom: 'Custom px',
      resizePlaceholder: 'Max px',
      longestSideUnit: 'longest edge pixels',
      outputFormatLabel: 'Output Format',
      optAuto: 'Auto (Most Lightweight & Efficient)',
      optWebp: 'WebP (Modern, Compact, Transparent)',
      optJpeg: 'JPEG (Universal Photo)',
      optPng: 'PNG (Lossless Quality)',
      optAvif: 'AVIF (Next-Gen Ultra Compression)',
      strategyLabel: 'Visual Quality Strategy',
      stratBalanced: 'Balanced (Balanced HD & Size)',
      stratVisualHQ: 'Visual HQ (Prioritize Sharpness)',
      stratAggressive: 'Aggressive (Maximum Size Reduction)',
      stripMetadataLabel: 'Strip EXIF metadata & GPS location to reduce size and protect privacy',
    },
    status: {
      uploading: 'Uploading files to server...',
      validating: 'Verifying file integrity and format...',
      queued: 'Queued for processing...',
      processing: 'Converting with high fidelity...',
      completed: 'Conversion Completed!',
      failed: 'Conversion Failed',
      completedSub: 'Your document was processed with maximum quality. Source files were destroyed immediately.',
      processingSub: 'Please wait a moment while the conversion engine finishes.',
      downloadButton: 'Download Converted File',
      downloadZipButton: 'Download All (.zip)',
      retentionNotice: 'Source files are destroyed immediately from the server. Your privacy is fully protected.',
      purgeNow: 'Delete from Server Now',
      purgedSuccess: 'Files permanently destroyed from server!',
      convertAgain: 'Convert Another File',
      imageResultTitle: 'Image Optimization Results',
      targetReached: 'Target Reached',
      hdOptimal: 'Optimal HD Quality',
      beforeLabel: 'Before',
      afterLabel: 'After (Optimized)',
      savedLabel: 'Total Size Saved',
      reducedPercent: (n) => `Reduced by ${n}%`,
      fasterLoad: 'Faster load speed',
      convertOtherFormat: 'Convert to Other Format',
      convertResultFile: 'Chain-Convert Result',
      downloadSelected: (n, isZip) => `Download Selected (${n}${isZip ? ' .ZIP' : ''})`,
      selectedCount: (s, t) => `${s} / ${t} selected`,
      selectAll: 'Select All',
      deselectAll: 'Deselect All',
      pageLabel: (p) => `Page ${p}`,
      previewButton: 'Preview',
      downloadSingle: 'Download',
    },
    imageComparison: {
      privacyTitle: 'Privacy Protected: EXIF & GPS Stripped',
      cleanBadge: '100% Clean',
      privacyDesc: 'GPS coordinates, camera model, and device identifiers have been completely removed.',
      viewDetails: 'View Details',
      hideDetails: 'Hide Details',
      noticeSafe: 'The output file is completely safe to share online without leaving sensitive location traces.',
      sliderHint: 'Drag the handle across the image to evaluate visual sharpness',
      sideBySideHint: 'Side-by-side view for direct contrast and color fidelity comparison',
      splitSlider: 'Split Slider',
      sideBySide: 'Side-by-Side',
      beforeHeading: 'Before (Original)',
      afterHeading: 'Sesudah (Smart Compressed)',
      beforeBadge: (size) => `Before: ${size}`,
      afterBadge: (size) => `After: ${size}`,
      gpsCategory: 'Location & GPS',
      gpsCoord: 'GPS Coordinates',
      altitude: 'Altitude',
      accuracy: 'GPS Accuracy',
      cameraCategory: 'Device & Camera Specs',
      cameraModel: 'Camera Model',
      aperture: 'Aperture',
      focalLength: 'Focal Length',
      timeCategory: 'Timestamp & Software',
      captureTime: 'Date & Time',
      softwareOS: 'Software / OS',
      serialID: 'File Serial ID',
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
      step3Title: '3. Download & Instant Purge',
      step3Desc: 'Download your result immediately. Source files are destroyed instantly for total privacy.',
    },
    footer: {
      tagline: 'An open-source, privacy-focused document conversion platform.',
      privacyGuaranteed: 'Zero-Storage: We never store your documents on our servers.',
      openSource: 'Open-Source Project',
    },
  },
}

function detectDefaultLanguage(): Language {
  if (typeof window !== 'undefined') {
    const pathname = window.location.pathname
    if (pathname === '/en' || pathname.startsWith('/en/')) {
      return 'en'
    }
    if (pathname === '/id' || pathname.startsWith('/id/')) {
      return 'id'
    }
    const saved = localStorage.getItem('convertinaja_lang')
    if (saved === 'id' || saved === 'en') {
      return saved
    }
    const browserLang = (navigator.language || '').toLowerCase()
    if (browserLang.startsWith('id')) {
      return 'id'
    }
  }
  return 'id'
}

export interface I18nContextValue {
  lang: Language
  isId: boolean
  setLanguage: (lang: Language) => void
  setLang: (lang: Language) => void
  t: Translations
}

export function useI18nState(): I18nContextValue {
  const [lang, setLangState] = useState<Language>(detectDefaultLanguage)

  useEffect(() => {
    const currentPath = window.location.pathname
    if (lang === 'en' && !currentPath.startsWith('/en')) {
      const newPath = '/en' + (currentPath === '/' ? '' : currentPath)
      window.history.replaceState({}, '', newPath + window.location.search + window.location.hash)
    } else if (lang === 'id' && (currentPath.startsWith('/en') || currentPath.startsWith('/id'))) {
      const newPath = currentPath.replace(/^\/(en|id)/, '') || '/'
      window.history.replaceState({}, '', newPath + window.location.search + window.location.hash)
    }
    localStorage.setItem('convertinaja_lang', lang)
    document.documentElement.lang = lang
    document.title =
      lang === 'en'
        ? 'ConvertinAja - Fast, Free & Zero-Storage Document & Image Optimizer'
        : 'ConvertinAja - Konversi & Optimasi Gambar/Dokumen Cepat, Gratis & Zero-Storage'
  }, [lang])

  useEffect(() => {
    function onPopState() {
      const path = window.location.pathname
      if (path === '/en' || path.startsWith('/en/')) {
        setLangState('en')
      } else if (path === '/id' || path.startsWith('/id/') || path === '/') {
        setLangState('id')
      }
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  function setLang(newLang: Language) {
    setLangState(newLang)
  }

  return {
    lang,
    isId: lang === 'id',
    setLanguage: setLang,
    setLang,
    t: translations[lang],
  }
}

export const I18nContext = createContext<I18nContextValue>({
  lang: 'id',
  isId: true,
  setLanguage: () => {},
  setLang: () => {},
  t: translations.id,
})

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const value = useI18nState()
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  return useContext(I18nContext)
}
