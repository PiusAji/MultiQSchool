'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import useEmblaCarousel from 'embla-carousel-react'
import type { Section, Gallery, Media } from '@/payload-types'
import Image from 'next/image'

gsap.registerPlugin(ScrollTrigger)

interface GalleryGridProps {
  section: Section
}

function cloudinaryFill(url: string, w: number, h: number): string {
  if (!url.includes('/upload/')) return url
  return url.replace('/upload/', `/upload/c_fill,g_auto,w_${w},h_${h}/`)
}

function getMediaUrl(media: string | Media | null | undefined): string | null {
  if (!media) return null
  if (typeof media === 'object') {
    return (media as any).cloudinaryUrl || media.url || null
  }
  return null
}

// ─── Mobile simple carousel ───────────────────────────────────────────────
function MobileCarousel({
  slides,
  title,
}: {
  slides: { url: string; caption: string | null }[]
  title: string
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 50 })
  const [selectedIndex, setSelectedIndex] = useState(0)

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    emblaApi.on('select', onSelect)
    return () => {
      emblaApi.off('select', onSelect)
    }
  }, [emblaApi, onSelect])

  return (
    <div className="relative w-full h-full">
      <div className="overflow-hidden rounded-2xl h-full" ref={emblaRef}>
        <div className="flex h-full">
          {slides.map((slide, i) => (
            <div key={i} className="flex-[0_0_100%] relative h-full">
              <Image
                src={cloudinaryFill(slide.url, 800, 600)}
                alt={slide.caption || title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
              {slide.caption && (
                <p className="absolute bottom-4 left-4 font-quicksand text-white text-xs font-semibold">
                  {slide.caption}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Counter + nav row */}
      <div className="absolute bottom-4 right-4 flex items-center gap-3 z-10">
        <button
          onClick={() => emblaApi?.scrollPrev()}
          className="font-quicksand text-xs font-semibold uppercase tracking-widest text-violet-300/70 hover:text-violet-300 transition-colors"
        >
          Back
        </button>
        <span className="font-fredoka text-sm text-violet-300/80 tabular-nums">
          {String(selectedIndex + 1).padStart(2, '0')} — {String(slides.length).padStart(2, '0')}
        </span>
        <button
          onClick={() => emblaApi?.scrollNext()}
          className="font-quicksand text-xs font-semibold uppercase tracking-widest text-violet-300/70 hover:text-violet-300 transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  )
}

// ─── Split-panel carousel ──────────────────────────────────────────────────
// Left panel = its own Embla starting at index 0
// Right panel = its own Embla starting at index 1
// They stay offset by 1 and scroll in sync → true sliding split effect
function GalleryCarousel({ gallery, index }: { gallery: Gallery; index: number }) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)

  // duration: 50 → Embla's built-in ease = fast start, smooth deceleration (lerp feel)
  const [leftRef, leftApi] = useEmblaCarousel({ loop: true, watchDrag: false, duration: 40 })
  const [rightRef, rightApi] = useEmblaCarousel({ loop: true, watchDrag: false, duration: 40 })

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const slides = (gallery.images ?? [])
    .map((item) => ({
      url: getMediaUrl(item.image as Media),
      caption: item.caption ?? null,
    }))
    .filter((s): s is { url: string; caption: string | null } => !!s.url)

  const totalSlides = slides.length
  const isReversed = index % 2 === 1

  // Sync right panel to always be 1 ahead of left
  const syncRight = useCallback(() => {
    if (!rightApi || !leftApi) return
    const leftSnap = leftApi.selectedScrollSnap()
    const rightTarget = (leftSnap + 1) % totalSlides
    rightApi.scrollTo(rightTarget, true) // true = instant, no animation on right init
  }, [leftApi, rightApi, totalSlides])

  // When left settles, update counter and keep right in sync
  const onLeftSelect = useCallback(() => {
    if (!leftApi) return
    setSelectedIndex(leftApi.selectedScrollSnap())
  }, [leftApi])

  useEffect(() => {
    if (!leftApi || !rightApi) return
    // Normal: left=0, right=1 | Reversed: left=1, right=0 (big panel is on right)
    if (isReversed) {
      leftApi.scrollTo(1, true)
    } else {
      rightApi.scrollTo(1, true)
    }
    leftApi.on('select', onLeftSelect)
    return () => {
      leftApi.off('select', onLeftSelect)
    }
  }, [leftApi, rightApi, onLeftSelect, isReversed])

  // Scroll entrance animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: 'top 82%',
          toggleActions: 'play none none reverse',
        },
      })
      const carouselPanels = wrapperRef.current?.querySelector('.carousel-panels')
      if (carouselPanels) {
        gsap.from(carouselPanels, {
          y: 60,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        })
      }
    }, wrapperRef)
    return () => ctx.revert()
  }, [])

  const scrollNext = useCallback(() => {
    if (!leftApi || !rightApi || isAnimating) return
    setIsAnimating(true)
    leftApi.scrollNext()
    rightApi.scrollNext()
    setTimeout(() => setIsAnimating(false), 500)
  }, [leftApi, rightApi, isAnimating])

  const scrollPrev = useCallback(() => {
    if (!leftApi || !rightApi || isAnimating) return
    setIsAnimating(true)
    leftApi.scrollPrev()
    rightApi.scrollPrev()
    setTimeout(() => setIsAnimating(false), 500)
  }, [leftApi, rightApi, isAnimating])

  const categoryLabels: Record<string, string> = {
    'pentas-seni': '🎭 Pentas Seni',
    outing: '🌳 Outing',
    competition: '🏆 Competition',
    wisuda: '🎓 Wisuda',
    other: '📌 Kegiatan',
  }

  const formatDate = (d?: string | null) => {
    if (!d) return ''
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(d))
  }

  if (slides.length === 0) return null

  return (
    <div ref={wrapperRef} className="flex flex-col gap-8">
      {/* Activity header */}
      <div ref={titleRef} className="flex items-end justify-between gap-4 flex-wrap px-6 lg:px-16">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="inline-flex items-center gap-1.5 bg-violet-500/20 border border-violet-400/30 text-violet-300 rounded-full px-3 py-1 text-xs font-quicksand font-semibold">
              {categoryLabels[gallery.category] ?? '📌 Kegiatan'}
            </span>
            {gallery.date && (
              <span className="text-white/40 font-quicksand text-xs">
                {formatDate(gallery.date)}
              </span>
            )}
          </div>
          <h3 className="font-fredoka text-3xl md:text-4xl font-bold text-white leading-tight">
            {gallery.title}
          </h3>
        </div>
      </div>

      {/* MOBILE — simple single slide carousel */}
      <div className="carousel-panels md:hidden relative w-full h-[320px]">
        <MobileCarousel slides={slides} title={gallery.title} />
      </div>

      {/* DESKTOP — split panel carousel */}
      <div
        className={`carousel-panels hidden md:flex relative w-full h-[560px] lg:h-[640px] ${isReversed ? 'flex-row-reverse' : ''}`}
      >
        {/* LEFT panel — big, Embla instance A */}
        <div
          className={`relative flex-[3] overflow-hidden ${isReversed ? 'rounded-r-2xl' : 'rounded-l-2xl'}`}
          ref={leftRef}
        >
          <div className="flex h-full">
            {slides.map((slide, i) => (
              <div key={i} className="flex-[0_0_100%] relative h-full">
                <Image
                  src={cloudinaryFill(slide.url, 1200, 900)}
                  alt={slide.caption || gallery.title}
                  fill
                  className="object-cover"
                  priority={index === 0 && i === 0}
                />
                {/* Bottom gradient + caption */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent pointer-events-none" />
                {slide.caption && (
                  <div className="absolute bottom-6 left-6">
                    <p className="font-quicksand text-white text-sm font-semibold">
                      {slide.caption}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CENTER controls column */}
        <div className="relative z-10 flex flex-col items-center justify-center gap-10 py-10 px-6 bg-[#0f0a1e] flex-shrink-0 w-[130px] md:w-[180px]">
          {/* Counter — single line x / y */}
          <p
            className="font-fredoka text-2xl md:text-3xl font-bold tabular-nums tracking-tight text-center whitespace-nowrap"
            style={{ color: 'rgba(167,139,250,0.9)' }}
          >
            {String(selectedIndex + 1).padStart(2, '0')}
            <span className="text-white/20 mx-1.5">—</span>
            {String(totalSlides).padStart(2, '0')}
          </p>

          {/* Back / Next — single line each, generous gap */}
          <div className="flex flex-col items-center gap-6">
            <button
              onClick={scrollPrev}
              className="font-quicksand font-semibold text-sm tracking-widest uppercase transition-colors duration-300"
              style={{ color: 'rgba(167,139,250,0.55)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(167,139,250,1)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(167,139,250,0.55)')}
            >
              Back
            </button>
            <div className="w-px h-8 bg-violet-400/20" />
            <button
              onClick={scrollNext}
              className="font-quicksand font-semibold text-sm tracking-widest uppercase transition-colors duration-300"
              style={{ color: 'rgba(167,139,250,0.55)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(167,139,250,1)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(167,139,250,1)')}
            >
              Next
            </button>
          </div>
        </div>

        {/* RIGHT panel — peek, Embla instance B (offset +1) */}
        <div
          className={`relative flex-[2] overflow-hidden ${isReversed ? 'rounded-l-2xl' : 'rounded-r-2xl'} cursor-pointer group`}
          ref={rightRef}
          onClick={scrollNext}
        >
          <div className="flex h-full">
            {slides.map((slide, i) => (
              <div key={i} className="flex-[0_0_100%] relative h-full">
                <Image
                  src={cloudinaryFill(slide.url, 800, 900)}
                  alt={slide.caption || gallery.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
                {/* Dim overlay — lifts on hover hinting it's clickable */}
                <div className="absolute inset-0 bg-black/35 group-hover:bg-black/10 transition-colors duration-500 pointer-events-none" />
              </div>
            ))}
          </div>
          {/* Arrow hint on hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="w-14 h-14 rounded-full bg-white/15 backdrop-blur-sm border border-white/30 flex items-center justify-center">
              <span className="text-white text-2xl">›</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main exported section ─────────────────────────────────────────────────
export default function GalleryGrid({ section }: GalleryGridProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)

  const galleries = (section.galleries?.filter((g) => typeof g === 'object') ?? []) as Gallery[]

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        y: 50,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: titleRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={sectionRef} className="relative bg-[#0f0a1e] py-24 overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[400px] rounded-full bg-violet-900/30 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[400px] rounded-full bg-indigo-900/30 blur-[100px]" />
      </div>

      <div className="relative z-10 flex flex-col gap-20">
        {/* Section header — padded */}
        <div className="text-center flex flex-col items-center gap-4 px-6">
          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-400/20 rounded-full px-5 py-2">
            <span className="text-lg">🎬</span>
            <span className="font-quicksand font-semibold text-violet-300 text-sm uppercase tracking-widest">
              Highlight Kegiatan
            </span>
          </div>
          <h2
            ref={titleRef}
            className="font-fredoka text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight"
            style={{ textShadow: '0 0 60px rgba(139, 92, 246, 0.4)' }}
          >
            {section.title || 'Galeri Kegiatan'}
          </h2>
          <div className="h-1 w-32 rounded-full bg-gradient-to-r from-violet-500 to-indigo-400 shadow-[0_0_20px_rgba(139,92,246,0.6)]" />
        </div>

        {/* Galleries — full width, no horizontal padding */}
        {galleries.length === 0 ? (
          <div className="text-center py-20 px-6">
            <p className="font-quicksand text-white/40 text-xl">Belum ada galeri.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-24">
            {galleries.map((gallery, i) => (
              <div key={gallery.id} className="px-6 lg:px-0">
                <GalleryCarousel gallery={gallery} index={i} />
                {i < galleries.length - 1 && (
                  <div className="mt-24 mx-6 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Wave out to footer */}
      <div className="absolute bottom-[-2px] left-0 w-full overflow-hidden leading-[0]">
        <svg
          className="relative block w-full h-[70px]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,60 C150,100 350,0 600,60 C850,120 1050,20 1200,60 L1200,120 L0,120 Z"
            fill="#f9fafb"
          />
        </svg>
      </div>
    </div>
  )
}
