import { FileText, Image as ImageIcon, Minimize2, Copy } from 'lucide-react'
import { useI18n } from '../i18n'

interface PopularToolsProps {
  onSelectTool: (toolId: string, acceptTypes: string) => void
}

export function PopularTools({ onSelectTool }: PopularToolsProps) {
  const { t } = useI18n()

  const tools = [
    {
      id: 'pdf-to-jpg',
      title: t.popular.pdfConverter,
      description: t.popular.pdfConverterDesc,
      accept: '.pdf,application/pdf',
      icon: FileText,
      iconColor: 'text-[#DC2626]',
      iconBg: 'bg-red-50',
    },
    {
      id: 'jpg-to-pdf',
      title: t.popular.imageConverter,
      description: t.popular.imageConverterDesc,
      accept: '.jpg,.jpeg,.png,.webp,image/*',
      icon: ImageIcon,
      iconColor: 'text-[#2563EB]',
      iconBg: 'bg-blue-50',
    },
    {
      id: 'compress-pdf',
      title: t.popular.compressPdf,
      description: t.popular.compressPdfDesc,
      accept: '.pdf,application/pdf',
      icon: Minimize2,
      iconColor: 'text-[#2563EB]',
      iconBg: 'bg-blue-50',
    },
    {
      id: 'merge-pdf',
      title: t.popular.mergePdf,
      description: t.popular.mergePdfDesc,
      accept: '.pdf,application/pdf',
      icon: Copy,
      iconColor: 'text-[#2563EB]',
      iconBg: 'bg-blue-50',
    },
  ]

  return (
    <div id="popular-tools" className="w-full max-w-[800px] mx-auto mt-6">
      <h3 className="text-sm sm:text-base font-bold text-[#0F172A] mb-3">
        {t.popular.title}
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {tools.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTool(item.id, item.accept)}
              className="w-full p-3.5 sm:p-4 rounded-xl border border-[#E2E8F0] bg-white hover:border-[#93C5FD] hover:bg-[#F8FAFC] transition-all text-left flex items-start gap-3.5 group cursor-pointer shadow-2xs"
            >
              <div
                className={`w-10 h-10 rounded-lg ${item.iconBg} ${item.iconColor} flex items-center justify-center shrink-0 mt-0.5`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-sm font-semibold text-[#0F172A] group-hover:text-[#2563EB] transition-colors block">
                  {item.title}
                </span>
                <p className="text-xs text-[#64748B] mt-0.5 leading-relaxed line-clamp-1">
                  {item.description}
                </p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
