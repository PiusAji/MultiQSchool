'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Section } from '@/payload-types'
import Image from 'next/image'

gsap.registerPlugin(ScrollTrigger)

interface HeroAkademikSDProps {
  section: Section
}

export default function HeroAkademikSD({ section }: HeroAkademikSDProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const descRef = useRef<HTMLParagraphElement>(null)
  const imageCardRef = useRef<HTMLDivElement>(null)
  const card1Ref = useRef<HTMLDivElement>(null)
  const card2Ref = useRef<HTMLDivElement>(null)
  const badgeRef = useRef<HTMLDivElement>(null)
  const floatsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance timeline
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.from(titleRef.current, {
        y: 80,
        opacity: 0,
        duration: 1,
        ease: 'elastic.out(1, 0.75)',
      })
        .from(descRef.current, { y: 40, opacity: 0, duration: 0.8 }, '-=0.5')
        .from(
          imageCardRef.current,
          { scale: 0.85, opacity: 0, rotation: 4, duration: 1, ease: 'back.out(1.4)' },
          '-=0.7',
        )
        .from(
          card1Ref.current,
          { x: 60, opacity: 0, duration: 0.7, ease: 'back.out(1.7)' },
          '-=0.5',
        )
        .from(
          card2Ref.current,
          { x: -60, opacity: 0, duration: 0.7, ease: 'back.out(1.7)' },
          '-=0.6',
        )
        .from(
          badgeRef.current,
          { scale: 0, rotation: -20, opacity: 0, duration: 0.6, ease: 'back.out(2)' },
          '-=0.4',
        )

      // Floating background shapes
      const floats = floatsRef.current?.querySelectorAll('.float-shape')
      if (floats) {
        floats.forEach((el, i) => {
          gsap.to(el, {
            y: 'random(-25, 25)',
            x: 'random(-15, 15)',
            rotation: 'random(-12, 12)',
            duration: `random(3, 5)`,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: i * 0.3,
          })
        })
      }

      // Subtle parallax on scroll
      gsap.to(imageCardRef.current, {
        y: -60,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5,
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const imageUrl =
    typeof section.image === 'object' && section.image?.url ? section.image.url : null

  return (
    <div
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-100 to-sky-200 px-6 pt-40 pb-32 -mt-[120px]"
    >
      {/* Floating background decorations */}
      <div ref={floatsRef} className="absolute inset-0 pointer-events-none z-10">
        {/* Large blobs */}
        <div className="float-shape absolute w-72 h-72 rounded-[60%_40%_30%_70%/60%_30%_70%_40%] bg-gradient-to-br from-emerald-300 to-teal-300 opacity-20 -top-16 -left-16" />
        <div className="float-shape absolute w-56 h-56 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] bg-gradient-to-br from-sky-300 to-cyan-300 opacity-20 top-1/3 -right-20" />
        <div className="float-shape absolute w-40 h-40 rounded-full bg-gradient-to-br from-teal-200 to-emerald-200 opacity-25 bottom-32 left-1/4" />
        {/* Small accent dots */}
        <div className="float-shape absolute w-8 h-8 rounded-full bg-emerald-400 opacity-40 top-[20%] left-[20%]" />
        <div className="float-shape absolute w-6 h-6 rounded-full bg-sky-400 opacity-40 top-[60%] right-[25%]" />
        <div className="float-shape absolute w-10 h-10 rounded-full bg-teal-300 opacity-35 bottom-[20%] right-[10%]" />
        {/* Stars */}
        <div className="float-shape absolute text-emerald-400 text-5xl opacity-30 top-[15%] right-[15%]">
          ✦
        </div>
        <div className="float-shape absolute text-sky-400 text-4xl opacity-30 bottom-[30%] left-[8%]">
          ✦
        </div>
        <div className="float-shape absolute text-teal-500 text-3xl opacity-25 top-[50%] left-[45%]">
          ✦
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-20 max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Left: Text */}
        <div className="flex flex-col gap-6 text-center lg:text-left items-center lg:items-start">
          {/* Eyebrow label */}
          <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-emerald-200 rounded-full px-5 py-2 shadow-sm">
            <span className="text-xl">🎓</span>
            <span className="font-quicksand font-semibold text-emerald-700 text-sm tracking-wide uppercase">
              Program Akademik
            </span>
          </div>

          <h1
            ref={titleRef}
            className="font-fredoka text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[1.05] text-gray-800"
            style={{ textShadow: '4px 4px 0px rgba(16, 185, 129, 0.15)' }}
          >
            {section.title || 'Akademik SD'}
          </h1>

          {section.description && (
            <p
              ref={descRef}
              className="font-quicksand text-lg md:text-xl text-gray-600 leading-relaxed max-w-xl whitespace-pre-line"
            >
              {section.description}
            </p>
          )}

          {/* CTA-style stat chips */}
          <div className="flex flex-wrap gap-3 justify-center lg:justify-start mt-2">
            {[
              { icon: '📚', label: 'Kurikulum Merdeka' },
              { icon: '🌱', label: 'Berbasis Karakter' },
              { icon: '⭐', label: 'Terakreditasi A' },
            ].map((chip) => (
              <span
                key={chip.label}
                className="flex items-center gap-2 bg-white/70 backdrop-blur-sm border border-emerald-100 rounded-full px-4 py-2 font-quicksand font-semibold text-sm text-gray-700 shadow-sm"
              >
                <span>{chip.icon}</span> {chip.label}
              </span>
            ))}
          </div>
        </div>

        {/* Right: Stacked image cards */}
        <div className="relative flex items-center justify-center h-[420px] md:h-[520px]">
          {/* Back card — decorative */}
          <div
            ref={card1Ref}
            className="absolute inset-0 m-auto w-[85%] h-[85%] rounded-3xl bg-gradient-to-br from-emerald-300 to-teal-400 shadow-2xl"
            style={{ transform: 'rotate(6deg) translateX(20px) translateY(10px)' }}
          />

          {/* Mid card */}
          <div
            ref={card2Ref}
            className="absolute inset-0 m-auto w-[90%] h-[90%] rounded-3xl bg-white/50 backdrop-blur-sm shadow-xl"
            style={{ transform: 'rotate(-3deg)' }}
          />

          {/* Main image card */}
          <div
            ref={imageCardRef}
            className="absolute inset-0 m-auto w-[88%] h-[88%] rounded-3xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.18),0_10px_25px_rgba(16,185,129,0.25)]"
            style={{ willChange: 'transform' }}
          >
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={section.title || 'Akademik SD'}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-emerald-200 to-teal-300 flex items-center justify-center">
                <span className="text-8xl opacity-60">🏫</span>
              </div>
            )}
            {/* Overlay shimmer */}
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 via-transparent to-sky-400/10 pointer-events-none" />
          </div>

          {/* Floating badge */}
          <div
            ref={badgeRef}
            className="absolute -bottom-4 -left-4 lg:-left-8 z-30 bg-white rounded-2xl px-5 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.12)] flex items-center gap-3 border border-emerald-100"
          >
            <span className="text-3xl">🏅</span>
            <div>
              <p className="font-fredoka font-bold text-gray-800 text-sm leading-tight">
                Prestasi Terbaik
              </p>
              <p className="font-quicksand text-xs text-emerald-600 font-semibold">Kelas 1 – 6</p>
            </div>
          </div>

          {/* Top-right badge */}
          <div className="absolute -top-3 -right-3 lg:-right-6 z-30 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl w-16 h-16 flex flex-col items-center justify-center shadow-lg">
            <span className="text-2xl">📖</span>
          </div>
        </div>
      </div>

      {/* Wave divider → matches KurikulumSD background (sky-50 / cyan-50) */}
      <div className="absolute bottom-[-2px] left-0 w-full overflow-hidden leading-[0]">
        <svg
          className="relative block w-full h-[80px]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="sdHeroWave" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f0f9ff" /> {/* sky-50 */}
              <stop offset="100%" stopColor="#ecfeff" /> {/* cyan-50 */}
            </linearGradient>
          </defs>
          <path
            d="M0,60 C150,100 350,0 600,60 C850,120 1050,20 1200,60 L1200,120 L0,120 Z"
            fill="url(#sdHeroWave)"
          />
        </svg>
      </div>
    </div>
  )
}
