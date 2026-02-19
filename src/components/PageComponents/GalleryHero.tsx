'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Section, Gallery } from '@/payload-types'
import Image from 'next/image'

gsap.registerPlugin(ScrollTrigger)

interface GalleryHeroProps {
  section: Section
}

// Inject Cloudinary crop transforms — keeps subject centered on any aspect ratio
function cloudinaryFill(url: string, w: number, h: number): string {
  if (!url.includes('/upload/')) return url
  return url.replace('/upload/', `/upload/c_fill,g_auto,w_${w},h_${h}/`)
}

export default function GalleryHero({ section }: GalleryHeroProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const descRef = useRef<HTMLParagraphElement>(null)
  const eyebrowRef = useRef<HTMLDivElement>(null)
  const imageGridRef = useRef<HTMLDivElement>(null)
  const floatsRef = useRef<HTMLDivElement>(null)

  // Hero image: prefer section.image, fallback to first gallery's coverImage
  const firstGallery =
    section.galleries && section.galleries.length > 0 && typeof section.galleries[0] === 'object'
      ? (section.galleries[0] as Gallery)
      : null

  const heroImageUrl =
    typeof section.image === 'object' && section.image
      ? (section.image as any).cloudinaryUrl || section.image.url
      : firstGallery && typeof firstGallery.coverImage === 'object' && firstGallery.coverImage
        ? (firstGallery.coverImage as any).cloudinaryUrl || firstGallery.coverImage.url
        : null

  // Up to 4 thumbnails from the first gallery for the bottom strip
  const previewImages = firstGallery?.images?.slice(0, 4) ?? []

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.from(eyebrowRef.current, { y: 30, opacity: 0, duration: 0.7 })
        .from(
          titleRef.current,
          { y: 80, opacity: 0, duration: 1.1, ease: 'elastic.out(1, 0.75)' },
          '-=0.3',
        )
        .from(descRef.current, { y: 40, opacity: 0, duration: 0.8 }, '-=0.5')
        .from(
          imageGridRef.current,
          { scale: 0.9, opacity: 0, duration: 1, ease: 'back.out(1.4)' },
          '-=0.7',
        )

      // Ambient floating shapes
      const floats = floatsRef.current?.querySelectorAll('.float-el')
      if (floats) {
        floats.forEach((el, i) => {
          gsap.to(el, {
            y: 'random(-28, 28)',
            x: 'random(-14, 14)',
            rotation: 'random(-12, 12)',
            duration: `random(3, 5.5)`,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: i * 0.22,
          })
        })
      }

      // Scroll parallax
      gsap.to(imageGridRef.current, {
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
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-100 px-6 pt-40 pb-36 -mt-[120px]"
    >
      {/* Floating ambient decorations */}
      <div ref={floatsRef} className="absolute inset-0 pointer-events-none z-10">
        <div className="float-el absolute w-80 h-80 rounded-full bg-gradient-to-br from-violet-200 to-purple-200 opacity-25 -top-28 -left-20" />
        <div className="float-el absolute w-60 h-60 rounded-[60%_40%_40%_60%/50%_60%_40%_50%] bg-gradient-to-br from-indigo-200 to-violet-200 opacity-20 top-1/3 -right-24" />
        <div className="float-el absolute w-48 h-48 rounded-full bg-gradient-to-br from-fuchsia-200 to-purple-200 opacity-20 bottom-32 left-[15%]" />
        <div className="float-el absolute w-10 h-10 rounded-full bg-violet-400 opacity-35 top-[22%] left-[16%]" />
        <div className="float-el absolute w-7 h-7 rounded-full bg-indigo-400 opacity-35 top-[60%] right-[22%]" />
        <div className="float-el absolute w-9 h-9 rounded-full bg-fuchsia-400 opacity-30 bottom-[25%] right-[10%]" />
        <div className="float-el absolute text-violet-400 text-5xl opacity-25 top-[14%] right-[14%]">
          ✦
        </div>
        <div className="float-el absolute text-indigo-400 text-4xl opacity-25 bottom-[28%] left-[8%]">
          ✦
        </div>
        <div className="float-el absolute text-fuchsia-400 text-3xl opacity-20 top-[52%] left-[46%]">
          ✦
        </div>
        <div className="float-el absolute text-4xl opacity-20 top-[10%] left-[6%]">🎞️</div>
        <div className="float-el absolute text-3xl opacity-20 bottom-[22%] right-[42%]">📸</div>
      </div>

      {/* Main content */}
      <div className="relative z-20 max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">
        {/* LEFT — Text */}
        <div className="flex flex-col gap-6 text-center lg:text-left items-center lg:items-start">
          <div
            ref={eyebrowRef}
            className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-violet-200 rounded-full px-5 py-2 shadow-sm"
          >
            <span className="text-xl">🖼️</span>
            <span className="font-quicksand font-semibold text-violet-600 text-sm tracking-wide uppercase">
              Galeri Sekolah Multi-Q
            </span>
          </div>

          <h1
            ref={titleRef}
            className="font-fredoka text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[1.05] text-gray-800"
            style={{ textShadow: '4px 4px 0px rgba(139, 92, 246, 0.15)' }}
          >
            {section.title || 'Galeri Kami'}
          </h1>

          {section.description && (
            <p
              ref={descRef}
              className="font-quicksand text-lg md:text-xl text-gray-600 leading-relaxed max-w-xl whitespace-pre-line"
            >
              {section.description}
            </p>
          )}

          <div className="flex flex-wrap gap-3 justify-center lg:justify-start mt-2">
            {[
              { icon: '🎉', label: 'Kegiatan Seru' },
              { icon: '📷', label: 'Momen Berharga' },
              { icon: '🌟', label: 'Prestasi Siswa' },
            ].map((chip) => (
              <span
                key={chip.label}
                className="flex items-center gap-2 bg-white/70 backdrop-blur-sm border border-violet-100 rounded-full px-4 py-2 font-quicksand font-semibold text-sm text-gray-700 shadow-sm"
              >
                <span>{chip.icon}</span> {chip.label}
              </span>
            ))}
          </div>
        </div>

        {/* RIGHT — Featured image with thumbnail strip */}
        <div ref={imageGridRef} className="relative" style={{ willChange: 'transform' }}>
          {/* Glow behind */}
          <div className="absolute inset-[-12px] rounded-[3rem] blur-3xl bg-gradient-to-br from-violet-300 to-indigo-300 opacity-35 pointer-events-none" />

          <div className="relative rounded-[2.5rem] overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,0.18),0_12px_30px_rgba(139,92,246,0.25)] aspect-[4/3]">
            {heroImageUrl ? (
              <Image
                src={cloudinaryFill(heroImageUrl, 900, 675)}
                alt={section.title || 'Galeri'}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-violet-200 via-purple-200 to-indigo-200 flex items-center justify-center">
                <span className="text-8xl opacity-40">📸</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-violet-900/30 via-transparent to-transparent pointer-events-none" />

            {/* Thumbnail strip overlay */}
            {previewImages.length > 0 && (
              <div className="absolute bottom-4 left-4 right-4 flex gap-2 z-10">
                {previewImages.map((item, i) => {
                  const imgUrl =
                    typeof item.image === 'object' && item.image?.url ? item.image.url : null
                  if (!imgUrl) return null
                  return (
                    <div
                      key={i}
                      className="relative flex-1 aspect-square rounded-xl overflow-hidden border-2 border-white/70 shadow-lg"
                    >
                      <Image
                        src={cloudinaryFill(imgUrl, 160, 160)}
                        alt={item.caption || `Preview ${i + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Top-right badge */}
          <div className="absolute -top-4 -right-4 lg:-right-8 z-30 bg-gradient-to-br from-violet-500 to-indigo-500 rounded-2xl w-16 h-16 flex items-center justify-center shadow-lg">
            <span className="text-3xl">🎞️</span>
          </div>

          {/* Bottom-left badge */}
          <div className="absolute -bottom-6 -left-4 lg:-left-8 z-30 bg-white rounded-2xl px-4 py-3 shadow-[0_8px_25px_rgba(0,0,0,0.12)] flex items-center gap-3 border border-violet-100">
            <span className="text-2xl">📸</span>
            <div>
              <p className="font-fredoka font-bold text-gray-800 text-sm leading-tight">
                Kenangan Indah
              </p>
              <p className="font-quicksand text-xs text-violet-500 font-semibold">
                Sekolah Multi-Q
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Wave into dark GalleryGrid section */}
      <div className="absolute bottom-[-2px] left-0 w-full overflow-hidden leading-[0]">
        <svg
          className="relative block w-full h-[80px]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,60 C200,110 400,10 600,60 C800,110 1000,15 1200,50 L1200,120 L0,120 Z"
            fill="#0f0a1e"
          />
        </svg>
      </div>
    </div>
  )
}
