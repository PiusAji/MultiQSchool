'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Section } from '@/payload-types'
import Image from 'next/image'

gsap.registerPlugin(ScrollTrigger)

interface KurikulumPGTKProps {
  section: Section
}

export default function KurikulumPGTK({ section }: KurikulumPGTKProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const bubblesRef = useRef<HTMLDivElement>(null)
  const stampRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title bounce in
      gsap.from(titleRef.current, {
        scale: 0.6,
        opacity: 0,
        rotation: -8,
        duration: 0.9,
        ease: 'back.out(2)',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
      })

      // Image pop up
      gsap.from(imageRef.current, {
        y: 80,
        opacity: 0,
        scale: 0.9,
        duration: 1,
        ease: 'back.out(1.6)',
        scrollTrigger: {
          trigger: imageRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      })

      // Text slide in
      gsap.from(textRef.current, {
        x: 70,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: imageRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      })

      // Stamp spin in
      gsap.from(stampRef.current, {
        scale: 0,
        rotation: -45,
        opacity: 0,
        duration: 0.7,
        ease: 'back.out(2)',
        delay: 0.5,
        scrollTrigger: {
          trigger: imageRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      })

      // Floating bubbles
      const bubbles = bubblesRef.current?.querySelectorAll('.candy-bubble')
      if (bubbles) {
        bubbles.forEach((el, i) => {
          gsap.to(el, {
            y: 'random(-30, 30)',
            x: 'random(-15, 15)',
            rotation: 'random(-15, 15)',
            duration: `random(2.5, 5)`,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: i * 0.18,
          })
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const imageUrl =
    typeof section.image === 'object' && section.image?.url ? section.image.url : null

  return (
    <div
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-amber-50 via-yellow-50 to-fuchsia-100 px-6 py-28"
    >
      {/* Candy decorations */}
      <div ref={bubblesRef} className="absolute inset-0 pointer-events-none z-10">
        {/* Large shapes */}
        <div className="candy-bubble absolute w-72 h-72 rounded-full bg-gradient-to-br from-yellow-200 to-amber-200 opacity-25 -bottom-20 -left-20" />
        <div className="candy-bubble absolute w-56 h-56 rounded-[60%_40%_40%_60%/60%_40%_60%_40%] bg-gradient-to-br from-fuchsia-200 to-pink-200 opacity-22 -top-16 right-[5%]" />
        <div className="candy-bubble absolute w-40 h-40 rounded-full bg-gradient-to-br from-orange-200 to-amber-300 opacity-22 top-1/2 left-[5%]" />

        {/* Small pops */}
        <div className="candy-bubble absolute w-10 h-10 rounded-full bg-yellow-400 opacity-35 top-[20%] left-[18%]" />
        <div className="candy-bubble absolute w-8 h-8 rounded-full bg-fuchsia-400 opacity-35 top-[65%] right-[20%]" />
        <div className="candy-bubble absolute w-7 h-7 rounded-full bg-amber-500 opacity-30 bottom-[22%] left-[40%]" />
        <div className="candy-bubble absolute w-5 h-5 rounded-full bg-pink-400 opacity-40 top-[42%] right-[35%]" />

        {/* Stars */}
        <div className="candy-bubble absolute text-yellow-400 text-5xl opacity-30 top-[10%] right-[12%]">
          ★
        </div>
        <div className="candy-bubble absolute text-fuchsia-400 text-4xl opacity-25 bottom-[18%] right-[5%]">
          ★
        </div>
        <div className="candy-bubble absolute text-orange-400 text-3xl opacity-25 top-[55%] left-[45%]">
          ★
        </div>

        {/* Emoji accents */}
        <div className="candy-bubble absolute text-4xl opacity-25 top-[8%] left-[5%]">🌟</div>
        <div className="candy-bubble absolute text-3xl opacity-20 bottom-[28%] right-[42%]">🎈</div>
        <div className="candy-bubble absolute text-4xl opacity-20 top-[75%] left-[25%]">🎀</div>
      </div>

      <div className="relative z-20 max-w-7xl w-full flex flex-col gap-16">
        {/* Header */}
        <div className="text-center flex flex-col items-center gap-4">
          <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-amber-200 rounded-full px-5 py-2">
            <span className="text-lg">🎠</span>
            <span className="font-quicksand font-semibold text-amber-700 text-sm uppercase tracking-wider">
              Kurikulum PG & TK
            </span>
          </div>

          <h2
            ref={titleRef}
            className="font-fredoka text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight"
            style={{ textShadow: '3px 3px 0px rgba(251, 191, 36, 0.2)' }}
          >
            {section.title || 'Kurikulum PG/TK'}
          </h2>

          {/* Wavy decorative underline */}
          <svg className="w-64 h-4 -mt-1" viewBox="0 0 256 16" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0,8 Q32,0 64,8 T128,8 T192,8 T256,8"
              fill="none"
              stroke="url(#wavyUnderline)"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="wavyUnderline" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#e879f9" />
              </linearGradient>
            </defs>
          </svg>

          {section.subtitle && (
            <p className="font-quicksand text-xl font-semibold text-gray-600 max-w-2xl">
              {section.subtitle}
            </p>
          )}
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text side */}
          <div ref={textRef} className="flex flex-col gap-6 order-2 lg:order-1">
            {section.description ? (
              <p className="font-quicksand text-lg text-gray-600 leading-relaxed whitespace-pre-line">
                {section.description}
              </p>
            ) : (
              <p className="font-quicksand text-lg text-gray-600 leading-relaxed">
                Program PG dan TK kami mengutamakan perkembangan holistik anak melalui bermain,
                eksplorasi, dan kreativitas yang terstruktur dengan penuh kasih sayang.
              </p>
            )}

            {/* Program stages — styled as candy cards */}
            <div className="grid grid-cols-1 gap-4 mt-2">
              {[
                {
                  emoji: '🐣',
                  title: 'Play Group (PG)',
                  desc: 'Usia 2–3 tahun. Stimulasi sensorik dan motorik dasar.',
                  color: 'from-yellow-100 to-amber-100',
                  border: 'border-yellow-200',
                  tag: 'bg-yellow-400',
                },
                {
                  emoji: '🌱',
                  title: 'TK A',
                  desc: 'Usia 4–5 tahun. Pengenalan konsep dasar melalui permainan.',
                  color: 'from-pink-100 to-rose-100',
                  border: 'border-pink-200',
                  tag: 'bg-pink-400',
                },
                {
                  emoji: '🌟',
                  title: 'TK B',
                  desc: 'Usia 5–6 tahun. Persiapan sekolah dasar secara menyeluruh.',
                  color: 'from-fuchsia-100 to-violet-100',
                  border: 'border-fuchsia-200',
                  tag: 'bg-fuchsia-400',
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className={`flex items-start gap-4 bg-gradient-to-br ${item.color} rounded-2xl p-4 border ${item.border} shadow-sm`}
                >
                  <div
                    className={`${item.tag} w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 shadow`}
                  >
                    {item.emoji}
                  </div>
                  <div>
                    <p className="font-fredoka font-bold text-gray-800 text-base leading-tight">
                      {item.title}
                    </p>
                    <p className="font-quicksand text-sm text-gray-600 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Image side */}
          <div ref={imageRef} className="relative order-1 lg:order-2">
            {/* Behind frame 1 */}
            <div
              className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-fuchsia-300 to-pink-400 opacity-40 shadow-xl"
              style={{ transform: 'rotate(-5deg) translate(-12px, 10px)' }}
            />
            {/* Behind frame 2 */}
            <div
              className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-amber-200 to-yellow-300 opacity-40 shadow-xl"
              style={{ transform: 'rotate(3deg) translate(10px, 8px)' }}
            />

            {/* Main image */}
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.16),0_10px_25px_rgba(236,72,153,0.2)]">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={section.title || 'Kurikulum PG/TK'}
                  width={700}
                  height={520}
                  className="w-full h-[300px] md:h-[420px] object-cover"
                />
              ) : (
                <div className="w-full h-[300px] md:h-[420px] bg-gradient-to-br from-amber-200 via-pink-200 to-fuchsia-200 flex items-center justify-center">
                  <span className="text-8xl opacity-50">🧸</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-fuchsia-900/10 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Spinning stamp */}
            <div
              ref={stampRef}
              className="absolute -top-5 -right-5 lg:-right-8 z-30 w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex flex-col items-center justify-center shadow-lg border-4 border-white"
            >
              <span className="text-2xl">🎉</span>
              <p className="font-fredoka text-[9px] font-bold text-white leading-tight text-center">
                Terakreditasi
              </p>
            </div>

            {/* Bottom info pill */}
            <div className="absolute -bottom-5 left-6 bg-white rounded-2xl px-4 py-3 shadow-lg flex items-center gap-3 border border-amber-100">
              <span className="text-2xl">💛</span>
              <div>
                <p className="font-fredoka font-bold text-gray-800 text-sm">
                  Berbasis Kasih Sayang
                </p>
                <p className="font-quicksand text-xs text-amber-600 font-semibold">
                  Tumbuh Kembang Optimal
                </p>
              </div>
            </div>
          </div>
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
            <linearGradient id="pgtkKurikulumWave" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fffbeb" /> {/* amber-50 */}
              <stop offset="100%" stopColor="#fdf2f8" /> {/* pink-50 — for next section */}
            </linearGradient>
          </defs>
          <path
            d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
            fill="url(#pgtkKurikulumWave)"
          />
        </svg>
      </div>
    </div>
  )
}
