'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Section } from '@/payload-types'
import Image from 'next/image'

gsap.registerPlugin(ScrollTrigger)

interface HighlightKamiProps {
  section: Section
}

export default function HighlightKami({ section }: HighlightKamiProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Floating shapes animation (same as HomeHero)
      const shapes = sectionRef.current?.querySelectorAll('.shape')
      if (shapes) {
        shapes.forEach((shape, index) => {
          gsap.to(shape, {
            y: 'random(-30, 30)',
            x: 'random(-20, 20)',
            rotation: 'random(-15, 15)',
            duration: 'random(3, 5)',
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: index * 0.2,
          })
        })
      }

      const setupAnimations = () => {
        ScrollTrigger.refresh(true)

        // Title entrance animation — animates TO visible from CSS-set hidden state
        gsap.to(titleRef.current, {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        })

        // Cards stagger animation
        const cards = cardsRef.current?.querySelectorAll('.highlight-card')
        if (cards) {
          gsap.to(cards, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: cardsRef.current,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
            },
          })

          // Hover effects
          cards.forEach((card) => {
            const imageContainer = card.querySelector('.image-container')

            card.addEventListener('mouseenter', () => {
              gsap.to(card, {
                y: -12,
                scale: 1.02,
                duration: 0.4,
                ease: 'power2.out',
              })
              gsap.to(imageContainer, {
                scale: 1.1,
                duration: 0.6,
                ease: 'power2.out',
              })
            })

            card.addEventListener('mouseleave', () => {
              gsap.to(card, {
                y: 0,
                scale: 1,
                duration: 0.4,
                ease: 'power2.out',
              })
              gsap.to(imageContainer, {
                scale: 1,
                duration: 0.6,
                ease: 'power2.out',
              })
            })
          })
        }
      }

      // Double rAF ensures layout is settled after Next.js hydration
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setupAnimations()
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [section])

  // Get subsections with proper type checking
  const subsections = section.subsections || []

  return (
    <div
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-100 to-pink-100 px-8 pt-24 py-36 overflow-hidden"
    >
      {/* Floating decorative shapes - same as HomeHero */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <div className="shape absolute w-48 h-48 rounded-[30%_70%_70%_30%/30%_30%_70%_70%] bg-gradient-to-br from-pink-400 to-rose-500 opacity-15 top-[10%] left-[5%]" />
        <div className="shape absolute w-36 h-36 rounded-[70%_30%_30%_70%/60%_40%_60%_40%] bg-gradient-to-br from-blue-400 to-cyan-400 opacity-15 top-[60%] left-[10%]" />
        <div className="shape absolute w-44 h-44 rounded-[40%_60%_60%_40%/60%_30%_70%_40%] bg-gradient-to-br from-emerald-400 to-teal-400 opacity-15 top-[20%] right-[8%]" />
        <div className="shape absolute w-32 h-32 rounded-[30%_70%_70%_30%/30%_30%_70%_70%] bg-gradient-to-br from-amber-400 to-yellow-400 opacity-15 bottom-[15%] right-[15%]" />
        <div className="shape absolute w-24 h-24 rounded-full bg-gradient-to-br from-cyan-200 to-pink-200 opacity-15 top-1/2 left-1/2" />
        <div className="shape absolute w-36 h-36 rounded-[60%_40%_30%_70%/60%_30%_70%_40%] bg-gradient-to-br from-orange-300 to-amber-300 opacity-15 bottom-[30%] left-[20%]" />
      </div>

      <div className="relative z-10 max-w-7xl w-full">
        {/* Section Title — hidden via CSS, GSAP animates to visible */}
        <div className="text-center mb-16">
          <h2
            ref={titleRef}
            className="font-fredoka text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight"
            style={{
              opacity: 0,
              transform: 'translateY(50px)',
              textShadow: '2px 2px 0px rgba(251, 146, 60, 0.15)',
            }}
          >
            {section.title}
          </h2>
          {section.subtitle && (
            <p className="font-quicksand text-xl md:text-2xl font-semibold text-gray-600 mt-4">
              {section.subtitle}
            </p>
          )}
        </div>

        {/* Subsections Grid — cards hidden via CSS, GSAP animates to visible */}
        <div ref={cardsRef} className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {subsections.map((subsection, index) => {
            const imageUrl =
              typeof subsection.image === 'object' && subsection.image
                ? (subsection.image as any).cloudinaryUrl || subsection.image.url
                : null

            return (
              <div
                key={index}
                className="highlight-card group bg-white/70 backdrop-blur-sm rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:shadow-[0_30px_70px_rgba(0,0,0,0.15)] transition-shadow duration-500"
                style={{ opacity: 0, transform: 'translateY(80px)' }}
              >
                {/* Image */}
                {imageUrl && (
                  <div className="relative w-full h-64 md:h-80 overflow-hidden">
                    <div className="image-container absolute inset-0">
                      <Image
                        src={imageUrl}
                        alt={subsection.title || 'Highlight image'}
                        fill
                        className="object-cover"
                      />
                    </div>
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                )}

                {/* Content */}
                <div className="p-8 md:p-10">
                  <h3 className="font-fredoka text-2xl md:text-3xl font-bold text-gray-800 mb-4 leading-tight">
                    {subsection.title}
                  </h3>

                  {subsection.subtitle && (
                    <h4 className="font-quicksand text-lg md:text-xl font-semibold text-gray-600 mb-3">
                      {subsection.subtitle}
                    </h4>
                  )}

                  {subsection.description && (
                    <p className="font-quicksand text-base md:text-lg text-gray-600 leading-relaxed whitespace-pre-line">
                      {subsection.description}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Wave divider at bottom of 3rd section */}
      <div className="absolute bottom-[-2px] left-0 w-full overflow-hidden leading-[0]">
        <svg
          className="relative block w-full h-[80px]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          style={{ display: 'block' }}
        >
          <defs>
            <linearGradient id="purpleWaveGradient" x1="0%" y1="100%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#faf5ff" /> {/* purple-50 - LEFT */}
              <stop offset="80%" stopColor="#eef2ff" /> {/* indigo-50 - MIDDLE-RIGHT */}
              <stop offset="100%" stopColor="#eff2ff" /> {/* blue-50 - RIGHT */}
            </linearGradient>
          </defs>
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            fill="url(#purpleWaveGradient)"
          />
        </svg>
      </div>
    </div>
  )
}
