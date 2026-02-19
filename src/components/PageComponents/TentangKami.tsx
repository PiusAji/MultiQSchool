'use client'

import type { Section } from '@/payload-types'

interface TentangKamiProps {
  section: Section
  innerRef?: (node: HTMLDivElement | null) => void
  contentRef?: (node: HTMLDivElement | null) => void
}

export default function TentangKami({ section, innerRef, contentRef }: TentangKamiProps) {
  return (
    <div
      ref={innerRef}
      className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 px-8 py-24 overflow-hidden"
    >
      {/* Subtle decorative elements */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute w-64 h-64 rounded-full bg-gradient-to-br from-blue-200 to-cyan-300 blur-3xl top-[10%] right-[10%]" />
        <div className="absolute w-48 h-48 rounded-full bg-gradient-to-br from-teal-200 to-emerald-300 blur-3xl bottom-[20%] left-[15%]" />
      </div>

      <div className="relative z-10 max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Empty space for the morphing image - ONLY ON DESKTOP */}
        <div className="hidden lg:block w-full h-[500px] md:h-[600px] order-2 lg:order-1" />

        {/* Text Content with decorative elements - Add ref and animation classes */}
        <div ref={contentRef} className="flex flex-col gap-8 order-1 lg:order-2">
          {/* Decorative line */}
          <div className="animate-content w-20 h-1.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" />

          <h2 className="animate-content font-fredoka text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight">
            {section.title}
          </h2>

          {section.subtitle && (
            <h3 className="animate-content font-quicksand text-xl md:text-2xl lg:text-3xl font-semibold text-gray-600 leading-relaxed">
              {section.subtitle}
            </h3>
          )}

          {section.description && (
            <div className="animate-content font-quicksand text-base md:text-lg text-gray-600 leading-relaxed whitespace-pre-line">
              {section.description}
            </div>
          )}

          {/* Optional: Stats cards */}
          <div className="animate-content grid grid-cols-2 gap-6 mt-4">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <div className="font-fredoka text-3xl font-bold text-blue-600">10+</div>
              <div className="font-quicksand text-sm text-gray-600 mt-1">Tahun Pengalaman</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <div className="font-fredoka text-3xl font-bold text-cyan-600">500+</div>
              <div className="font-quicksand text-sm text-gray-600 mt-1">Siswa Aktif</div>
            </div>
          </div>
        </div>
      </div>
      {/* Wave divider at bottom of TentangKami section */}
      <div className="absolute bottom-[-1px] left-0 w-full overflow-hidden leading-[0]">
        <svg
          className="relative block w-full h-[80px]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="orangeWaveGradient" x1="0%" y1="100%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fffbeb" /> {/* amber-50 - LEFT */}
              <stop offset="50%" stopColor="#fef7d9 " /> {/* amber-100 - RIGHT */}
              <stop offset="100%" stopColor="#fce7f3" /> {/* amber-100 - RIGHT */}
            </linearGradient>
          </defs>
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            fill="url(#orangeWaveGradient)"
          />
        </svg>
      </div>
    </div>
  )
}
