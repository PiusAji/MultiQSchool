'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Section } from '@/payload-types'
import Image from 'next/image'
import Link from 'next/link'

gsap.registerPlugin(ScrollTrigger)

interface AkademikProps {
  section: Section
}

export default function Akademik({ section }: AkademikProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const awardsContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title entrance animation with bounce
      gsap.from(titleRef.current, {
        scale: 0,
        rotation: -10,
        opacity: 0,
        duration: 0.8,
        ease: 'back.out(2)',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
      })

      // Awards stagger animation
      const awards = awardsContainerRef.current?.querySelectorAll('.award-item')
      if (awards) {
        gsap.from(awards, {
          scale: 0,
          rotation: 'random(-20, 20)',
          opacity: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: awardsContainerRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        })

        // Hover effects with sparkle
        awards.forEach((award) => {
          const badge = award.querySelector('.award-badge')
          const stars = award.querySelector('.stars')

          award.addEventListener('mouseenter', () => {
            gsap.to(award, {
              y: -15,
              scale: 1.05,
              duration: 0.3,
              ease: 'power2.out',
            })
            gsap.to(badge, {
              rotation: 360,
              duration: 0.6,
              ease: 'power2.inOut',
            })
            gsap.to(stars, {
              scale: 1.2,
              opacity: 1,
              duration: 0.3,
            })
          })

          award.addEventListener('mouseleave', () => {
            gsap.to(award, {
              y: 0,
              scale: 1,
              duration: 0.3,
              ease: 'power2.out',
            })
            gsap.to(badge, {
              rotation: 0,
              duration: 0.6,
              ease: 'power2.inOut',
            })
            gsap.to(stars, {
              scale: 1,
              opacity: 0.7,
              duration: 0.3,
            })
          })
        })
      }

      // Floating confetti animation
      const confetti = sectionRef.current?.querySelectorAll('.confetti')
      if (confetti) {
        confetti.forEach((piece, index) => {
          gsap.to(piece, {
            y: 'random(-40, 40)',
            x: 'random(-30, 30)',
            rotation: 'random(-180, 180)',
            duration: 'random(2, 4)',
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: index * 0.1,
          })
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [section])

  // Get subsections (awards)
  const awards = section.subsections || []

  // Map index to page href — order matches how you added them in Payload
  const hrefMap: Record<number, string> = {
    0: '/akademik/pg-tk',
    1: '/akademik/sd',
  }

  return (
    <div
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 px-8 py-24 overflow-hidden"
    >
      {/* Decorative confetti pieces */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <div className="confetti absolute w-4 h-4 bg-yellow-400 rounded-full top-[10%] left-[15%] opacity-60" />
        <div className="confetti absolute w-3 h-3 bg-pink-400 rotate-45 top-[20%] right-[20%] opacity-60" />
        <div className="confetti absolute w-5 h-5 bg-blue-400 rounded-full bottom-[15%] left-[25%] opacity-60" />
        <div className="confetti absolute w-4 h-4 bg-green-400 rotate-45 top-[60%] left-[10%] opacity-60" />
        <div className="confetti absolute w-3 h-3 bg-purple-400 rounded-full top-[40%] right-[15%] opacity-60" />
        <div className="confetti absolute w-6 h-6 bg-orange-400 rotate-12 bottom-[25%] right-[20%] opacity-60" />
        <div className="confetti absolute w-3 h-3 bg-red-400 rounded-full top-[80%] left-[40%] opacity-60" />
        <div className="confetti absolute w-4 h-4 bg-cyan-400 rotate-45 top-[15%] right-[40%] opacity-60" />
      </div>

      {/* Large decorative stars */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute text-yellow-400 text-8xl top-[5%] left-[5%]">★</div>
        <div className="absolute text-pink-400 text-6xl top-[70%] right-[8%]">★</div>
        <div className="absolute text-blue-400 text-7xl bottom-[10%] left-[12%]">★</div>
      </div>

      <div className="relative z-20 max-w-7xl w-full">
        {/* Section Title with trophy icon */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="text-6xl">🏆</span>
            <h2
              ref={titleRef}
              className="font-fredoka text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight"
            >
              {section.title}
            </h2>
            <span className="text-6xl">🏆</span>
          </div>
          {section.subtitle && (
            <p className="font-quicksand text-xl md:text-2xl font-semibold text-gray-600 mt-4">
              {section.subtitle}
            </p>
          )}
          {section.description && (
            <p className="font-quicksand text-base md:text-lg text-gray-600 mt-4 max-w-3xl mx-auto">
              {section.description}
            </p>
          )}
        </div>

        {/* Awards Grid */}
        <div
          ref={awardsContainerRef}
          className="flex flex-wrap justify-center gap-12 max-w-5xl mx-auto"
        >
          {awards.map((award, index) => {
            const imageUrl =
              typeof section.image === 'object' && section.image
                ? (section.image as any).cloudinaryUrl || section.image.url
                : null
            const href = hrefMap[index] ?? '#'

            return (
              <Link
                key={index}
                href={href}
                className="award-item group relative bg-white rounded-3xl p-10 shadow-[0_10px_40px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.15)] transition-shadow duration-500 w-full md:w-[400px] block no-underline"
              >
                {/* Star decorations */}
                <div className="stars absolute -top-2 -right-2 text-yellow-400 text-3xl opacity-70">
                  ✨
                </div>
                <div className="stars absolute -bottom-2 -left-2 text-pink-400 text-2xl opacity-70">
                  ✨
                </div>

                {/* Award Badge/Image */}
                {imageUrl ? (
                  <div className="award-badge relative w-40 h-40 mx-auto mb-8">
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400 rounded-full blur-lg opacity-50"></div>
                    <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white shadow-xl">
                      <Image
                        src={imageUrl}
                        alt={award.title || 'Award'}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="award-badge relative w-40 h-40 mx-auto mb-8">
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400 rounded-full blur-lg opacity-50"></div>
                    <div className="relative w-full h-full rounded-full bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400 flex items-center justify-center border-4 border-white shadow-xl">
                      <span className="text-6xl">🏅</span>
                    </div>
                  </div>
                )}

                {/* Award Content */}
                <div className="text-center">
                  <h3 className="font-fredoka text-xl md:text-2xl font-bold text-gray-800 mb-3 leading-tight">
                    {award.title}
                  </h3>

                  {award.subtitle && (
                    <p className="font-quicksand text-sm md:text-base font-semibold text-purple-600 mb-2">
                      {award.subtitle}
                    </p>
                  )}

                  {award.description && (
                    <p className="font-quicksand text-sm md:text-base text-gray-600 leading-relaxed">
                      {award.description}
                    </p>
                  )}
                </div>

                {/* Arrow hint */}
                <div className="flex items-center justify-center gap-2 mt-6 text-purple-500 font-quicksand font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span>Lihat Lebih Lanjut</span>
                  <span>→</span>
                </div>

                {/* Shine effect on hover */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"></div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-[-2px] left-0 w-full overflow-hidden leading-[0]">
        <svg
          className="relative block w-full h-[80px]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          style={{ display: 'block' }}
        >
          <defs>
            <linearGradient id="pinkOrangeWaveGradient" x1="0%" y1="100%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#faf5ff" />
              <stop offset="100%" stopColor="#fdf2f8" />
            </linearGradient>
          </defs>
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            fill="url(#pinkOrangeWaveGradient)"
          />
        </svg>
      </div>
    </div>
  )
}
