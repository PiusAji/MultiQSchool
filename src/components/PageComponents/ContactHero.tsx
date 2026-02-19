'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Section } from '@/payload-types'
import Image from 'next/image'

gsap.registerPlugin(ScrollTrigger)

interface ContactHeroProps {
  section: Section
}

export default function ContactHero({ section }: ContactHeroProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const eyebrowRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const descRef = useRef<HTMLParagraphElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const floatsRef = useRef<HTMLDivElement>(null)

  const imageUrl =
    typeof section.image === 'object' && section.image
      ? (section.image as any).cloudinaryUrl || section.image.url
      : null

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.from(eyebrowRef.current, { y: 30, opacity: 0, duration: 0.7 })
        .from(
          titleRef.current,
          {
            y: 80,
            opacity: 0,
            duration: 1.1,
            ease: 'elastic.out(1, 0.75)',
          },
          '-=0.3',
        )
        .from(descRef.current, { y: 40, opacity: 0, duration: 0.8 }, '-=0.5')
        .from(
          imageRef.current,
          {
            scale: 0.88,
            opacity: 0,
            rotation: 3,
            duration: 1,
            ease: 'back.out(1.4)',
          },
          '-=0.7',
        )

      // Floating shapes
      const floats = floatsRef.current?.querySelectorAll('.float-el')
      if (floats) {
        floats.forEach((el, i) => {
          gsap.to(el, {
            y: 'random(-25, 25)',
            x: 'random(-12, 12)',
            rotation: 'random(-10, 10)',
            duration: `random(3, 5.5)`,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: i * 0.2,
          })
        })
      }

      // Scroll parallax on image
      gsap.to(imageRef.current, {
        y: -45,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.4,
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-100 px-6 pt-40 pb-36 -mt-[120px]"
    >
      {/* Floating ambient decorations */}
      <div ref={floatsRef} className="absolute inset-0 pointer-events-none z-10">
        <div className="float-el absolute w-80 h-80 rounded-full bg-gradient-to-br from-teal-200 to-emerald-200 opacity-25 -top-28 -right-20" />
        <div className="float-el absolute w-60 h-60 rounded-[60%_40%_40%_60%/50%_60%_40%_50%] bg-gradient-to-br from-cyan-200 to-teal-200 opacity-20 top-1/3 -left-24" />
        <div className="float-el absolute w-48 h-48 rounded-full bg-gradient-to-br from-emerald-200 to-green-200 opacity-20 bottom-32 right-[15%]" />

        <div className="float-el absolute w-10 h-10 rounded-full bg-teal-400 opacity-35 top-[22%] right-[16%]" />
        <div className="float-el absolute w-7 h-7 rounded-full bg-emerald-400 opacity-35 top-[60%] left-[22%]" />
        <div className="float-el absolute w-9 h-9 rounded-full bg-cyan-400 opacity-30 bottom-[25%] left-[10%]" />

        <div className="float-el absolute text-teal-400 text-5xl opacity-25 top-[14%] left-[14%]">
          ✦
        </div>
        <div className="float-el absolute text-emerald-400 text-4xl opacity-25 bottom-[28%] right-[8%]">
          ✦
        </div>
        <div className="float-el absolute text-cyan-400 text-3xl opacity-20 top-[52%] right-[46%]">
          ✦
        </div>
        <div className="float-el absolute text-4xl opacity-20 top-[10%] right-[6%]">🌿</div>
        <div className="float-el absolute text-3xl opacity-20 bottom-[22%] left-[42%]">💬</div>
      </div>

      {/* Main content */}
      <div className="relative z-20 max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">
        {/* LEFT — Text */}
        <div className="flex flex-col gap-6 text-center lg:text-left items-center lg:items-start">
          <div
            ref={eyebrowRef}
            className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-teal-200 rounded-full px-5 py-2 shadow-sm"
          >
            <span className="text-xl">📬</span>
            <span className="font-quicksand font-semibold text-teal-600 text-sm tracking-wide uppercase">
              Hubungi Kami
            </span>
          </div>

          <h1
            ref={titleRef}
            className="font-fredoka text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[1.05] text-gray-800"
            style={{ textShadow: '4px 4px 0px rgba(20, 184, 166, 0.15)' }}
          >
            {section.title || 'Kontak Kami'}
          </h1>

          {section.description && (
            <p
              ref={descRef}
              className="font-quicksand text-lg md:text-xl text-gray-600 leading-relaxed max-w-xl whitespace-pre-line"
            >
              {section.description}
            </p>
          )}

          {/* Quick info chips */}
          <div className="flex flex-wrap gap-3 justify-center lg:justify-start mt-2">
            {[
              { icon: '📍', label: 'Kerobokan, Bali' },
              { icon: '📞', label: '0878-6164-6101' },
              { icon: '🕐', label: 'Senin–Sabtu 07.30–12.30' },
            ].map((chip) => (
              <span
                key={chip.label}
                className="flex items-center gap-2 bg-white/70 backdrop-blur-sm border border-teal-100 rounded-full px-4 py-2 font-quicksand font-semibold text-sm text-gray-700 shadow-sm"
              >
                <span>{chip.icon}</span> {chip.label}
              </span>
            ))}
          </div>
        </div>

        {/* RIGHT — Image with floating contact badges */}
        <div ref={imageRef} className="relative" style={{ willChange: 'transform' }}>
          {/* Glow behind */}
          <div className="absolute inset-[-12px] rounded-[3rem] blur-3xl bg-gradient-to-br from-teal-300 to-emerald-300 opacity-35 pointer-events-none" />

          <div className="relative rounded-[2.5rem] overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,0.18),0_12px_30px_rgba(20,184,166,0.25)] aspect-[4/3]">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={section.title || 'Kontak'}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-teal-200 via-emerald-200 to-cyan-200 flex items-center justify-center">
                <span className="text-8xl opacity-40">🏫</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-teal-900/20 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* WA badge — top right */}
          <div className="absolute -top-4 -right-4 lg:-right-8 z-30 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-2xl w-16 h-16 flex items-center justify-center shadow-lg">
            <span className="text-3xl">💬</span>
          </div>

          {/* Address badge — bottom left */}
          <div className="absolute -bottom-6 -left-4 lg:-left-8 z-30 bg-white rounded-2xl px-4 py-3 shadow-[0_8px_25px_rgba(0,0,0,0.12)] flex items-center gap-3 border border-teal-100">
            <span className="text-2xl">📍</span>
            <div>
              <p className="font-fredoka font-bold text-gray-800 text-sm leading-tight">
                Kerobokan Kaja
              </p>
              <p className="font-quicksand text-xs text-teal-600 font-semibold">Kuta Utara, Bali</p>
            </div>
          </div>
        </div>
      </div>

      {/* Wave into ContactUs */}
      <div className="absolute bottom-[-2px] left-0 w-full overflow-hidden leading-[0]">
        <svg
          className="relative block w-full h-[80px]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,60 C200,110 400,10 600,60 C800,110 1000,15 1200,50 L1200,120 L0,120 Z"
            fill="#f0fdf4"
          />
        </svg>
      </div>
    </div>
  )
}
