'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Section } from '@/payload-types'
import Image from 'next/image'
import TentangKami from './TentangKami'
import HighlightKami from './HighlightKami'

gsap.registerPlugin(ScrollTrigger)

interface HomeHeroProps {
  section: Section
  nextSection?: Section
  highlightSection?: Section
}

export default function HomeHero({ section, nextSection, highlightSection }: HomeHeroProps) {
  const heroRef = useRef<HTMLDivElement>(null)
  const scrollSectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const imageBlobRef = useRef<HTMLDivElement>(null)
  const shapesRef = useRef<HTMLDivElement>(null)
  const tentangKamiRef = useRef<HTMLDivElement>(null)
  const tentangKamiContentRef = useRef<HTMLDivElement>(null)

  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile on mount and resize
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    // Check if we're on mobile (viewport width < 1024px for lg breakpoint)
    const checkMobile = () => window.innerWidth < 1024
    let isMobileLocal = checkMobile()

    const ctx = gsap.context(() => {
      // Initial hero entrance animation (works on all devices)
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.from(titleRef.current, {
        y: 100,
        opacity: 0,
        duration: 1.2,
        ease: 'elastic.out(1, 0.8)',
      })
        .from(
          subtitleRef.current,
          {
            y: 50,
            opacity: 0,
            duration: 0.8,
          },
          '-=0.6',
        )
        .from(
          imageRef.current,
          {
            scale: 0.8,
            opacity: 0,
            duration: 1,
            ease: 'back.out(1.4)',
          },
          '-=0.8',
        )

      // Floating shapes animation (works on all devices)
      const shapes = shapesRef.current?.querySelectorAll('.shape')
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

      const setupDesktopAnimations = () => {
        if (
          nextSection &&
          tentangKamiRef.current &&
          imageBlobRef.current &&
          imageRef.current &&
          scrollSectionRef.current
        ) {
          // Initially hide text content
          if (tentangKamiContentRef.current) {
            const contentElements =
              tentangKamiContentRef.current.querySelectorAll('.animate-content')
            gsap.set(contentElements, {
              opacity: 0,
              x: 50,
            })
          }

          // SCROLL-BASED: Morph animation as you scroll down
          gsap.to(imageBlobRef.current, {
            scrollTrigger: {
              trigger: scrollSectionRef.current,
              start: 'top top',
              end: 'center center',
              scrub: 0.5,
            },
            borderRadius: '2% 2% 2% 2% / 2% 2% 2% 2%',
            rotation: 0,
            ease: 'power2.inOut',
          })

          // TRIGGER-BASED: Slide and reveal when reaching TentangKami center
          ScrollTrigger.create({
            trigger: tentangKamiRef.current,
            start: 'center center',
            onEnter: () => {
              const moveLeftDistance = '-105%'
              const moveDownDistance = '105vh'

              // Slide animation (time-based, not scroll-based)
              gsap.to(imageRef.current, {
                x: moveLeftDistance,
                y: moveDownDistance,
                duration: 1.2,
                ease: 'power3.out',
              })

              // Reveal text content
              if (tentangKamiContentRef.current) {
                const contentElements =
                  tentangKamiContentRef.current.querySelectorAll('.animate-content')

                gsap.to(contentElements, {
                  opacity: 1,
                  x: 0,
                  duration: 0.8,
                  stagger: 0.1,
                  ease: 'power2.out',
                  delay: 0.4,
                })
              }
            },
            onLeaveBack: () => {
              // Reset slide on scroll back
              gsap.to(imageRef.current, {
                x: 0,
                y: 0,
                duration: 1,
                ease: 'power3.in',
              })

              // Hide text
              if (tentangKamiContentRef.current) {
                const contentElements =
                  tentangKamiContentRef.current.querySelectorAll('.animate-content')

                gsap.to(contentElements, {
                  opacity: 0,
                  x: 50,
                  duration: 0.6,
                  stagger: 0.05,
                })
              }
            },
          })

          // PIN: Keep the section pinned while animations happen
          ScrollTrigger.create({
            trigger: scrollSectionRef.current,
            start: 'top top',
            end: () => `+=${tentangKamiRef.current?.offsetHeight || 1000}`,
            pin: true,
            anticipatePin: 1,
            onLeave: () => {
              ScrollTrigger.refresh()
            },
            onEnterBack: () => {
              ScrollTrigger.refresh()
            },
          })
        }
      }

      const setupMobileLayout = () => {
        // MOBILE: Show text content immediately (no animation)
        if (tentangKamiContentRef.current) {
          const contentElements = tentangKamiContentRef.current.querySelectorAll('.animate-content')
          gsap.set(contentElements, {
            opacity: 1,
            x: 0,
          })
        }

        // Reset image position and shape
        if (imageRef.current) {
          gsap.set(imageRef.current, {
            x: 0,
            y: 0,
          })
        }

        // Reset blob shape to square on mobile
        if (imageBlobRef.current) {
          gsap.set(imageBlobRef.current, {
            borderRadius: '16px',
            rotation: 0,
          })
        }
      }

      // Setup based on initial viewport
      if (!isMobileLocal) {
        setupDesktopAnimations()
      } else {
        setupMobileLayout()
      }

      // Handle resize
      const handleResize = () => {
        const nowMobile = checkMobile()

        if (nowMobile !== isMobileLocal) {
          isMobileLocal = nowMobile

          // Kill all existing ScrollTriggers
          ScrollTrigger.getAll().forEach((st) => st.kill())

          // Reset transforms
          if (imageRef.current) {
            gsap.set(imageRef.current, { clearProps: 'all' })
          }
          if (imageBlobRef.current) {
            gsap.set(imageBlobRef.current, { clearProps: 'all' })
          }

          // Setup appropriate layout
          if (!isMobileLocal) {
            setupDesktopAnimations()
          } else {
            setupMobileLayout()
          }
        }
      }

      window.addEventListener('resize', handleResize)

      // Fade out shapes during scroll (works on all devices)
      gsap.to(shapesRef.current, {
        opacity: 0,
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'center top',
          scrub: 1,
        },
      })

      return () => {
        window.removeEventListener('resize', handleResize)
      }
    }, scrollSectionRef)

    return () => ctx.revert()
  }, [nextSection])

  const imageUrl =
    typeof section.image === 'object' && section.image
      ? (section.image as any).cloudinaryUrl || section.image.url
      : null

  return (
    <>
      {/* Pinned scroll section containing both Hero and TentangKami stacked vertically */}
      <div ref={scrollSectionRef} className="relative">
        {/* Hero Section */}
        <div
          ref={heroRef}
          className="relative min-h-screen flex items-center justify-center overflow-visible bg-gradient-to-br from-amber-50 via-orange-100 to-amber-200 px-8 pt-40 lg:pt-64 pb-26 -mt-[120px]"
        >
          {/* Floating decorative shapes */}
          <div ref={shapesRef} className="absolute inset-0 pointer-events-none z-10">
            <div className="shape absolute w-48 h-48 rounded-[30%_70%_70%_30%/30%_30%_70%_70%] bg-gradient-to-br from-pink-400 to-rose-500 opacity-15 top-[10%] left-[5%]" />
            <div className="shape absolute w-36 h-36 rounded-[70%_30%_30%_70%/60%_40%_60%_40%] bg-gradient-to-br from-blue-400 to-cyan-400 opacity-15 top-[60%] left-[10%]" />
            <div className="shape absolute w-44 h-44 rounded-[40%_60%_60%_40%/60%_30%_70%_40%] bg-gradient-to-br from-emerald-400 to-teal-400 opacity-15 top-[20%] right-[8%]" />
            <div className="shape absolute w-32 h-32 rounded-[30%_70%_70%_30%/30%_30%_70%_70%] bg-gradient-to-br from-pink-400 to-yellow-400 opacity-15 bottom-[15%] right-[15%]" />
            <div className="shape absolute w-24 h-24 rounded-full bg-gradient-to-br from-cyan-200 to-pink-200 opacity-15 top-1/2 left-1/2" />
            <div className="shape absolute w-36 h-36 rounded-[60%_40%_30%_70%/60%_30%_70%_40%] bg-gradient-to-br from-amber-200 to-orange-300 opacity-15 bottom-[30%] left-[20%]" />
          </div>

          <div className="relative z-20 max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Text Content */}
            <div className="flex flex-col gap-6 text-center lg:text-left items-center lg:items-start">
              <h1
                ref={titleRef}
                className="font-fredoka text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-gray-800 leading-tight tracking-tight"
                style={{ textShadow: '3px 3px 0px rgba(255, 107, 157, 0.2)' }}
              >
                {section.title}
              </h1>

              {section.subtitle && (
                <p
                  ref={subtitleRef}
                  className="font-quicksand text-xl md:text-2xl lg:text-3xl font-semibold text-gray-600 leading-relaxed"
                >
                  {section.subtitle}
                </p>
              )}

              {section.description && (
                <div className="font-quicksand text-base md:text-lg lg:text-xl text-gray-500 leading-relaxed max-w-2xl lg:max-w-xl whitespace-pre-line">
                  {section.description}
                </div>
              )}
            </div>

            {/* Image that will morph and slide */}
            {imageUrl && (
              <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px]">
                <div
                  ref={imageRef}
                  className="absolute inset-0 z-50"
                  style={{ willChange: 'transform' }}
                >
                  <div
                    ref={imageBlobRef}
                    className="relative w-full h-full overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.15),0_15px_30px_rgba(255,107,157,0.2)]"
                    style={{
                      // ← Key fix: use square on mobile, blob on desktop
                      borderRadius: isMobile ? '16px' : '30% 70% 70% 30% / 30% 30% 70% 70%',
                      transform: isMobile ? 'none' : 'rotate(-3deg)',
                      willChange: 'border-radius, transform',
                    }}
                  >
                    <Image
                      src={imageUrl}
                      alt={section.title || 'Hero image'}
                      fill
                      className="object-cover scale-110 rotate-3"
                      priority
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* Wave divider - BLUE gradient with overlap fix */}
          <div className="absolute bottom-[-2px] left-0 w-full overflow-hidden leading-[0]">
            <svg
              className="relative block w-full h-[82px]"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
              style={{ display: 'block' }}
            >
              <defs>
                <linearGradient id="blueWaveGradient" x1="0%" y1="100%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#eff6ff" /> {/* blue-50 - LEFT */}
                  <stop offset="100%" stopColor="#f0fdfa" /> {/* teal-50 - RIGHT */}
                </linearGradient>
              </defs>
              <path
                d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
                fill="url(#blueWaveGradient)"
              />
            </svg>
          </div>
        </div>

        {/* Tentang Kami Section - normal flow, NOT absolute positioned */}
        {nextSection && (
          <TentangKami
            section={nextSection}
            innerRef={(node) => {
              if (node) tentangKamiRef.current = node
            }}
            contentRef={(node) => {
              if (node) tentangKamiContentRef.current = node
            }}
          />
        )}
      </div>

      {/* HighlightKami Section - OUTSIDE the pinned container */}
      {highlightSection && <HighlightKami section={highlightSection} />}
    </>
  )
}
