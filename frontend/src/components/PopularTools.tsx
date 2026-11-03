import { FileText, Image as ImageIcon, Minimize2, Copy } from 'lucide-react'

interface PopularToolsProps {
  onSelectTool: (toolId: string) => void
}

export function PopularTools({ onSelectTool }: PopularToolsProps) {
  const tools = [
    {
      id: 'pdf-to-jpg',
      title: 'PDF Converter',
      icon: FileText,
      iconColor: 'text-[#DC2626]', // PDF Red
      iconBg: 'bg-red-50',
    },
    {
      id: 'jpg-to-pdf',
      title: 'Image Converter',
      icon: ImageIcon,
      iconColor: 'text-[#2563EB]', // Blue
      iconBg: 'bg-blue-50',
    },
    {
      id: 'compress-pdf',
      title: 'Compress PDF',
      icon: Minimize2,
      iconColor: 'text-[#2563EB]',
      iconBg: 'bg-blue-50',
    },
    {
      id: 'merge-pdf',
      title: 'Merge PDF',
      icon: Copy,
      iconColor: 'text-[#2563EB]',
      iconBg: 'bg-blue-50',
    },
  ]

  return (
    <div className="w-full max-w-[800px] mx-auto mt-8">
      <h3 className="text-base font-bold text-[#0F172A] mb-3">
        Popular tools
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {tools.map((t) => {
          const Icon = t.icon
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onSelectTool(t.id)}
              className="w-full p-4 rounded-xl border border-[#E2E8F0] bg-white hover:border-[#93C5FD] hover:bg-[#F8FAFC] transition-all text-left flex items-center gap-3.5 group cursor-pointer shadow-2xs"
            >
              <div className={`w-9 h-9 rounded-lg ${t.iconBg} ${t.iconColor} flex items-center justify-center shrink-0`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-sm font-semibold text-[#0F172A] group-hover:text-[#2563EB] transition-colors">
                {t.title}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
