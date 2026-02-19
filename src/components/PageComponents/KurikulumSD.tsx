'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Section } from '@/payload-types'
import Image from 'next/image'

gsap.registerPlugin(ScrollTrigger)

interface KurikulumSDProps {
  section: Section
}

export default function KurikulumSD({ section }: KurikulumSDProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const descRef = useRef<HTMLParagraphElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const textBlockRef = useRef<HTMLDivElement>(null)
  const floatsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title line draw
      gsap.from(lineRef.current, {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
      })

      // Title entrance
      gsap.from(titleRef.current, {
        y: 60,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
      })

      gsap.from(descRef.current, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        delay: 0.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
      })

      // Image reveal — slide in from right
      gsap.from(imageRef.current, {
        x: 80,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: imageRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      })

      // Text block slide in from left
      gsap.from(textBlockRef.current, {
        x: -60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: imageRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      })

      // Floating shapes
      const floats = floatsRef.current?.querySelectorAll('.float-shape')
      if (floats) {
        floats.forEach((el, i) => {
          gsap.to(el, {
            y: 'random(-20, 20)',
            x: 'random(-10, 10)',
            rotation: 'random(-10, 10)',
            duration: `random(3, 5)`,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: i * 0.25,
          })
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const imageUrl =
    typeof section.image === 'object' && section.image
      ? (section.image as any).cloudinaryUrl || section.image.url
      : null

  return (
    <div
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-sky-50 via-cyan-50 to-teal-100 px-6 py-28"
    >
      {/* Floating accents */}
      <div ref={floatsRef} className="absolute inset-0 pointer-events-none z-10">
        <div className="float-shape absolute w-64 h-64 rounded-[50%_50%_30%_70%/50%_30%_70%_50%] bg-gradient-to-br from-sky-200 to-cyan-200 opacity-30 -top-20 -right-20" />
        <div className="float-shape absolute w-48 h-48 rounded-full bg-gradient-to-br from-teal-200 to-emerald-200 opacity-25 bottom-10 left-[5%]" />
        <div className="float-shape absolute w-32 h-32 rounded-[40%_60%_60%_40%/40%_40%_60%_60%] bg-gradient-to-br from-cyan-300 to-sky-300 opacity-20 top-[40%] left-[45%]" />
        {/* Geometric accents */}
        <div className="float-shape absolute w-6 h-6 rotate-45 bg-sky-400 opacity-30 top-[18%] left-[12%]" />
        <div className="float-shape absolute w-5 h-5 rotate-45 bg-teal-400 opacity-30 top-[65%] right-[18%]" />
        <div className="float-shape absolute w-8 h-8 rotate-12 bg-cyan-300 opacity-30 bottom-[25%] left-[35%]" />
        <div className="float-shape absolute text-sky-400 text-4xl opacity-20 top-[25%] right-[8%]">
          ◆
        </div>
        <div className="float-shape absolute text-teal-400 text-3xl opacity-20 bottom-[15%] right-[40%]">
          ◆
        </div>
      </div>

      <div className="relative z-20 max-w-7xl w-full flex flex-col gap-16">
        {/* Header */}
        <div className="text-center flex flex-col items-center gap-4">
          <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-sky-200 rounded-full px-5 py-2">
            <span className="text-lg">📋</span>
            <span className="font-quicksand font-semibold text-sky-700 text-sm uppercase tracking-wider">
              Kurikulum Sekolah Dasar
            </span>
          </div>

          <div className="relative">
            <h2
              ref={titleRef}
              className="font-fredoka text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight"
            >
              {section.title || 'Kurikulum SD'}
            </h2>
            {/* Underline accent */}
            <div
              ref={lineRef}
              className="h-1.5 w-full mt-2 rounded-full bg-gradient-to-r from-sky-400 to-teal-400"
            />
          </div>

          {section.subtitle && (
            <p className="font-quicksand text-xl font-semibold text-gray-600">{section.subtitle}</p>
          )}
        </div>

        {/* Content: image + text side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image side */}
          <div ref={imageRef} className="relative">
            {/* Decorative frame behind */}
            <div
              className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-sky-300 to-teal-400 shadow-xl opacity-40"
              style={{ transform: 'rotate(3deg) translate(10px, 12px)' }}
            />

            <div className="relative rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.14),0_8px_20px_rgba(14,165,233,0.2)]">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={section.title || 'Kurikulum SD'}
                  width={700}
                  height={500}
                  className="w-full h-[300px] md:h-[400px] object-cover"
                />
              ) : (
                <div className="w-full h-[300px] md:h-[400px] bg-gradient-to-br from-sky-200 to-teal-300 flex items-center justify-center">
                  <span className="text-8xl opacity-50">📚</span>
                </div>
              )}
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-sky-900/20 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Floating info chips on image */}
            <div className="absolute -bottom-5 left-6 bg-white rounded-2xl px-4 py-3 shadow-lg flex items-center gap-3 border border-sky-100">
              <span className="text-2xl">🌟</span>
              <div>
                <p className="font-fredoka font-bold text-gray-800 text-sm">Kurikulum Merdeka</p>
                <p className="font-quicksand text-xs text-sky-600 font-semibold">2024 / 2025</p>
              </div>
            </div>
          </div>

          {/* Text side */}
          <div ref={textBlockRef} className="flex flex-col gap-6">
            {section.description ? (
              <p className="font-quicksand text-lg text-gray-600 leading-relaxed whitespace-pre-line">
                {section.description}
              </p>
            ) : (
              <p className="font-quicksand text-lg text-gray-600 leading-relaxed">
                Program kurikulum SD kami dirancang untuk membangun fondasi akademik yang kuat
                dengan pendekatan belajar yang menyenangkan dan berbasis karakter.
              </p>
            )}

            {/* Feature list */}
            <div className="flex flex-col gap-3 mt-2">
              {[
                { icon: '✅', text: 'Pembelajaran aktif & kreatif' },
                { icon: '✅', text: 'Penilaian berbasis proyek' },
                { icon: '✅', text: 'Integrasi teknologi digital' },
                { icon: '✅', text: 'Pengembangan karakter & akhlak' },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3">
                  <span className="text-xl flex-shrink-0">{item.icon}</span>
                  <span className="font-quicksand text-base text-gray-700 font-semibold">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA card */}
            <div className="mt-4 bg-gradient-to-br from-sky-100 to-teal-100 rounded-2xl p-5 border border-sky-200/60">
              <p className="font-fredoka text-lg font-bold text-gray-800 mb-1">
                Daftar Sekarang 🎉
              </p>
              <p className="font-quicksand text-sm text-gray-600">
                Penerimaan siswa baru dibuka setiap tahun ajaran. Hubungi kami untuk informasi lebih
                lanjut.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Wave divider → next section should start with rose-50 / pink-50 */}
      <div className="absolute bottom-[-2px] left-0 w-full overflow-hidden leading-[0]">
        <svg
          className="relative block w-full h-[80px]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="sdKurikulumWave" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f0f9ff" /> {/* sky-50 — matches footer bg start */}
              <stop offset="100%" stopColor="#f0fdf4" /> {/* green-50 */}
            </linearGradient>
          </defs>
          <path
            d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
            fill="url(#sdKurikulumWave)"
          />
        </svg>
      </div>
    </div>
  )
}
