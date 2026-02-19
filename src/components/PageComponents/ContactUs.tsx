'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Section } from '@/payload-types'

gsap.registerPlugin(ScrollTrigger)

interface ContactUsProps {
  section: Section
}

const HOURS = [
  { day: 'Senin', time: '07.30 – 12.30' },
  { day: 'Selasa', time: '07.30 – 12.30' },
  { day: 'Rabu', time: '07.30 – 12.30' },
  { day: 'Kamis', time: '07.30 – 12.30' },
  { day: 'Jumat', time: '07.30 – 12.30' },
  { day: 'Sabtu', time: '07.30 – 12.30' },
  { day: 'Minggu', time: 'Tutup', closed: true },
]

const WA_NUMBER = '6287861646101'
const WA_MESSAGE = encodeURIComponent('Halo, saya ingin bertanya tentang Sekolah Multi-Q. ')
const WA_URL = `https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}`
const MAPS_LINK = `https://maps.app.goo.gl/4CSFE68EBHDcsATK8`
const MAPS_EMBED = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31556.15459846911!2d115.13171867431642!3d-8.64205679999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd238bcc08a46d1%3A0x56e3ea51c31f3c6c!2sSD%20MULTI-Q%20%2C%20Kerobokan%20Kaja!5e0!3m2!1sid!2sid!4v1771482678531!5m2!1sid!2sid`

export default function ContactUs({ section }: ContactUsProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const animateIfNeeded = (el: Element | null, vars: gsap.TweenVars) => {
        if (!el) return
        const rect = el.getBoundingClientRect()
        const inView = rect.top < window.innerHeight
        if (inView) {
          // Already visible on page load — animate immediately
          gsap.from(el, { ...vars, scrollTrigger: undefined })
        } else {
          // Below viewport — use ScrollTrigger
          gsap.from(el, {
            ...vars,
            scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
          })
        }
      }

      animateIfNeeded(titleRef.current, { y: 50, opacity: 0, duration: 0.9, ease: 'power3.out' })
      animateIfNeeded(mapRef.current, { x: 50, opacity: 0, duration: 0.9, ease: 'power3.out' })

      const cards = cardsRef.current?.querySelectorAll('.contact-card')
      if (cards) {
        cards.forEach((card, i) => {
          const rect = card.getBoundingClientRect()
          const inView = rect.top < window.innerHeight
          if (inView) {
            gsap.from(card, {
              y: 40,
              opacity: 0,
              duration: 0.6,
              delay: i * 0.08,
              ease: 'power3.out',
            })
          } else {
            gsap.from(card, {
              y: 40,
              opacity: 0,
              duration: 0.6,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: card,
                start: 'top 88%',
                toggleActions: 'play none none none',
              },
            })
          }
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={sectionRef} className="relative bg-[#f0fdf4] px-6 py-24 overflow-hidden">
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-teal-100/60 blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-emerald-100/60 blur-[80px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col gap-16">
        {/* ── Header ── */}
        <div className="text-center flex flex-col items-center gap-4">
          <div className="inline-flex items-center gap-2 bg-white border border-teal-200 rounded-full px-5 py-2 shadow-sm">
            <span className="text-lg">📬</span>
            <span className="font-quicksand font-semibold text-teal-600 text-sm uppercase tracking-widest">
              Informasi Kontak
            </span>
          </div>
          <h2
            ref={titleRef}
            className="font-fredoka text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight"
            style={{ textShadow: '3px 3px 0px rgba(20,184,166,0.12)' }}
          >
            {section.title || 'Hubungi Kami'}
          </h2>
          <div className="h-1.5 w-28 rounded-full bg-gradient-to-r from-teal-400 to-emerald-400" />
        </div>

        {/* ── Two columns ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12">
          {/* LEFT — info cards */}
          <div ref={cardsRef} className="flex flex-col gap-4">
            {/* 1. WhatsApp CTA */}
            <a
              href={WA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-card group relative flex items-center gap-5 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-3xl px-7 py-6 shadow-[0_12px_40px_rgba(20,184,166,0.35)] hover:shadow-[0_16px_50px_rgba(20,184,166,0.5)] transition-all duration-300 hover:-translate-y-1 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
                <span className="text-3xl">💬</span>
              </div>
              <div className="flex-1">
                <p className="font-fredoka text-xl font-bold text-white leading-tight">
                  Chat via WhatsApp
                </p>
                <p className="font-quicksand text-white/80 text-sm mt-0.5">
                  0878-6164-6101 · Respon cepat!
                </p>
              </div>
              <span className="text-white/60 text-2xl group-hover:translate-x-1 transition-transform duration-300">
                →
              </span>
            </a>

            {/* 2. Address */}
            <a
              href={MAPS_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-card group flex items-start gap-5 bg-white rounded-3xl px-7 py-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-teal-100 hover:border-teal-300 hover:shadow-[0_8px_30px_rgba(20,184,166,0.15)] transition-all duration-300 hover:-translate-y-0.5"
            >
              <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center flex-shrink-0 group-hover:bg-teal-100 transition-colors">
                <span className="text-2xl">📍</span>
              </div>
              <div>
                <p className="font-fredoka font-bold text-gray-800 text-base mb-1">Alamat</p>
                <p className="font-quicksand text-gray-600 text-sm leading-relaxed">
                  Gg. Liplip, Kerobokan Kaja
                  <br />
                  Kec. Kuta Utara, Kabupaten Badung
                  <br />
                  Bali 80361
                </p>
                <p className="font-quicksand text-teal-500 text-xs font-semibold mt-2">
                  Buka di Google Maps →
                </p>
              </div>
            </a>

            {/* 3. Phone */}
            <a
              href="tel:+6287861646101"
              className="contact-card group flex items-center gap-5 bg-white rounded-3xl px-7 py-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-teal-100 hover:border-teal-300 hover:shadow-[0_8px_30px_rgba(20,184,166,0.15)] transition-all duration-300 hover:-translate-y-0.5"
            >
              <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center flex-shrink-0 group-hover:bg-teal-100 transition-colors">
                <span className="text-2xl">📞</span>
              </div>
              <div>
                <p className="font-fredoka font-bold text-gray-800 text-base mb-0.5">Telepon</p>
                <p className="font-quicksand text-teal-600 text-sm font-semibold">0878-6164-6101</p>
              </div>
            </a>

            {/* 4. Email */}
            <div className="contact-card flex items-start gap-5 bg-white rounded-3xl px-7 py-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-teal-100">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">✉️</span>
              </div>
              <div className="flex flex-col gap-2">
                <p className="font-fredoka font-bold text-gray-800 text-base">Email</p>
                <div>
                  <p className="font-quicksand text-xs text-gray-400 font-semibold uppercase tracking-wide">
                    SD
                  </p>
                  <a
                    href="mailto:multiq1@gmail.com"
                    className="font-quicksand text-teal-600 text-sm font-semibold hover:text-teal-700 transition-colors"
                  >
                    multiq1@gmail.com
                  </a>
                </div>
                <div>
                  <p className="font-quicksand text-xs text-gray-400 font-semibold uppercase tracking-wide">
                    PG / TK
                  </p>
                  <a
                    href="mailto:kbmultiq1@gmail.com"
                    className="font-quicksand text-teal-600 text-sm font-semibold hover:text-teal-700 transition-colors"
                  >
                    kbmultiq1@gmail.com
                  </a>
                </div>
              </div>
            </div>

            {/* 5. Hours */}
            <div className="contact-card bg-white rounded-3xl px-7 py-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-teal-100">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🕐</span>
                </div>
                <p className="font-fredoka font-bold text-gray-800 text-base">Jam Operasional</p>
              </div>
              <div className="flex flex-col gap-2">
                {HOURS.map(({ day, time, closed }) => (
                  <div key={day} className="flex items-center justify-between">
                    <span
                      className={`font-quicksand text-sm font-semibold ${closed ? 'text-gray-400' : 'text-gray-700'}`}
                    >
                      {day}
                    </span>
                    <span
                      className={`font-quicksand text-sm font-semibold ${closed ? 'text-red-400' : 'text-teal-600'}`}
                    >
                      {time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT — Map */}
          <div ref={mapRef} className="flex flex-col gap-4">
            <div
              className="rounded-3xl overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.12)] border border-teal-100"
              style={{ height: '580px' }}
            >
              <iframe
                src={MAPS_EMBED}
                width="100%"
                height="100%"
                style={{ border: 0, display: 'block' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Lokasi Sekolah Multi-Q"
              />
            </div>
            <a
              href={MAPS_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 bg-white border-2 border-teal-200 rounded-2xl px-6 py-4 font-quicksand font-semibold text-teal-600 hover:bg-teal-50 hover:border-teal-400 transition-all duration-300 shadow-sm group"
            >
              <span className="text-xl">🗺️</span>
              Buka di Google Maps
              <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
