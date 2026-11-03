import { useState } from 'react'
import { FileText, Image as ImageIcon, FileSpreadsheet, ArrowRight } from 'lucide-react'
import { AVAILABLE_TOOLS } from '../services/toolsCatalog'
import type { CategoryType } from '../types/conversion'

interface ToolsCatalogProps {
  onSelectToolTrigger?: (toolId: string) => void
  activeCategory?: string
}

export function ToolsCatalog({ onSelectToolTrigger, activeCategory }: ToolsCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'all'>('all')

  const currentTab = (activeCategory as CategoryType | 'all') || selectedCategory

  const categories = [
    { id: 'all', label: 'Semua Tools' },
    { id: 'pdf', label: 'PDF Tools', icon: FileText },
    { id: 'image', label: 'Image Tools', icon: ImageIcon },
    { id: 'office', label: 'Office Tools', icon: FileSpreadsheet },
  ]

  const filteredTools = AVAILABLE_TOOLS.filter((tool) => {
    if (currentTab === 'all') return true
    return tool.category === currentTab
  })

  return (
    <section id="tools" className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight mb-2">
          Jelajahi Beragam Peralatan Konversi
        </h2>
        <p className="text-sm sm:text-base text-[#64748B]">
          Semua fitur tersedia gratis dan dapat digunakan langsung tanpa perlu membuat akun.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.id as CategoryType | 'all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
              currentTab === cat.id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredTools.map((tool) => (
          <div
            key={tool.id}
            onClick={() => onSelectToolTrigger?.(tool.id)}
            className="group bg-white border border-[#E2E8F0] hover:border-blue-400 hover:shadow-md rounded-xl p-5 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                  {tool.category.toUpperCase()}
                </span>
                <span className="text-xs font-medium text-[#64748B]">
                  Hasil: <span className="font-semibold text-[#0F172A]">{tool.outputFormat}</span>
                </span>
              </div>
              <h3 className="text-base font-bold text-[#0F172A] group-hover:text-blue-600 transition-colors mb-1.5">
                {tool.name}
              </h3>
              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                {tool.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-xs font-semibold text-blue-600">
              <span>Gunakan Tool</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
