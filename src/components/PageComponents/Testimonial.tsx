'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Section } from '@/payload-types'

gsap.registerPlugin(ScrollTrigger)

interface TestimonialProps {
  section: Section
}

export default function Testimonial({ section }: TestimonialProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const spotlightRef = useRef<HTMLDivElement>(null)
  const cardsContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const checkMobile = () => window.innerWidth < 1024

      // Floating shapes animation
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

      // Entrance animation for spotlight
      gsap.from(spotlightRef.current, {
        scale: 0.8,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 60%',
          toggleActions: 'play none none reverse',
        },
      })

      const cards = cardsContainerRef.current?.querySelectorAll('.testimonial-card')
      if (!cards || cards.length === 0) return

      let currentIndex = 0
      let loopTimeout: ReturnType<typeof setTimeout>

      const originalPositions: { x: number; y: number }[] = []
      cards.forEach((card, index) => {
        const position = cardPositions[index % cardPositions.length]
        originalPositions.push(position)
        gsap.set(card as HTMLElement, {
          opacity: 0.4,
          scale: 0.85,
          zIndex: 1,
        })
      })

      /**
       * On mobile, compute Y offset from the cards container center so the
       * focused card sits 20px below the spotlight text and never clips
       * behind the footer. Uses live getBoundingClientRect() so it works
       * on any screen height.
       */
      const getMobileY = (cardEl: HTMLElement) => {
        if (!sectionRef.current || !spotlightRef.current) return 200

        const sectionRect = sectionRef.current.getBoundingClientRect()
        const spotlightRect = spotlightRef.current.getBoundingClientRect()
        const scale = 0.88
        const cardH = cardEl.offsetHeight * scale
        const gap = 20
        const safeBottom = 24

        // Center of cards container in viewport coordinates
        const containerCenterY = sectionRect.top + sectionRect.height / 2

        // Ideal: card top = spotlight bottom + gap
        let cardCenterY = spotlightRect.bottom + gap + cardH / 2

        // Clamp bottom: card must not go below (viewport - safeBottom)
        const maxCardCenterY = window.innerHeight - safeBottom - cardH / 2
        cardCenterY = Math.min(cardCenterY, maxCardCenterY)

        // Clamp top: card must never overlap spotlight
        const minCardCenterY = spotlightRect.bottom + gap + cardH / 2
        cardCenterY = Math.max(cardCenterY, minCardCenterY)

        return cardCenterY - containerCenterY
      }

      const spotlightCard = (index: number) => {
        const card = cards[index] as HTMLElement
        const nowMobile = checkMobile()
        const yOffset = nowMobile ? getMobileY(card) : -320

        gsap.to(card, {
          x: 0,
          y: yOffset,
          scale: nowMobile ? 0.88 : 1,
          opacity: 1,
          zIndex: 40,
          duration: 1,
          ease: 'power2.out',
        })

        cards.forEach((otherCard, otherIndex) => {
          if (otherIndex !== index) {
            const element = otherCard as HTMLElement
            const originalPos = originalPositions[otherIndex]
            gsap.to(element, {
              x: originalPos.x,
              y: originalPos.y,
              opacity: 0.4,
              scale: 0.85,
              zIndex: 1,
              duration: 1,
              ease: 'power2.out',
            })
          }
        })
      }

      const animateLoop = () => {
        spotlightCard(currentIndex)
        loopTimeout = setTimeout(() => {
          currentIndex = (currentIndex + 1) % cards.length
          animateLoop()
        }, 5000)
      }

      setTimeout(() => {
        spotlightCard(0)
        loopTimeout = setTimeout(animateLoop, 5000)
      }, 1000)

      const handleResize = () => spotlightCard(currentIndex)
      window.addEventListener('resize', handleResize)

      return () => {
        window.removeEventListener('resize', handleResize)
        clearTimeout(loopTimeout)
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [section])

  const testimonials = section.subsections || []

  const cardPositions = [
    { x: -500, y: -350 },
    { x: 550, y: -300 },
    { x: -480, y: 320 },
    { x: 520, y: 350 },
    { x: -550, y: -100 },
    { x: 580, y: 100 },
    { x: -450, y: 150 },
    { x: 500, y: -150 },
  ]

  return (
    <div
      ref={sectionRef}
      className="relative lg:min-h-[140vh] flex items-start lg:items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 px-8 pt-20 pb-[320px] lg:py-32 overflow-hidden"
    >
      {/* Floating decorative shapes */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <div className="shape absolute w-48 h-48 rounded-[30%_70%_70%_30%/30%_30%_70%_70%] bg-gradient-to-br from-purple-400 to-pink-500 opacity-15 top-[10%] left-[5%]" />
        <div className="shape absolute w-36 h-36 rounded-[70%_30%_30%_70%/60%_40%_60%_40%] bg-gradient-to-br from-pink-400 to-rose-400 opacity-15 top-[60%] left-[10%]" />
        <div className="shape absolute w-44 h-44 rounded-[40%_60%_60%_40%/60%_30%_70%_40%] bg-gradient-to-br from-orange-400 to-amber-400 opacity-15 top-[20%] right-[8%]" />
        <div className="shape absolute w-32 h-32 rounded-[30%_70%_70%_30%/30%_30%_70%_70%] bg-gradient-to-br from-purple-400 to-indigo-400 opacity-15 bottom-[15%] right-[15%]" />
        <div className="shape absolute w-24 h-24 rounded-full bg-gradient-to-br from-pink-200 to-orange-200 opacity-15 top-1/2 left-1/2" />
      </div>

      {/* Spotlight - Section Title & Description */}
      <div
        ref={spotlightRef}
        className="relative z-40 text-center max-w-3xl mx-auto pointer-events-none mt-4 lg:mt-0"
      >
        <h2
          className="font-fredoka text-5xl md:text-6xl lg:text-7xl font-bold text-gray-800 leading-tight mb-6"
          style={{ textShadow: '3px 3px 0px rgba(236, 72, 153, 0.2)' }}
        >
          {section.title}
        </h2>

        {section.description && (
          <p className="font-quicksand text-xl md:text-2xl font-semibold text-gray-600 leading-relaxed">
            {section.description}
          </p>
        )}
      </div>

      {/* Testimonial Cards Container - Scattered Behind */}
      <div
        ref={cardsContainerRef}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        {testimonials.map((testimonial, index) => {
          const position = cardPositions[index % cardPositions.length]

          return (
            <div
              key={index}
              className="testimonial-card absolute w-[90%] max-w-md"
              style={{
                transform: `translate(${position.x}px, ${position.y}px)`,
              }}
            >
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 md:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.15)]">
                <h3 className="font-fredoka text-2xl md:text-3xl font-bold text-gray-800 mb-4 text-center">
                  {testimonial.title}
                </h3>

                {testimonial.description && (
                  <p className="font-quicksand text-sm md:text-lg text-gray-600 leading-relaxed mb-4 text-center whitespace-pre-line">
                    {testimonial.description}
                  </p>
                )}

                {testimonial.subtitle && (
                  <div className="flex items-center justify-center gap-3">
                    <span className="font-fredoka text-4xl text-pink-400 leading-none">
                      &ldquo;
                    </span>
                    <p className="font-quicksand text-base md:text-xl font-semibold text-pink-500 italic">
                      {testimonial.subtitle}
                    </p>
                    <span className="font-fredoka text-4xl text-pink-400 leading-none">
                      &rdquo;
                    </span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
