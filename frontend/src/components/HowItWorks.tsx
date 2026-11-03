import { UploadCloud, Sliders, Download } from 'lucide-react'
import { useI18n } from '../i18n'

export function HowItWorks() {
  const { t } = useI18n()

  const steps = [
    {
      num: '01',
      icon: UploadCloud,
      title: t.howItWorks.step1Title,
      description: t.howItWorks.step1Desc,
    },
    {
      num: '02',
      icon: Sliders,
      title: t.howItWorks.step2Title,
      description: t.howItWorks.step2Desc,
    },
    {
      num: '03',
      icon: Download,
      title: t.howItWorks.step3Title,
      description: t.howItWorks.step3Desc,
    },
  ]

  return (
    <section id="how-it-works" className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
      <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight mb-2">
          {t.howItWorks.title}
        </h2>
        <p className="text-sm sm:text-base text-[#64748B]">
          {t.howItWorks.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {steps.map((step) => {
          const Icon = step.icon
          return (
            <div
              key={step.num}
              className="relative p-6 sm:p-7 rounded-xl border border-[#E2E8F0] bg-white shadow-2xs hover:border-[#93C5FD] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-2xl font-black text-slate-200">
                    {step.num}
                  </span>
                </div>
                <h3 className="text-base font-bold text-[#0F172A] mb-2">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
