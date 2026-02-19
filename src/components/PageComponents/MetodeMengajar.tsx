'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Section } from '@/payload-types'
import Image from 'next/image'

gsap.registerPlugin(ScrollTrigger)

interface MetodeMengajarProps {
  section: Section
}

export default function MetodeMengajar({ section }: MetodeMengajarProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  const floatsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
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

      // Cards stagger pop in
      const cards = cardsRef.current?.querySelectorAll('.method-card')
      if (cards) {
        gsap.from(cards, {
          y: 80,
          opacity: 0,
          scale: 0.92,
          duration: 0.9,
          stagger: 0.2,
          ease: 'back.out(1.5)',
          scrollTrigger: {
            trigger: cardsRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        })

        // Hover interactions
        cards.forEach((card) => {
          const overlay = card.querySelector('.card-overlay')
          const content = card.querySelector('.card-content')
          const image = card.querySelector('.card-image')

          card.addEventListener('mouseenter', () => {
            gsap.to(overlay, { opacity: 1, duration: 0.4, ease: 'power2.out' })
            gsap.to(content, { y: -8, duration: 0.4, ease: 'power2.out' })
            gsap.to(image, { scale: 1.06, duration: 0.6, ease: 'power2.out' })
          })

          card.addEventListener('mouseleave', () => {
            gsap.to(overlay, { opacity: 0, duration: 0.4, ease: 'power2.out' })
            gsap.to(content, { y: 0, duration: 0.4, ease: 'power2.out' })
            gsap.to(image, { scale: 1, duration: 0.6, ease: 'power2.out' })
          })
        })
      }

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
            delay: i * 0.22,
          })
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const subsections = section.subsections || []
  const method1 = subsections[0]
  const method2 = subsections[1]

  const method1ImageUrl =
    typeof method1?.image === 'object' && method1?.image?.url ? method1.image.url : null
  const method2ImageUrl =
    typeof method2?.image === 'object' && method2?.image?.url ? method2.image.url : null

  const methodAccents = [
    {
      gradient: 'from-teal-400 to-cyan-500',
      lightBg: 'from-teal-50 to-cyan-50',
      border: 'border-teal-100',
      tag: 'bg-teal-500',
      glow: 'rgba(20,184,166,0.2)',
      emoji: '🧠',
      number: '01',
    },
    {
      gradient: 'from-cyan-400 to-sky-500',
      lightBg: 'from-cyan-50 to-sky-50',
      border: 'border-cyan-100',
      tag: 'bg-cyan-500',
      glow: 'rgba(6,182,212,0.2)',
      emoji: '💡',
      number: '02',
    },
  ]

  const methods = [method1, method2].filter(Boolean)

  return (
    <div
      ref={sectionRef}
      className="relative overflow-hidden bg-gradient-to-br from-teal-50 via-cyan-50 to-sky-100 px-6 py-28"
    >
      {/* Floating background decorations */}
      <div ref={floatsRef} className="absolute inset-0 pointer-events-none z-10">
        <div className="float-shape absolute w-80 h-80 rounded-full bg-gradient-to-br from-teal-200 to-cyan-200 opacity-22 -top-20 -left-16" />
        <div className="float-shape absolute w-64 h-64 rounded-[50%_50%_30%_70%/50%_30%_70%_50%] bg-gradient-to-br from-sky-200 to-cyan-200 opacity-20 -bottom-16 -right-16" />
        <div className="float-shape absolute w-40 h-40 rounded-full bg-gradient-to-br from-cyan-200 to-teal-200 opacity-18 top-1/2 right-[10%]" />
        {/* Small accents */}
        <div className="float-shape absolute w-8 h-8 rounded-full bg-teal-400 opacity-30 top-[18%] right-[20%]" />
        <div className="float-shape absolute w-6 h-6 rotate-45 bg-cyan-400 opacity-30 top-[60%] left-[12%]" />
        <div className="float-shape absolute w-10 h-10 rounded-full bg-sky-300 opacity-25 bottom-[25%] left-[35%]" />
        <div className="float-shape absolute text-teal-400 text-5xl opacity-18 top-[10%] left-[8%]">
          ◆
        </div>
        <div className="float-shape absolute text-cyan-400 text-4xl opacity-18 bottom-[15%] right-[8%]">
          ◆
        </div>
      </div>

      <div className="relative z-20 max-w-7xl mx-auto flex flex-col gap-16">
        {/* Header */}
        <div className="text-center flex flex-col items-center gap-4">
          <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-teal-200 rounded-full px-5 py-2">
            <span className="text-lg">📚</span>
            <span className="font-quicksand font-semibold text-teal-700 text-sm uppercase tracking-wider">
              Metode Mengajar
            </span>
          </div>

          <h2
            ref={titleRef}
            className="font-fredoka text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight"
          >
            {section.title || 'Metode Mengajar'}
          </h2>

          {/* Animated underline */}
          <svg className="w-72 h-4 -mt-1" viewBox="0 0 288 16" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0,8 Q36,0 72,8 T144,8 T216,8 T288,8"
              fill="none"
              stroke="url(#metodeLine)"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="metodeLine" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#14b8a6" />
                <stop offset="100%" stopColor="#0ea5e9" />
              </linearGradient>
            </defs>
          </svg>

          {section.description && (
            <p className="font-quicksand text-lg text-gray-600 max-w-2xl leading-relaxed">
              {section.description}
            </p>
          )}
        </div>

        {/* Method Cards */}
        <div ref={cardsRef} className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          {methods.map((method, index) => {
            const imageUrl = index === 0 ? method1ImageUrl : method2ImageUrl
            const accent = methodAccents[index]

            return (
              <div
                key={index}
                className={`method-card group relative bg-white rounded-3xl overflow-hidden shadow-[0_15px_50px_rgba(0,0,0,0.09)] border ${accent.border} cursor-default`}
                style={{ boxShadow: `0 15px 50px ${accent.glow}, 0 5px 15px rgba(0,0,0,0.06)` }}
              >
                {/* Image area */}
                <div className="relative h-64 overflow-hidden">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={method.title || `Metode ${index + 1}`}
                      fill
                      className="card-image object-cover transition-transform duration-700"
                    />
                  ) : (
                    <div
                      className={`card-image w-full h-full bg-gradient-to-br ${accent.lightBg} flex items-center justify-center`}
                    >
                      <span className="text-8xl opacity-40">{accent.emoji}</span>
                    </div>
                  )}

                  {/* Gradient overlay on hover */}
                  <div
                    className={`card-overlay absolute inset-0 bg-gradient-to-t ${accent.gradient} opacity-0 mix-blend-multiply`}
                  />

                  {/* Number badge */}
                  <div
                    className={`absolute top-4 left-4 ${accent.tag} text-white font-fredoka font-bold text-lg w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg`}
                  >
                    {accent.number}
                  </div>

                  {/* Emoji badge */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm w-12 h-12 rounded-2xl flex items-center justify-center shadow-md text-2xl">
                    {accent.emoji}
                  </div>
                </div>

                {/* Content */}
                <div className="card-content p-8 flex flex-col gap-3">
                  <h3 className="font-fredoka text-2xl md:text-3xl font-bold text-gray-800 leading-tight">
                    {method.title}
                  </h3>

                  {method.description && (
                    <p className="font-quicksand text-base md:text-lg text-gray-600 leading-relaxed">
                      {method.description}
                    </p>
                  )}

                  {/* Bottom accent bar */}
                  <div
                    className={`h-1 w-16 rounded-full bg-gradient-to-r ${accent.gradient} mt-2 group-hover:w-full transition-all duration-500`}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Wave divider at bottom */}
      <div className="absolute bottom-[-2px] left-0 w-full overflow-hidden leading-[0]">
        <svg
          className="relative block w-full h-[80px]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="metodeWave" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f0f9ff" /> {/* sky-50 */}
              <stop offset="100%" stopColor="#f0fdfa" /> {/* teal-50 */}
            </linearGradient>
          </defs>
          <path
            d="M0,60 C200,110 400,10 600,60 C800,110 1000,15 1200,50 L1200,120 L0,120 Z"
            fill="url(#metodeWave)"
          />
        </svg>
      </div>
    </div>
  )
}
