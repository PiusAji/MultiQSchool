'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { gsap } from 'gsap'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const overlayRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const outAllowed = useRef(false)
  const pendingOut = useRef(false)

  const runOutAnimation = () => {
    const overlay = overlayRef.current
    const logo = logoRef.current
    if (!overlay || !logo) return

    pendingOut.current = false
    gsap.killTweensOf([overlay, logo])
    gsap.set(overlay, { pointerEvents: 'none' })

    gsap.to(logo, {
      opacity: 0,
      scale: 0.85,
      duration: 0.25,
      ease: 'power2.in',
    })

    gsap.fromTo(
      overlay,
      { clipPath: 'circle(150% at 0% 0%)' },
      {
        clipPath: 'circle(0% at 0% 0%)',
        duration: 0.6,
        ease: 'power3.inOut',
        onComplete: () => {
          gsap.set(overlay, { clipPath: 'circle(0% at 0% 0%)' })
          outAllowed.current = false
          // Dispatch event so hero components know transition is done
          window.dispatchEvent(new Event('transition:complete'))
        },
      },
    )
  }

  // OUT — only runs when outAllowed, otherwise queues it
  useEffect(() => {
    if (outAllowed.current) {
      runOutAnimation()
    } else {
      pendingOut.current = true
    }
  }, [pathname])

  // Intercept clicks — circle IN from top-left
  useEffect(() => {
    const overlay = overlayRef.current
    const logo = logoRef.current
    if (!overlay || !logo) return

    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a')
      if (!target) return

      const href = target.getAttribute('href')
      if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto'))
        return
      if (target.getAttribute('target') === '_blank') return

      e.preventDefault()

      outAllowed.current = false
      pendingOut.current = false

      gsap.killTweensOf([overlay, logo])
      overlay.style.pointerEvents = 'auto'

      gsap.fromTo(
        overlay,
        { clipPath: 'circle(0% at 0% 0%)' },
        {
          clipPath: 'circle(150% at 0% 0%)',
          duration: 0.5,
          ease: 'power3.inOut',
          onComplete: () => {
            gsap.fromTo(
              logo,
              { opacity: 0, scale: 0.8 },
              {
                opacity: 1,
                scale: 1,
                duration: 0.2,
                ease: 'back.out(1.7)',
                onComplete: () => {
                  router.push(href)

                  setTimeout(() => {
                    outAllowed.current = true
                    if (pendingOut.current) {
                      runOutAnimation()
                    }
                  }, 150)
                },
              },
            )
          },
        },
      )
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [router])

  return (
    <>
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[998] flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 40%, #f3e8ff 100%)',
          clipPath: 'circle(0% at 0% 0%)',
          pointerEvents: 'none',
        }}
      >
        <div ref={logoRef} style={{ opacity: 0 }}>
          <Image
            src="/logo.png"
            alt="Multi-Q School"
            width={100}
            height={100}
            className="object-contain drop-shadow-lg"
            priority
          />
        </div>
      </div>
      {children}
    </>
  )
}
