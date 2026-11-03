import { useState, useRef } from 'react'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { UploadZone } from './components/UploadZone'
import { FileList } from './components/FileList'
import { InlineToolSelector } from './components/InlineToolSelector'
import { ConversionStatus } from './components/ConversionStatus'
import { ToolsCatalog } from './components/ToolsCatalog'
import { HowItWorks } from './components/HowItWorks'
import { Footer } from './components/Footer'
import type { UploadedFile, ToolDefinition, ConversionJobResult } from './types/conversion'
import { validateUploadedFile } from './services/toolsCatalog'

export function App() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [currentJob, setCurrentJob] = useState<ConversionJobResult | null>(null)
  const [catalogCategory, setCatalogCategory] = useState<string>('all')
  const uploadSectionRef = useRef<HTMLDivElement>(null)

  // Handle files added via Drag & Drop or File Picker
  const handleFilesAdded = (files: FileList | File[]) => {
    const fileArray = Array.from(files)
    const newItems: UploadedFile[] = fileArray.map((file) => {
      const validation = validateUploadedFile(file)
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

    setUploadedFiles((prev) => [...prev, ...newItems])
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

  // Start conversion handler
  const handleStartConversion = (tool: ToolDefinition, _options: Record<string, unknown>) => {
    const validFiles = uploadedFiles.filter((f) => f.isValid)
    if (validFiles.length === 0) return

    // Initialize job state
    const simulatedJobId = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2)
    const simulatedToken = Math.random().toString(36).substring(2, 10)

    setCurrentJob({
      jobId: simulatedJobId,
      accessToken: simulatedToken,
      status: 'uploading',
      action: tool.name,
      filesCount: validFiles.length,
    })

    // Simulate flow: uploading -> validating -> processing -> completed
    setTimeout(() => {
      setCurrentJob((prev) => (prev ? { ...prev, status: 'validating' } : null))
    }, 800)

    setTimeout(() => {
      setCurrentJob((prev) => (prev ? { ...prev, status: 'processing' } : null))
    }, 1800)

    setTimeout(() => {
      setCurrentJob((prev) =>
        prev
          ? {
              ...prev,
              status: 'completed',
              downloadUrl: `#download-${simulatedJobId}`,
              batchDownloadUrl: validFiles.length > 1 ? `#batch-${simulatedJobId}.zip` : undefined,
              fileSize: 1024 * 350,
            }
          : null
      )
    }, 3800)
  }

  // Reset to upload another
  const handleReset = () => {
    setCurrentJob(null)
    setUploadedFiles([])
  }

  // Scroll to upload when clicking catalog or nav items
  const handleCategorySelect = (category: string) => {
    setCatalogCategory(category)
    const toolsEl = document.getElementById('tools')
    toolsEl?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      {/* 3.1 Navbar */}
      <Navbar onSelectCategory={handleCategorySelect} />

      <main className="flex-1">
        {/* 3.2 Hero Section */}
        <Hero />

        {/* 3.3 Upload Section & Inline Experience */}
        <section
          ref={uploadSectionRef}
          aria-label="Upload and Conversion Area"
          className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4"
        >
          {/* If there is an active job or completed state */}
          {currentJob ? (
            <ConversionStatus job={currentJob} onReset={handleReset} />
          ) : (
            <>
              {/* Dropzone Area */}
              <UploadZone
                onFilesSelected={handleFilesAdded}
                disabled={Boolean(currentJob)}
              />

              {/* Uploaded File List */}
              {uploadedFiles.length > 0 && (
                <div className="space-y-4 mt-4">
                  <FileList
                    files={uploadedFiles}
                    onRemoveFile={handleRemoveFile}
                    onAddMoreClick={handleAddMoreFiles}
                  />

                  {/* 4.4 Inline Tool Selection */}
                  <InlineToolSelector
                    files={uploadedFiles}
                    onStartConversion={handleStartConversion}
                  />
                </div>
              )}
            </>
          )}
        </section>

        {/* 3.4 Tools Section */}
        <ToolsCatalog
          activeCategory={catalogCategory}
          onSelectToolTrigger={(_toolId) => {
            uploadSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
            handleAddMoreFiles()
          }}
        />

        {/* 3.5 How It Works */}
        <HowItWorks />
      </main>

      {/* 3.6 Footer */}
      <Footer />
    </div>
  )
}

export default App
