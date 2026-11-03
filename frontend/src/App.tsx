import { useState, useRef, useEffect } from 'react'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { UploadZone } from './components/UploadZone'
import { PopularTools } from './components/PopularTools'
import { FileList } from './components/FileList'
import { InlineToolSelector } from './components/InlineToolSelector'
import { ConversionStatus } from './components/ConversionStatus'
import { ToolsCatalog } from './components/ToolsCatalog'
import { HowItWorks } from './components/HowItWorks'
import { Footer } from './components/Footer'
import { Toast } from './components/Toast'
import type { UploadedFile, ToolDefinition } from './types/conversion'
import { validateUploadedFile } from './services/toolsCatalog'
import { useConversion } from './hooks/useConversion'

export function App() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [catalogCategory, setCatalogCategory] = useState<string>('all')
  const uploadSectionRef = useRef<HTMLDivElement>(null)
  const toolSelectorRef = useRef<HTMLDivElement>(null)
  const statusSectionRef = useRef<HTMLDivElement>(null)

  const {
    job,
    toasts,
    startConversion,
    resetJob,
    addToast,
    dismissToast,
  } = useConversion()

  // Auto-scroll to conversion progress status when job changes
  useEffect(() => {
    if (job) {
      setTimeout(() => {
        statusSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 50)
    }
  }, [job])

  // Handle files added via Drag & Drop or File Picker
  const handleFilesAdded = (files: FileList | File[]) => {
    const fileArray = Array.from(files)
    let invalidCount = 0

    const newItems: UploadedFile[] = fileArray.map((file) => {
      const validation = validateUploadedFile(file)
      if (!validation.isValid) {
        invalidCount += 1
      }
      return {
        id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2),
        file,
        name: file.name,
        size: file.size,
        format: validation.format,
        isValid: validation.isValid,
        errorMessage: validation.errorMessage,
      }
    })

    if (invalidCount > 0) {
      addToast('error', `${invalidCount} file melebihi batas atau format tidak didukung.`)
    }

    setUploadedFiles((prev) => [...prev, ...newItems])

    // Smooth scroll to inline tool selector upon selecting files
    setTimeout(() => {
      toolSelectorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 150)
  }

  // Remove a single file from the list
  const handleRemoveFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id))
  }

  // Trigger add more files by finding and triggering file input
  const handleAddMoreFiles = () => {
    const inputEl = document.querySelector('input[type="file"]') as HTMLInputElement | null
    inputEl?.click()
  }

  // Start conversion
  const handleStartConversion = (tool: ToolDefinition, options: Record<string, unknown>) => {
    const validRawFiles = uploadedFiles.filter((f) => f.isValid).map((f) => f.file)
    if (validRawFiles.length === 0) {
      addToast('error', 'Tidak ada file valid yang dapat dikonversi.')
      return
    }

    startConversion(validRawFiles, tool, options)

    // Smooth scroll to progress area
    setTimeout(() => {
      statusSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  // Reset to upload another
  const handleReset = () => {
    resetJob()
    setUploadedFiles([])
    setTimeout(() => {
      uploadSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  // Scroll to tools catalog
  const handleCategorySelect = (category: string) => {
    setCatalogCategory(category)
    const toolsEl = document.getElementById('tools')
    toolsEl?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* 3.1 Navbar */}
      <Navbar onSelectCategory={handleCategorySelect} />

      <main className="flex-1 pb-16">
        {/* 3.2 Hero Section */}
        <Hero />

        {/* 3.3 Upload Section & Conversion Experience */}
        <section
          ref={uploadSectionRef}
          aria-label="Upload and Conversion Area"
          className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-4 space-y-6"
        >
          {/* Active Job / Result View */}
          {job ? (
            <div ref={statusSectionRef} className="scroll-mt-6">
              <ConversionStatus job={job} onReset={handleReset} />
            </div>
          ) : (
            <>
              {/* Dropzone Area */}
              <UploadZone
                onFilesSelected={handleFilesAdded}
                disabled={Boolean(job)}
              />

              {/* When no files are uploaded, show Popular Tools preview */}
              {uploadedFiles.length === 0 ? (
                <PopularTools onSelectTool={(_toolId) => handleAddMoreFiles()} />
              ) : (
                /* When files are uploaded, show File List and Grouped Tool Selector */
                <div className="space-y-4 mt-6">
                  <FileList
                    files={uploadedFiles}
                    onRemoveFile={handleRemoveFile}
                    onAddMoreClick={handleAddMoreFiles}
                  />

                  {/* 4.4 Inline Tool Selection & Quality Options */}
                  <div ref={toolSelectorRef} className="scroll-mt-6">
                    <InlineToolSelector
                      files={uploadedFiles}
                      onStartConversion={handleStartConversion}
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </section>

        {/* 3.4 Full Tools Catalog */}
        <div className="mt-12 border-t border-[#E2E8F0]">
          <ToolsCatalog
            activeCategory={catalogCategory}
            onSelectToolTrigger={(_toolId) => {
              uploadSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
              handleAddMoreFiles()
            }}
          />
        </div>

        {/* 3.5 How It Works */}
        <div className="border-t border-[#E2E8F0] bg-[#F8FAFC]">
          <HowItWorks />
        </div>
      </main>

      {/* 3.6 Footer */}
      <Footer />

      {/* Floating Feedback Toasts */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  )
}

export default App
