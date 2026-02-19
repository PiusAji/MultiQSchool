'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Section } from '@/payload-types'
import Image from 'next/image'

gsap.registerPlugin(ScrollTrigger)

interface VisiMisiProps {
  section: Section
}

export default function VisiMisi({ section }: VisiMisiProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const visiBlockRef = useRef<HTMLDivElement>(null)
  const misiBlockRef = useRef<HTMLDivElement>(null)
  const listItemsRef = useRef<HTMLUListElement>(null)
  const floatsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
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

      gsap.from(visiBlockRef.current, {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: visiBlockRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      })

      gsap.from(misiBlockRef.current, {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: misiBlockRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      })

      const items = listItemsRef.current?.querySelectorAll('.list-item')
      if (items) {
        gsap.from(items, {
          x: 40,
          opacity: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: listItemsRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        })
      }

      const floats = floatsRef.current?.querySelectorAll('.float-shape')
      if (floats) {
        floats.forEach((el, i) => {
          gsap.to(el, {
            y: 'random(-22, 22)',
            x: 'random(-12, 12)',
            rotation: 'random(-10, 10)',
            duration: `random(3, 5)`,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: i * 0.2,
          })
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const subsections = section.subsections || []
  const visiSection = subsections[0]
  const misiSection = subsections[1]

  const visiImageUrl =
    typeof visiSection?.image === 'object' && visiSection?.image
      ? (visiSection.image as any).cloudinaryUrl || visiSection.image.url
      : null

  const misiImageUrl =
    typeof misiSection?.image === 'object' && misiSection?.image
      ? (misiSection.image as any).cloudinaryUrl || misiSection.image.url
      : null

  return (
    <div
      ref={sectionRef}
      className="relative overflow-hidden bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-100 px-6 py-28"
    >
      {/* Floating background decorations */}
      <div ref={floatsRef} className="absolute inset-0 pointer-events-none z-10">
        <div className="float-shape absolute w-72 h-72 rounded-full bg-gradient-to-br from-violet-200 to-purple-200 opacity-22 -top-16 -right-16" />
        <div className="float-shape absolute w-56 h-56 rounded-[60%_40%_40%_60%/40%_60%_40%_60%] bg-gradient-to-br from-fuchsia-200 to-pink-200 opacity-20 bottom-10 -left-10" />
        <div className="float-shape absolute w-8 h-8 rounded-full bg-violet-400 opacity-30 top-[20%] left-[15%]" />
        <div className="float-shape absolute w-6 h-6 rotate-45 bg-fuchsia-400 opacity-30 top-[65%] right-[18%]" />
        <div className="float-shape absolute w-5 h-5 rounded-full bg-purple-400 opacity-30 bottom-[22%] left-[40%]" />
        <div className="float-shape absolute text-violet-400 text-5xl opacity-20 top-[12%] right-[10%]">
          ✦
        </div>
        <div className="float-shape absolute text-fuchsia-400 text-4xl opacity-18 bottom-[20%] right-[40%]">
          ✦
        </div>
      </div>

      <div className="relative z-20 max-w-5xl mx-auto flex flex-col gap-16">
        {/* Header */}
        <div className="text-center flex flex-col items-center gap-4">
          <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-violet-200 rounded-full px-5 py-2">
            <span className="text-lg">🎯</span>
            <span className="font-quicksand font-semibold text-violet-700 text-sm uppercase tracking-wider">
              Visi & Misi
            </span>
          </div>

          <h2
            ref={titleRef}
            className="font-fredoka text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight"
          >
            {section.title || 'Visi & Misi'}
          </h2>

          {section.description && (
            <p className="font-quicksand text-lg text-gray-600 max-w-2xl leading-relaxed">
              {section.description}
            </p>
          )}
        </div>

        {/* ── VISI — full width card ── */}
        {visiSection && (
          <div
            ref={visiBlockRef}
            className="relative bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-[0_15px_50px_rgba(0,0,0,0.08)] border border-violet-100"
          >
            <div className="h-2 w-full bg-gradient-to-r from-violet-400 to-purple-500" />

            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Image — object-top so faces are visible */}
              {visiImageUrl && (
                <div className="relative h-72 lg:h-auto min-h-[320px] overflow-hidden">
                  <Image
                    src={visiImageUrl}
                    alt={visiSection.title || 'Visi'}
                    fill
                    className="object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10 pointer-events-none" />
                </div>
              )}

              {/* Text */}
              <div className="p-8 md:p-12 flex flex-col justify-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center shadow-lg flex-shrink-0">
                    <span className="text-2xl">👁️</span>
                  </div>
                  <h3 className="font-fredoka text-2xl md:text-3xl font-bold text-gray-800">
                    {visiSection.title || 'Visi'}
                  </h3>
                </div>

                <div className="relative pl-6">
                  <span className="absolute -top-3 -left-1 text-7xl text-violet-200 font-serif leading-none select-none">
                    &ldquo;
                  </span>
                  {visiSection.description && (
                    <p className="font-quicksand text-base md:text-lg text-gray-600 leading-relaxed whitespace-pre-line">
                      {visiSection.description}
                    </p>
                  )}
                  <span className="absolute -bottom-8 right-0 text-7xl text-violet-200 font-serif leading-none select-none rotate-180">
                    &rdquo;
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── MISI — full width card ── */}
        {misiSection && (
          <div
            ref={misiBlockRef}
            className="relative bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-[0_15px_50px_rgba(0,0,0,0.08)] border border-fuchsia-100"
          >
            <div className="h-2 w-full bg-gradient-to-r from-fuchsia-400 to-pink-500" />

            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Text — left on desktop */}
              <div className="p-8 md:p-12 flex flex-col gap-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-fuchsia-400 to-pink-500 flex items-center justify-center shadow-lg flex-shrink-0">
                    <span className="text-2xl">🚀</span>
                  </div>
                  <h3 className="font-fredoka text-2xl md:text-3xl font-bold text-gray-800">
                    {misiSection.title || 'Misi'}
                  </h3>
                </div>

                {misiSection.listItems && misiSection.listItems.length > 0 && (
                  <ul ref={listItemsRef} className="flex flex-col gap-3">
                    {misiSection.listItems.map((item, i) => (
                      <li
                        key={i}
                        className="list-item flex items-start gap-3 bg-gradient-to-r from-fuchsia-50 to-pink-50 rounded-2xl px-4 py-3 border border-fuchsia-100"
                      >
                        {item.icon && (
                          <span className="text-xl flex-shrink-0 mt-0.5">{item.icon}</span>
                        )}
                        <span className="font-quicksand text-sm md:text-base text-gray-700 leading-relaxed">
                          {item.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}

                {(!misiSection.listItems || misiSection.listItems.length === 0) &&
                  misiSection.description && (
                    <p className="font-quicksand text-base text-gray-600 leading-relaxed whitespace-pre-line border-l-4 border-fuchsia-300 pl-4">
                      {misiSection.description}
                    </p>
                  )}
              </div>

              {/* Image — right on desktop, object-top so faces are visible */}
              {misiImageUrl && (
                <div className="relative h-72 lg:h-auto min-h-[320px] overflow-hidden order-first lg:order-last">
                  <Image
                    src={misiImageUrl}
                    alt={misiSection.title || 'Misi'}
                    fill
                    className="object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-l from-transparent to-white/10 pointer-events-none" />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Wave divider → MetodeMengajar teal-50/cyan-50 */}
      <div className="absolute bottom-[-2px] left-0 w-full overflow-hidden leading-[0]">
        <svg
          className="relative block w-full h-[80px]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="visiMisiWave" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f0fdfa" />
              <stop offset="100%" stopColor="#ecfeff" />
            </linearGradient>
          </defs>
          <path
            d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
            fill="url(#visiMisiWave)"
          />
        </svg>
      </div>
    </div>
  )
}
