'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Section } from '@/payload-types'
import Image from 'next/image'

gsap.registerPlugin(ScrollTrigger)

interface HeroAkademikPGTKProps {
  section: Section
}

export default function HeroAkademikPGTK({ section }: HeroAkademikPGTKProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const descRef = useRef<HTMLParagraphElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const bubblesRef = useRef<HTMLDivElement>(null)
  const dotRingRef = useRef<HTMLDivElement>(null)
  const tag1Ref = useRef<HTMLDivElement>(null)
  const tag2Ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance timeline
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.from(titleRef.current, {
        y: 70,
        opacity: 0,
        duration: 1.1,
        ease: 'elastic.out(1, 0.7)',
      })
        .from(descRef.current, { y: 40, opacity: 0, duration: 0.8 }, '-=0.5')
        .from(
          frameRef.current,
          {
            scale: 0.88,
            opacity: 0,
            rotation: -5,
            duration: 1,
            ease: 'back.out(1.5)',
          },
          '-=0.7',
        )
        .from(imageRef.current, { scale: 1.15, duration: 1 }, '-=1')
        .from(
          tag1Ref.current,
          {
            y: 30,
            opacity: 0,
            scale: 0.8,
            duration: 0.6,
            ease: 'back.out(2)',
          },
          '-=0.4',
        )
        .from(
          tag2Ref.current,
          {
            y: -30,
            opacity: 0,
            scale: 0.8,
            duration: 0.6,
            ease: 'back.out(2)',
          },
          '-=0.5',
        )

      // Bouncing bubbles
      const bubbles = bubblesRef.current?.querySelectorAll('.bubble')
      if (bubbles) {
        bubbles.forEach((bubble, i) => {
          gsap.to(bubble, {
            y: 'random(-35, 35)',
            x: 'random(-20, 20)',
            scale: 'random(0.85, 1.15)',
            duration: `random(2.5, 4.5)`,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: i * 0.2,
          })
        })
      }

      // Spinning dot ring
      gsap.to(dotRingRef.current, {
        rotation: 360,
        duration: 20,
        repeat: -1,
        ease: 'none',
      })

      // Scroll parallax on image
      gsap.to(frameRef.current, {
        y: -50,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.2,
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
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-rose-50 via-orange-50 to-violet-100 px-6 pt-40 pb-32 -mt-[120px]"
    >
      {/* Bubble background layer */}
      <div ref={bubblesRef} className="absolute inset-0 pointer-events-none z-10">
        {/* Large pastel bubbles */}
        <div className="bubble absolute w-80 h-80 rounded-full bg-gradient-to-br from-pink-200 to-rose-200 opacity-25 -top-24 -right-24" />
        <div className="bubble absolute w-60 h-60 rounded-full bg-gradient-to-br from-violet-200 to-purple-200 opacity-20 top-1/2 -left-20" />
        <div className="bubble absolute w-44 h-44 rounded-full bg-gradient-to-br from-orange-200 to-amber-200 opacity-25 bottom-20 right-[15%]" />
        <div className="bubble absolute w-32 h-32 rounded-full bg-gradient-to-br from-fuchsia-200 to-pink-200 opacity-20 top-[25%] left-[30%]" />

        {/* Medium accent bubbles */}
        <div className="bubble absolute w-16 h-16 rounded-full bg-pink-300 opacity-30 top-[15%] left-[15%]" />
        <div className="bubble absolute w-12 h-12 rounded-full bg-violet-300 opacity-30 top-[70%] left-[20%]" />
        <div className="bubble absolute w-10 h-10 rounded-full bg-amber-300 opacity-30 top-[40%] right-[12%]" />

        {/* Small dots */}
        <div className="bubble absolute w-5 h-5 rounded-full bg-rose-400 opacity-40 top-[30%] right-[30%]" />
        <div className="bubble absolute w-4 h-4 rounded-full bg-fuchsia-400 opacity-40 bottom-[30%] left-[40%]" />
        <div className="bubble absolute w-6 h-6 rounded-full bg-purple-400 opacity-35 top-[55%] right-[42%]" />

        {/* Fun emoji floaters */}
        <div className="bubble absolute text-5xl opacity-25 top-[12%] left-[8%]">🌸</div>
        <div className="bubble absolute text-4xl opacity-25 bottom-[20%] right-[8%]">🌼</div>
        <div className="bubble absolute text-3xl opacity-20 top-[60%] left-[48%]">🎀</div>
      </div>

      {/* Main content */}
      <div className="relative z-20 max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Left: Image */}
        <div className="relative flex items-center justify-center order-2 lg:order-1">
          {/* Spinning dotted ring */}
          <div
            ref={dotRingRef}
            className="absolute w-[110%] h-[110%] rounded-full pointer-events-none"
            style={{
              background: 'none',
              border: '3px dashed rgba(244, 114, 182, 0.35)',
            }}
          />

          {/* Outer glow ring */}
          <div className="absolute inset-[-8px] rounded-[2.5rem] blur-2xl bg-gradient-to-br from-rose-300 to-violet-300 opacity-40 pointer-events-none" />

          {/* Main image frame */}
          <div
            ref={frameRef}
            className="relative w-full max-w-[420px] aspect-[4/5]"
            style={{ willChange: 'transform' }}
          >
            <div
              ref={imageRef}
              className="absolute inset-0 rounded-[2.5rem] overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,0.18),0_12px_30px_rgba(244,114,182,0.25)]"
            >
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={section.title || 'Akademik PG/TK'}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-rose-200 via-pink-200 to-violet-200 flex items-center justify-center">
                  <span className="text-8xl opacity-60">🎠</span>
                </div>
              )}
              {/* Color overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-rose-900/10 pointer-events-none" />
            </div>

            {/* Floating tag: bottom right */}
            <div
              ref={tag1Ref}
              className="absolute -bottom-6 -right-4 lg:-right-10 z-30 bg-white rounded-2xl px-4 py-3 shadow-[0_8px_25px_rgba(0,0,0,0.12)] flex items-center gap-3 border border-rose-100"
            >
              <span className="text-2xl">🎓</span>
              <div>
                <p className="font-fredoka font-bold text-gray-800 text-sm leading-tight">
                  Fun Learning
                </p>
                <p className="font-quicksand text-xs text-rose-500 font-semibold">
                  PG • TK A • TK B
                </p>
              </div>
            </div>

            {/* Floating tag: top left */}
            <div
              ref={tag2Ref}
              className="absolute -top-4 -left-4 lg:-left-10 z-30 bg-gradient-to-br from-violet-400 to-fuchsia-500 rounded-2xl w-16 h-16 flex items-center justify-center shadow-lg"
            >
              <span className="text-3xl">🌈</span>
            </div>
          </div>
        </div>

        {/* Right: Text */}
        <div className="flex flex-col gap-6 text-center lg:text-left items-center lg:items-start order-1 lg:order-2">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-rose-200 rounded-full px-5 py-2 shadow-sm">
            <span className="text-xl">🎠</span>
            <span className="font-quicksand font-semibold text-rose-600 text-sm tracking-wide uppercase">
              Program Bermain & Belajar
            </span>
          </div>

          <h1
            ref={titleRef}
            className="font-fredoka text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[1.05] text-gray-800"
            style={{ textShadow: '4px 4px 0px rgba(244, 114, 182, 0.15)' }}
          >
            {section.title || 'Akademik PG/TK'}
          </h1>

          {section.description && (
            <p
              ref={descRef}
              className="font-quicksand text-lg md:text-xl text-gray-600 leading-relaxed max-w-xl whitespace-pre-line"
            >
              {section.description}
            </p>
          )}

          {/* Chips */}
          <div className="flex flex-wrap gap-3 justify-center lg:justify-start mt-2">
            {[
              { icon: '🎨', label: 'Belajar Sambil Bermain' },
              { icon: '💞', label: 'Berbasis Kasih Sayang' },
              { icon: '🧸', label: 'Ramah Anak' },
            ].map((chip) => (
              <span
                key={chip.label}
                className="flex items-center gap-2 bg-white/70 backdrop-blur-sm border border-rose-100 rounded-full px-4 py-2 font-quicksand font-semibold text-sm text-gray-700 shadow-sm"
              >
                <span>{chip.icon}</span> {chip.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Wave divider → KurikulumPGTK starts with amber-50 / yellow-50 */}
      <div className="absolute bottom-[-2px] left-0 w-full overflow-hidden leading-[0]">
        <svg
          className="relative block w-full h-[80px]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="pgtkHeroWave" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fffbeb" /> {/* amber-50 */}
              <stop offset="100%" stopColor="#fdf4ff" /> {/* fuchsia-50 */}
            </linearGradient>
          </defs>
          <path
            d="M0,60 C200,110 400,10 600,60 C800,110 1000,15 1200,50 L1200,120 L0,120 Z"
            fill="url(#pgtkHeroWave)"
          />
        </svg>
      </div>
    </div>
  )
}
