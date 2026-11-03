export function Hero() {
  return (
    <section className="pt-10 pb-6 sm:pt-14 sm:pb-8 text-center px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-3.5">
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFF6FF] text-[#2563EB] text-xs font-semibold tracking-wider uppercase">
          SIMPLE FILE CONVERSION
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0F172A] tracking-tight leading-tight">
          Convert your files.
          <br />
          <span className="text-[#2563EB]">Simply and quickly.</span>
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-[#64748B] max-w-lg mx-auto">
          All your file conversion tools in one place.
        </p>
      </div>
    </section>
  )
}
