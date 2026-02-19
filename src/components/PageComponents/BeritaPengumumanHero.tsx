'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Section } from '@/payload-types'
import Image from 'next/image'

gsap.registerPlugin(ScrollTrigger)

interface BeritaPengumumanHeroProps {
  section: Section
}

export default function BeritaPengumumanHero({ section }: BeritaPengumumanHeroProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const descRef = useRef<HTMLParagraphElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const floatsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance animations
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.from(titleRef.current, {
        y: 70,
        opacity: 0,
        duration: 1,
        ease: 'elastic.out(1, 0.7)',
      })
        .from(descRef.current, { y: 40, opacity: 0, duration: 0.8 }, '-=0.5')
        .from(
          imageRef.current,
          {
            scale: 0.85,
            opacity: 0,
            rotation: 5,
            duration: 1,
            ease: 'back.out(1.4)',
          },
          '-=0.7',
        )

      // Floating shapes
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
            delay: i * 0.2,
          })
        })
      }

      // Parallax on image
      gsap.to(imageRef.current, {
        y: -50,
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
      className="relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 px-6 pt-40 pb-28 -mt-[120px]"
    >
      {/* Floating background decorations */}
      <div ref={floatsRef} className="absolute inset-0 pointer-events-none z-10">
        <div className="float-shape absolute w-80 h-80 rounded-full bg-gradient-to-br from-blue-200 to-indigo-200 opacity-25 -top-20 -right-20" />
        <div className="float-shape absolute w-60 h-60 rounded-[50%_50%_30%_70%/50%_30%_70%_50%] bg-gradient-to-br from-purple-200 to-indigo-200 opacity-22 top-1/2 -left-16" />
        <div className="float-shape absolute w-44 h-44 rounded-full bg-gradient-to-br from-indigo-200 to-blue-200 opacity-20 bottom-20 right-[20%]" />
        <div className="float-shape absolute w-8 h-8 rounded-full bg-blue-400 opacity-35 top-[20%] left-[18%]" />
        <div className="float-shape absolute w-6 h-6 rounded-full bg-purple-400 opacity-35 top-[65%] right-[22%]" />
        <div className="float-shape absolute w-10 h-10 rounded-full bg-indigo-300 opacity-30 bottom-[25%] left-[40%]" />
        <div className="float-shape absolute text-blue-400 text-5xl opacity-25 top-[15%] right-[12%]">
          📰
        </div>
        <div className="float-shape absolute text-purple-400 text-4xl opacity-22 bottom-[30%] right-[8%]">
          📢
        </div>
        <div className="float-shape absolute text-indigo-400 text-3xl opacity-20 top-[55%] left-[48%]">
          ✨
        </div>
      </div>

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left: Text */}
        <div className="flex flex-col gap-6 text-center lg:text-left items-center lg:items-start">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-blue-200 rounded-full px-5 py-2 shadow-sm">
            <span className="text-xl">📰</span>
            <span className="font-quicksand font-semibold text-blue-700 text-sm tracking-wide uppercase">
              Informasi Terkini
            </span>
          </div>

          <h1
            ref={titleRef}
            className="font-fredoka text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[1.05] text-gray-800"
            style={{ textShadow: '4px 4px 0px rgba(99, 102, 241, 0.15)' }}
          >
            {section.title || 'Berita & Pengumuman'}
          </h1>

          {section.description && (
            <p
              ref={descRef}
              className="font-quicksand text-lg md:text-xl text-gray-600 leading-relaxed max-w-xl whitespace-pre-line"
            >
              {section.description}
            </p>
          )}
        </div>

        {/* Right: Portrait image */}
        {imageUrl && (
          <div className="relative flex items-center justify-center">
            <div
              ref={imageRef}
              className="relative w-full max-w-md mx-auto"
              style={{ willChange: 'transform' }}
            >
              {/* Glow behind image */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-300 to-indigo-300 opacity-30 blur-3xl rounded-3xl" />

              {/* Image container */}
              <div className="relative rounded-3xl overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,0.16),0_12px_30px_rgba(99,102,241,0.2)]">
                <Image
                  src={imageUrl}
                  alt={section.title || 'Berita dan Pengumuman'}
                  width={400}
                  height={600}
                  className="w-full h-auto object-cover"
                  priority
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/20 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Decorative badge */}
              <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl px-4 py-3 shadow-lg flex items-center gap-2 border border-blue-100">
                <span className="text-2xl">📢</span>
                <div>
                  <p className="font-fredoka font-bold text-gray-800 text-sm leading-tight">
                    Update Terbaru
                  </p>
                  <p className="font-quicksand text-xs text-blue-600 font-semibold">Multi-Q</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-[-2px] left-0 w-full overflow-hidden leading-[0]">
        <svg
          className="relative block w-full h-[80px]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="beritaHeroWave" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f0f9ff" />
              <stop offset="100%" stopColor="#fafafa" />
            </linearGradient>
          </defs>
          <path
            d="M0,60 C150,100 350,0 600,60 C850,120 1050,20 1200,60 L1200,120 L0,120 Z"
            fill="url(#beritaHeroWave)"
          />
        </svg>
      </div>
    </div>
  )
}
