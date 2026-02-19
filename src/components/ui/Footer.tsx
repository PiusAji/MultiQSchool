'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Facebook, Mail } from 'lucide-react'

interface FooterLink {
  link: {
    type?: 'reference' | 'custom'
    label?: string
    url?: string
    reference?: any
    newTab?: boolean
  }
}

interface FooterProps {
  navItems?: FooterLink[]
}

export default function Footer({ navItems = [] }: FooterProps) {
  const getHref = (item: FooterLink) => {
    const linkData = item.link
    if (linkData.type === 'reference' && linkData.reference) {
      const ref = linkData.reference
      const slug = typeof ref === 'string' ? ref : ref?.value?.slug || ref?.slug
      return slug === 'home' ? '/' : `/${slug}`
    }
    if (linkData.type === 'custom') return linkData.url || '#'
    return '#'
  }

  const getLabel = (item: FooterLink) => item.link?.label || 'Link'
  const getNewTab = (item: FooterLink) => item.link?.newTab || false
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 overflow-hidden">
      {/* Background decoration — desktop only */}
      <div className="absolute inset-0 pointer-events-none opacity-20 hidden lg:block">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(147,51,234,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(147,51,234,0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
        <div className="absolute bottom-20 right-20 w-24 h-24 border-4 border-purple-300 rotate-45" />
        <div className="absolute top-1/2 right-1/4 w-16 h-16 border-4 border-orange-300 rounded-full" />
      </div>

      {/* Mobile background decoration */}
      <div className="absolute inset-0 pointer-events-none lg:hidden">
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-pink-100/60" />
        <div className="absolute top-1/3 -left-10 w-32 h-32 rounded-full bg-purple-100/50" />
        <div className="absolute bottom-20 right-8 w-20 h-20 rounded-full bg-teal-100/60" />
        <div className="absolute bottom-10 left-1/3 w-12 h-12 rotate-45 bg-orange-100/50" />
      </div>

      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-pink-200/20 to-transparent" />

      {/* ── MOBILE LAYOUT ─────────────────────────────────────────── */}
      <div className="lg:hidden relative px-6 pt-10 pb-8 flex flex-col gap-8">
        {/* Logo row — compact horizontal */}
        <div className="flex items-center gap-4">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Multi-Q Logo"
              width={56}
              height={56}
              className="object-contain"
            />
          </Link>
          <div>
            <h3 className="font-fredoka text-xl font-bold text-gray-800 leading-tight">Multi-Q</h3>
            <p className="font-quicksand text-xs text-gray-500 leading-relaxed">
              Tumbuh Cerdas, Tumbuh Berkarakter.
            </p>
          </div>
        </div>

        {/* Nav — 2 column pill grid */}
        {navItems && navItems.length > 0 && (
          <div className="grid grid-cols-2 gap-x-6 gap-y-3">
            {navItems.map((item, index) => (
              <Link
                key={index}
                href={getHref(item)}
                target={getNewTab(item) ? '_blank' : undefined}
                className="font-quicksand text-sm font-semibold text-gray-600 hover:text-pink-500 transition-colors duration-300"
              >
                {getLabel(item)}
              </Link>
            ))}
          </div>
        )}

        {/* Social + contact row */}
        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            <a
              href="https://www.facebook.com/multiedukarya/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/80 p-3 rounded-2xl shadow-sm hover:scale-110 transition-transform duration-300"
            >
              <Facebook className="w-5 h-5 text-blue-500" />
            </a>
            <a
              href="mailto:multiq1@gmail.com"
              className="bg-white/80 p-3 rounded-2xl shadow-sm hover:scale-110 transition-transform duration-300"
            >
              <Mail className="w-5 h-5 text-orange-500" />
            </a>
            <a
              href="mailto:kbmultiq1@gmail.com"
              className="bg-white/80 p-3 rounded-2xl shadow-sm hover:scale-110 transition-transform duration-300"
            >
              <Mail className="w-5 h-5 text-pink-500" />
            </a>
          </div>
          <div className="flex gap-1.5">
            {['💛', '💜', '🧡'].map((emoji, i) => (
              <span key={i} className="text-xl">
                {emoji}
              </span>
            ))}
          </div>
        </div>
        {/* Email labels */}
        <div className="flex gap-3 -mt-4">
          <div className="w-11" />
          {/* Facebook spacer */}
          <p className="font-quicksand text-[10px] text-gray-400 font-semibold w-11 text-center">
            SD
          </p>
          <p className="font-quicksand text-[10px] text-gray-400 font-semibold w-11 text-center">
            PG/TK
          </p>
        </div>

        {/* Bottom bar — mobile */}
        <div className="pt-4 border-t border-gray-200/60 flex items-center justify-between">
          <p className="font-quicksand text-xs text-gray-500">© {currentYear} Multi-Q</p>
          <div className="flex gap-4">
            <Link
              href="/privacy"
              className="font-quicksand text-xs text-gray-400 hover:text-pink-500 transition-colors"
            >
              Privasi
            </Link>
            <Link
              href="/terms"
              className="font-quicksand text-xs text-gray-400 hover:text-pink-500 transition-colors"
            >
              Ketentuan
            </Link>
          </div>
        </div>
      </div>

      {/* ── DESKTOP LAYOUT ────────────────────────────────────────── */}
      <div className="hidden lg:block relative container mx-auto px-6 py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16 items-start">
          {/* Logo & Brand */}
          <div className="flex flex-col items-center lg:items-start gap-6">
            <Link href="/" className="group">
              <Image
                src="/logo.png"
                alt="Multi-Q Logo"
                width={100}
                height={100}
                className="object-contain transition-all duration-300 group-hover:scale-110"
              />
            </Link>
            <div className="text-center lg:text-left">
              <h3 className="font-fredoka text-2xl font-bold text-gray-800 mb-2">Multi-Q</h3>
              <p className="font-quicksand text-sm text-gray-600 leading-relaxed max-w-xs">
                Tumbuh Cerdas, Tumbuh Berkarakter. Membantu anak menjadi pribadi yang cerdas dan
                berkarakter.
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex flex-col items-center lg:items-start">
            <h4 className="font-fredoka text-lg font-bold text-gray-800 mb-6">Navigasi Cepat</h4>
            <nav className="flex flex-col gap-3">
              {navItems && navItems.length > 0 ? (
                navItems.map((item, index) => (
                  <Link
                    key={index}
                    href={getHref(item)}
                    target={getNewTab(item) ? '_blank' : undefined}
                    className="font-quicksand text-base font-medium text-gray-600 hover:text-pink-500 transition-colors duration-300 group flex items-center gap-2"
                  >
                    <span className="w-0 h-0.5 bg-pink-500 group-hover:w-4 transition-all duration-300" />
                    {getLabel(item)}
                  </Link>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No navigation items</p>
              )}
            </nav>
          </div>

          {/* Social & Contact */}
          <div className="flex flex-col items-center lg:items-start">
            <h4 className="font-fredoka text-lg font-bold text-gray-800 mb-6">Hubungi Kami</h4>
            <div className="flex flex-col gap-6">
              <div className="flex gap-4 justify-center lg:justify-start">
                {[
                  {
                    href: 'https://www.facebook.com/multiedukarya/',
                    icon: <Facebook className="w-6 h-6 text-blue-500" />,
                    gradient: 'from-blue-400 to-cyan-500',
                  },
                  {
                    href: 'mailto:multiq1@gmail.com',
                    icon: <Mail className="w-6 h-6 text-orange-500" />,
                    gradient: 'from-orange-400 to-red-500',
                    label: 'SD',
                  },
                  {
                    href: 'mailto:kbmultiq1@gmail.com',
                    icon: <Mail className="w-6 h-6 text-pink-500" />,
                    gradient: 'from-pink-400 to-purple-500',
                    label: 'PG/TK',
                  },
                ].map((s, i) => (
                  <a
                    key={i}
                    href={s.href}
                    target={s.href.startsWith('http') ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    className="group relative flex flex-col items-center gap-1"
                  >
                    <div
                      className={`absolute top-0 inset-x-0 h-12 bg-gradient-to-br ${s.gradient} rounded-2xl blur-lg opacity-0 group-hover:opacity-60 transition-opacity duration-300`}
                    />
                    <div className="relative bg-white p-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-1">
                      {s.icon}
                    </div>
                    {s.label && (
                      <span className="font-quicksand text-[10px] font-semibold text-gray-400">
                        {s.label}
                      </span>
                    )}
                  </a>
                ))}
              </div>
              <div className="font-quicksand text-sm text-gray-600 text-center lg:text-left space-y-2">
                <p className="flex items-center justify-center lg:justify-start gap-2">
                  <span className="text-xs font-semibold text-gray-400 w-10">SD</span>
                  <a
                    href="mailto:multiq1@gmail.com"
                    className="hover:text-pink-500 transition-colors"
                  >
                    multiq1@gmail.com
                  </a>
                </p>
                <p className="flex items-center justify-center lg:justify-start gap-2">
                  <span className="text-xs font-semibold text-gray-400 w-10">PG/TK</span>
                  <a
                    href="mailto:kbmultiq1@gmail.com"
                    className="hover:text-pink-500 transition-colors"
                  >
                    kbmultiq1@gmail.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-gray-300/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-quicksand text-sm text-gray-600 text-center md:text-left">
              © {currentYear} Multi-Q. Semua hak cipta dilindungi.
            </p>
            <div className="flex gap-6">
              <Link
                href="/privacy"
                className="font-quicksand text-sm text-gray-600 hover:text-pink-500 transition-colors"
              >
                Kebijakan Privasi
              </Link>
              <Link
                href="/terms"
                className="font-quicksand text-sm text-gray-600 hover:text-pink-500 transition-colors"
              >
                Syarat & Ketentuan
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
