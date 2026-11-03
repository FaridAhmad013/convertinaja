import { Sparkles } from 'lucide-react'
import { useI18n } from '../i18n'

export function Hero() {
  const { t } = useI18n()

  return (
    <section className="pt-10 pb-6 text-center px-4 max-w-[800px] mx-auto">
      {/* Hero Badge */}
      <div className="flex items-center justify-center mb-4">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-[#2563EB] text-xs font-semibold uppercase tracking-wider shadow-2xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t.hero.freeBadge}</span>
        </div>
      </div>

      {/* Main Headline */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0F172A] tracking-tight mb-3">
        {t.hero.title}
      </h1>

      {/* Subtitle */}
      <p className="text-sm sm:text-base text-[#64748B] max-w-xl mx-auto leading-relaxed">
        {t.hero.subtitle}
      </p>
    </section>
  )
}
