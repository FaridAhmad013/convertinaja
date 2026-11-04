import { useState } from 'react'
import { FileText, Image as ImageIcon, FileSpreadsheet, ArrowRight } from 'lucide-react'
import { AVAILABLE_TOOLS } from '../services/toolsCatalog'
import type { CategoryType } from '../types/conversion'
import { useI18n } from '../i18n'

interface ToolsCatalogProps {
  onSelectToolTrigger?: (toolId: string) => void
  activeCategory?: string
  onCategoryChange?: (category: CategoryType | 'all') => void
}

export function ToolsCatalog({ onSelectToolTrigger, activeCategory, onCategoryChange }: ToolsCatalogProps) {
  const { t } = useI18n()
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'all'>('all')

  const currentTab = (activeCategory as CategoryType | 'all') || selectedCategory

  const handleSelectCategory = (catId: CategoryType | 'all') => {
    setSelectedCategory(catId)
    onCategoryChange?.(catId)
  }

  const categories = [
    { id: 'all', label: t.catalog.allTools },
    { id: 'pdf', label: t.catalog.pdfTools, icon: FileText },
    { id: 'image', label: t.catalog.imageTools, icon: ImageIcon },
    { id: 'office', label: t.catalog.officeTools, icon: FileSpreadsheet },
  ]

  const filteredTools = AVAILABLE_TOOLS.filter((tool) => {
    if (currentTab === 'all') return true
    return tool.category === currentTab
  })

  return (
    <section id="tools" className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight mb-2">
          {t.catalog.title}
        </h2>
        <p className="text-sm sm:text-base text-[#64748B]">
          {t.catalog.subtitle}
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => handleSelectCategory(cat.id as CategoryType | 'all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
              currentTab === cat.id
                ? 'bg-[#2563EB] text-white shadow-xs'
                : 'bg-white border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTools.map((tool) => (
          <div
            key={tool.id}
            className="p-5 rounded-xl border border-[#E2E8F0] bg-white hover:border-[#93C5FD] hover:shadow-xs transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors">
                  {tool.name}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-[#64748B]">
                  {tool.category}
                </span>
              </div>
              <p className="text-xs text-[#64748B] leading-relaxed mb-4">
                {tool.description}
              </p>
            </div>

            <div className="pt-3 border-t border-black/5 flex items-center justify-between">
              <span className="text-[11px] font-medium text-[#64748B]">
                {t.selector.output} <strong className="text-[#0F172A]">{tool.outputFormat}</strong>
              </span>

              <button
                type="button"
                onClick={() => onSelectToolTrigger?.(tool.id)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8] cursor-pointer"
              >
                <span>{t.catalog.useTool}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
