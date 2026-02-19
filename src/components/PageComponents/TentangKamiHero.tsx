'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Section } from '@/payload-types'
import Image from 'next/image'

gsap.registerPlugin(ScrollTrigger)

interface TentangKamiHeroProps {
  section: Section
}

export default function TentangKamiHero({ section }: TentangKamiHeroProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const descRef = useRef<HTMLParagraphElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const blobRef = useRef<HTMLDivElement>(null)
  const floatsRef = useRef<HTMLDivElement>(null)
  const eyebrowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance timeline
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
          '-=0.4',
        )
        .from(descRef.current, { y: 40, opacity: 0, duration: 0.8 }, '-=0.5')
        .from(
          imageRef.current,
          {
            scale: 0.85,
            opacity: 0,
            rotation: 5,
            duration: 1.1,
            ease: 'back.out(1.4)',
          },
          '-=0.9',
        )

      // Blob morph animation
      gsap.to(blobRef.current, {
        borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })

      // Floating shapes
      const floats = floatsRef.current?.querySelectorAll('.float-shape')
      if (floats) {
        floats.forEach((el, i) => {
          gsap.to(el, {
            y: 'random(-28, 28)',
            x: 'random(-18, 18)',
            rotation: 'random(-12, 12)',
            duration: `random(3, 5)`,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: i * 0.25,
          })
        })
      }

      // Parallax on scroll
      gsap.to(imageRef.current, {
        y: -55,
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
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-amber-50 via-rose-50 to-orange-100 px-6 pt-40 pb-32 -mt-[120px]"
    >
      {/* Floating background decorations */}
      <div ref={floatsRef} className="absolute inset-0 pointer-events-none z-10">
        <div className="float-shape absolute w-80 h-80 rounded-[50%_50%_30%_70%/50%_30%_70%_50%] bg-gradient-to-br from-amber-200 to-orange-200 opacity-25 -top-20 -left-20" />
        <div className="float-shape absolute w-60 h-60 rounded-full bg-gradient-to-br from-rose-200 to-pink-200 opacity-22 top-1/3 -right-16" />
        <div className="float-shape absolute w-44 h-44 rounded-[40%_60%_60%_40%/60%_40%_40%_60%] bg-gradient-to-br from-orange-200 to-amber-300 opacity-20 bottom-24 left-[20%]" />
        {/* Small dots */}
        <div className="float-shape absolute w-8 h-8 rounded-full bg-amber-400 opacity-35 top-[22%] left-[18%]" />
        <div className="float-shape absolute w-6 h-6 rounded-full bg-rose-400 opacity-35 top-[60%] right-[22%]" />
        <div className="float-shape absolute w-10 h-10 rounded-full bg-orange-300 opacity-30 bottom-[20%] right-[12%]" />
        {/* Stars */}
        <div className="float-shape absolute text-amber-400 text-5xl opacity-25 top-[14%] right-[14%]">
          ✦
        </div>
        <div className="float-shape absolute text-rose-400 text-4xl opacity-22 bottom-[28%] left-[8%]">
          ✦
        </div>
        <div className="float-shape absolute text-orange-400 text-3xl opacity-20 top-[52%] left-[46%]">
          ✦
        </div>
        {/* Emoji accents */}
        <div className="float-shape absolute text-4xl opacity-20 top-[10%] left-[6%]">🌟</div>
        <div className="float-shape absolute text-3xl opacity-18 bottom-[32%] right-[6%]">💛</div>
      </div>

      {/* Main content */}
      <div className="relative z-20 max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Left: Text */}
        <div className="flex flex-col gap-6 text-center lg:text-left items-center lg:items-start">
          {/* Eyebrow */}
          <div
            ref={eyebrowRef}
            className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-amber-200 rounded-full px-5 py-2 shadow-sm"
          >
            <span className="text-xl">🏫</span>
            <span className="font-quicksand font-semibold text-amber-700 text-sm tracking-wide uppercase">
              Tentang Kami
            </span>
          </div>

          <h1
            ref={titleRef}
            className="font-fredoka text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[1.05] text-gray-800"
            style={{ textShadow: '4px 4px 0px rgba(251, 146, 60, 0.15)' }}
          >
            {section.title || 'Tentang Kami'}
          </h1>

          {section.description && (
            <p
              ref={descRef}
              className="font-quicksand text-lg md:text-xl text-gray-600 leading-relaxed max-w-xl whitespace-pre-line"
            >
              {section.description}
            </p>
          )}

          {/* Stat chips */}
          <div className="flex flex-wrap gap-3 justify-center lg:justify-start mt-2">
            {[
              { icon: '🎓', label: 'Berpengalaman' },
              { icon: '❤️', label: 'Penuh Kasih' },
              { icon: '🌱', label: 'Berbasis Karakter' },
            ].map((chip) => (
              <span
                key={chip.label}
                className="flex items-center gap-2 bg-white/70 backdrop-blur-sm border border-amber-100 rounded-full px-4 py-2 font-quicksand font-semibold text-sm text-gray-700 shadow-sm"
              >
                <span>{chip.icon}</span> {chip.label}
              </span>
            ))}
          </div>
        </div>

        {/* Right: Blob image */}
        <div className="relative flex items-center justify-center h-[420px] md:h-[540px]">
          {/* Glow behind blob */}
          <div className="absolute inset-0 m-auto w-[85%] h-[85%] bg-gradient-to-br from-amber-300 to-rose-300 opacity-30 blur-3xl rounded-full pointer-events-none" />

          {/* Rotating ring */}
          <div
            className="absolute w-[95%] h-[95%] rounded-full pointer-events-none"
            style={{
              border: '3px dashed rgba(251, 146, 60, 0.3)',
              animation: 'spin 20s linear infinite',
            }}
          />

          {/* Blob image container */}
          <div
            ref={imageRef}
            className="relative w-[80%] h-[80%] z-10"
            style={{ willChange: 'transform' }}
          >
            <div
              ref={blobRef}
              className="w-full h-full overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,0.16),0_12px_30px_rgba(251,146,60,0.2)]"
              style={{
                borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
                willChange: 'border-radius',
              }}
            >
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={section.title || 'Tentang Kami'}
                  fill
                  className="object-cover scale-110"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-amber-200 to-rose-200 flex items-center justify-center">
                  <span className="text-8xl opacity-60">🏫</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 via-transparent to-rose-400/10 pointer-events-none" />
            </div>
          </div>

          {/* Floating badge bottom-left */}
          <div className="absolute bottom-4 -left-2 lg:-left-8 z-20 bg-white rounded-2xl px-4 py-3 shadow-[0_8px_25px_rgba(0,0,0,0.12)] flex items-center gap-3 border border-amber-100">
            <span className="text-2xl">🏅</span>
            <div>
              <p className="font-fredoka font-bold text-gray-800 text-sm leading-tight">
                Sekolah Terpercaya
              </p>
              <p className="font-quicksand text-xs text-amber-600 font-semibold">Sejak 2010</p>
            </div>
          </div>

          {/* Top-right accent */}
          <div className="absolute top-4 -right-2 lg:-right-6 z-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl w-14 h-14 flex items-center justify-center shadow-lg">
            <span className="text-2xl">⭐</span>
          </div>
        </div>
      </div>

      {/* Spinning ring keyframe */}
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>

      {/* Wave divider → VisiMisi starts with violet-50 / purple-50 */}
      <div className="absolute bottom-[-2px] left-0 w-full overflow-hidden leading-[0]">
        <svg
          className="relative block w-full h-[80px]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="tkHeroWave" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f5f3ff" /> {/* violet-50 */}
              <stop offset="100%" stopColor="#faf5ff" /> {/* purple-50 */}
            </linearGradient>
          </defs>
          <path
            d="M0,60 C150,100 350,0 600,60 C850,120 1050,20 1200,60 L1200,120 L0,120 Z"
            fill="url(#tkHeroWave)"
          />
        </svg>
      </div>
    </div>
  )
}
