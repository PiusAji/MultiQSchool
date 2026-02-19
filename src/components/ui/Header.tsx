'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { usePathname } from 'next/navigation'

interface HeaderProps {
  navItems?: any[] | null
}

export default function Header({ navItems = [] }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [showHeader, setShowHeader] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null)
  const lastScrollY = useRef(0)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY < lastScrollY.current || currentScrollY < 100) {
        setShowHeader(true)
      } else {
        setShowHeader(false)
        setActiveDropdown(null)
      }
      setIsScrolled(currentScrollY > 50)
      lastScrollY.current = currentScrollY
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Lock body scroll when menu open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  useEffect(() => {
    setMobileMenuOpen(false)
    setActiveDropdown(null)
  }, [pathname])

  const getHref = (item: any) => {
    const linkData = item.link?.link || item.link || item
    if (linkData.type === 'reference' && linkData.reference) {
      const ref = linkData.reference
      const slug = typeof ref === 'string' ? ref : ref?.value?.slug || ref?.slug
      return slug === 'home' ? '/' : `/${slug}`
    }
    if (linkData.type === 'custom' || item.type === 'custom') {
      return linkData.url || item.url || '#'
    }
    return '#'
  }

  const getLabel = (item: any) => {
    return item.link?.link?.label || item.link?.label || item.label || 'Link'
  }

  const getNewTab = (item: any) => {
    return item.link?.link?.newTab || item.link?.newTab || item.newTab || false
  }

  const validNavItems = (navItems || []).filter(
    (item) => item && (item.type === 'link' || item.type === 'dropdown'),
  )
  const midPoint = Math.ceil(validNavItems.length / 2)
  const leftNavItems = validNavItems.slice(0, midPoint)
  const rightNavItems = validNavItems.slice(midPoint)

  return (
    <>
      {/* ─── DESKTOP HEADER ─────────────────────────────────────────────── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
          showHeader ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        }`}
      >
        <div className="hidden lg:flex items-center justify-center pt-6 px-8">
          <div className="relative flex items-center">
            {/* Left pill */}
            <div
              className={`relative flex items-center transition-all duration-300 ${
                isScrolled ? 'bg-white/90 backdrop-blur-md' : 'bg-white/70 backdrop-blur-sm'
              }`}
              style={{
                borderRadius: '40px',
                padding: '12px 60px 12px 32px',
                height: '80px',
                marginRight: '-56px',
                zIndex: 1,
                boxShadow: isScrolled
                  ? '0 8px 30px rgba(0,0,0,0.12)'
                  : '0 4px 20px rgba(0,0,0,0.08)',
              }}
            >
              <nav className="flex items-center gap-1">
                {leftNavItems.map((item, index) => (
                  <div key={index} className="relative group">
                    {item.type === 'link' ? (
                      <Link
                        href={getHref(item)}
                        target={getNewTab(item) ? '_blank' : undefined}
                        className={`font-quicksand text-sm font-semibold px-4 py-2 rounded-full transition-all duration-300 whitespace-nowrap ${
                          pathname === getHref(item)
                            ? 'text-pink-500 bg-pink-50'
                            : 'text-gray-700 hover:text-pink-500 hover:bg-pink-50'
                        }`}
                      >
                        {getLabel(item)}
                      </Link>
                    ) : item.type === 'dropdown' ? (
                      <>
                        <button
                          className={`font-quicksand text-sm font-semibold px-4 py-2 rounded-full transition-all duration-300 flex items-center gap-1 whitespace-nowrap ${
                            pathname.startsWith('/' + item.label.toLowerCase())
                              ? 'text-pink-500 bg-pink-50'
                              : 'text-gray-700 hover:text-pink-500 hover:bg-pink-50'
                          }`}
                        >
                          {item.label}
                          <ChevronDown className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
                        </button>
                        <div className="absolute top-full left-0 mt-2 min-w-[200px] bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                          {item.subItems?.map((subItem: any, subIndex: number) => (
                            <Link
                              key={subIndex}
                              href={getHref(subItem)}
                              target={getNewTab(subItem) ? '_blank' : undefined}
                              className={`block px-4 py-3 font-quicksand text-sm transition-colors ${
                                pathname === getHref(subItem)
                                  ? 'text-pink-500 bg-pink-50 font-semibold'
                                  : 'text-gray-700 hover:bg-pink-50 hover:text-pink-500'
                              }`}
                            >
                              <div className="font-semibold">{getLabel(subItem)}</div>
                              {subItem.description && (
                                <div className="text-xs text-gray-500 mt-0.5">
                                  {subItem.description}
                                </div>
                              )}
                            </Link>
                          ))}
                        </div>
                      </>
                    ) : null}
                  </div>
                ))}
              </nav>
            </div>

            {/* Center logo circle */}
            <div
              className={`flex items-center justify-center transition-all duration-300 ${
                isScrolled
                  ? 'bg-white/90 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.12)]'
                  : 'bg-white/70 backdrop-blur-sm shadow-[0_4px_20px_rgba(0,0,0,0.08)]'
              }`}
              style={{ borderRadius: '50%', width: '112px', height: '112px', zIndex: 10 }}
            >
              <Link href="/">
                <Image
                  src="/logo.png"
                  alt="Multi-Q Logo"
                  width={80}
                  height={80}
                  className="object-contain hover:scale-105 transition-transform duration-300"
                  priority
                />
              </Link>
            </div>

            {/* Right pill */}
            <div
              className={`relative flex items-center transition-all duration-300 ${
                isScrolled ? 'bg-white/90 backdrop-blur-md' : 'bg-white/70 backdrop-blur-sm'
              }`}
              style={{
                borderRadius: '40px',
                padding: '12px 32px 12px 60px',
                height: '80px',
                marginLeft: '-56px',
                zIndex: 1,
                boxShadow: isScrolled
                  ? '0 8px 30px rgba(0,0,0,0.12)'
                  : '0 4px 20px rgba(0,0,0,0.08)',
              }}
            >
              <nav className="flex items-center gap-1">
                {rightNavItems.map((item, index) => (
                  <div key={index + midPoint} className="relative group">
                    {item.type === 'link' ? (
                      <Link
                        href={getHref(item)}
                        target={getNewTab(item) ? '_blank' : undefined}
                        className={`font-quicksand text-sm font-semibold px-4 py-2 rounded-full transition-all duration-300 whitespace-nowrap ${
                          pathname === getHref(item)
                            ? 'text-pink-500 bg-pink-50'
                            : 'text-gray-700 hover:text-pink-500 hover:bg-pink-50'
                        }`}
                      >
                        {getLabel(item)}
                      </Link>
                    ) : item.type === 'dropdown' ? (
                      <>
                        <button
                          className={`font-quicksand text-sm font-semibold px-4 py-2 rounded-full transition-all duration-300 flex items-center gap-1 whitespace-nowrap ${
                            pathname.startsWith('/' + item.label.toLowerCase())
                              ? 'text-pink-500 bg-pink-50'
                              : 'text-gray-700 hover:text-pink-500 hover:bg-pink-50'
                          }`}
                        >
                          {item.label}
                          <ChevronDown className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
                        </button>
                        <div className="absolute top-full right-0 mt-2 min-w-[200px] bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                          {item.subItems?.map((subItem: any, subIndex: number) => (
                            <Link
                              key={subIndex}
                              href={getHref(subItem)}
                              target={getNewTab(subItem) ? '_blank' : undefined}
                              className={`block px-4 py-3 font-quicksand text-sm transition-colors ${
                                pathname === getHref(subItem)
                                  ? 'text-pink-500 bg-pink-50 font-semibold'
                                  : 'text-gray-700 hover:bg-pink-50 hover:text-pink-500'
                              }`}
                            >
                              <div className="font-semibold">{getLabel(subItem)}</div>
                              {subItem.description && (
                                <div className="text-xs text-gray-500 mt-0.5">
                                  {subItem.description}
                                </div>
                              )}
                            </Link>
                          ))}
                        </div>
                      </>
                    ) : null}
                  </div>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* ─── MOBILE ─────────────────────────────────────────────────────── */}

      {/* Hamburger button — fixed top-left, always visible on mobile */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className={`lg:hidden fixed top-5 left-5 z-[100] w-14 h-14 rounded-full flex flex-col items-center justify-center gap-[5px] transition-all duration-500 ${
          showHeader ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0 pointer-events-none'
        } ${
          mobileMenuOpen
            ? 'bg-white shadow-[0_4px_20px_rgba(0,0,0,0.15)]'
            : isScrolled
              ? 'bg-white/90 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.12)]'
              : 'bg-white/70 backdrop-blur-sm shadow-[0_4px_15px_rgba(0,0,0,0.08)]'
        }`}
        aria-label="Toggle menu"
      >
        {/* Animated hamburger → X */}
        <span
          className={`block w-5 h-[2px] bg-gray-700 rounded-full transition-all duration-400 origin-center ${
            mobileMenuOpen ? 'rotate-45 translate-y-[7px]' : ''
          }`}
        />
        <span
          className={`block w-5 h-[2px] bg-gray-700 rounded-full transition-all duration-300 ${
            mobileMenuOpen ? 'opacity-0 scale-x-0' : ''
          }`}
        />
        <span
          className={`block w-5 h-[2px] bg-gray-700 rounded-full transition-all duration-400 origin-center ${
            mobileMenuOpen ? '-rotate-45 -translate-y-[7px]' : ''
          }`}
        />
      </button>

      {/* Logo — fixed top-right on mobile */}
      <div
        className={`lg:hidden fixed top-3 right-5 z-[100] transition-all duration-500 ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <Link href="/" onClick={() => setMobileMenuOpen(false)}>
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
              isScrolled || mobileMenuOpen
                ? 'bg-white/90 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.12)]'
                : 'bg-white/70 backdrop-blur-sm shadow-[0_4px_15px_rgba(0,0,0,0.08)]'
            }`}
          >
            <Image
              src="/logo.png"
              alt="Multi-Q Logo"
              width={44}
              height={44}
              className="object-contain"
              priority
            />
          </div>
        </Link>
      </div>

      {/* Circular reveal overlay */}
      <div
        className="lg:hidden fixed inset-0 z-[90]"
        style={{
          background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 30%, #f3e8ff 60%, #ede9fe 125%)',
          clipPath: mobileMenuOpen ? 'circle(125% at 40px 40px)' : 'circle(0% at 40px 40px)',
          transition: 'clip-path 0.7s cubic-bezier(0.76, 0, 0.24, 1)',
          pointerEvents: mobileMenuOpen ? 'auto' : 'none',
        }}
      />

      {/* Menu content — fades in after circle expands */}
      <div
        className={`lg:hidden fixed inset-0 z-[95] flex flex-col transition-all duration-500 ${
          mobileMenuOpen
            ? 'opacity-100 pointer-events-auto delay-300'
            : 'opacity-0 pointer-events-none delay-0'
        }`}
      >
        {/* Nav items — centered vertically */}
        <nav className="flex-1 flex flex-col justify-center px-10 pt-24 pb-10 gap-1">
          {validNavItems.map((item, index) => (
            <div
              key={index}
              className={`transition-all duration-500 ${
                mobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
              }`}
              style={{ transitionDelay: mobileMenuOpen ? `${350 + index * 60}ms` : '0ms' }}
            >
              {item.type === 'link' ? (
                <Link
                  href={getHref(item)}
                  target={getNewTab(item) ? '_blank' : undefined}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`group flex items-center gap-4 py-4 border-b border-pink-100/60 transition-all duration-300 ${
                    pathname === getHref(item) ? 'text-pink-500' : 'text-gray-800'
                  }`}
                >
                  {/* Active indicator dot */}
                  <span
                    className={`w-2 h-2 rounded-full flex-shrink-0 transition-all duration-300 ${
                      pathname === getHref(item)
                        ? 'bg-pink-400 scale-100'
                        : 'bg-gray-200 group-hover:bg-pink-300'
                    }`}
                  />
                  <span className="font-fredoka text-3xl font-bold group-hover:translate-x-2 transition-transform duration-300">
                    {getLabel(item)}
                  </span>
                  {pathname === getHref(item) && (
                    <span className="ml-auto font-quicksand text-xs font-semibold text-pink-400 uppercase tracking-widest">
                      Aktif
                    </span>
                  )}
                </Link>
              ) : item.type === 'dropdown' ? (
                <div>
                  <button
                    onClick={() => setActiveDropdown(activeDropdown === index ? null : index)}
                    className="group w-full flex items-center gap-4 py-4 border-b border-pink-100/60 text-gray-800 transition-all duration-300"
                  >
                    <span className="w-2 h-2 rounded-full bg-gray-200 flex-shrink-0 group-hover:bg-pink-300 transition-colors" />
                    <span className="font-fredoka text-3xl font-bold group-hover:translate-x-2 transition-transform duration-300 flex-1 text-left">
                      {item.label}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${activeDropdown === index ? 'rotate-180 text-pink-400' : ''}`}
                    />
                  </button>

                  {/* Dropdown sub items */}
                  <div
                    className={`overflow-hidden transition-all duration-400 ${
                      activeDropdown === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    {item.subItems?.map((subItem: any, subIndex: number) => (
                      <Link
                        key={subIndex}
                        href={getHref(subItem)}
                        target={getNewTab(subItem) ? '_blank' : undefined}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 pl-8 pr-4 py-3 font-quicksand text-lg transition-all duration-300 ${
                          pathname === getHref(subItem)
                            ? 'text-pink-500 font-semibold'
                            : 'text-gray-500 hover:text-pink-400'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-pink-200 flex-shrink-0" />
                        {getLabel(subItem)}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          ))}
        </nav>

        {/* Bottom decoration */}
        <div className="px-10 pb-12 flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <p className="font-fredoka text-xl font-bold text-gray-700">Multi-Q School</p>
            <p className="font-quicksand text-xs text-gray-400">Kerobokan, Bali</p>
          </div>
          <div className="flex gap-2">
            {['💛', '💜', '🧡'].map((emoji, i) => (
              <span key={i} className="text-2xl" style={{ animationDelay: `${i * 0.2}s` }}>
                {emoji}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="h-[100px] lg:h-[120px]" />
    </>
  )
}
