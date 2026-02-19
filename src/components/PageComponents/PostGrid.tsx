'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'
import Link from 'next/link'

gsap.registerPlugin(ScrollTrigger)

interface Post {
  id: string
  slug: string
  title: string
  heroImage: {
    url?: string | null | undefined
    alt?: string | null | undefined
  } | null
  publishedAt: string | null
  categories?: Array<{
    title?: string
    id?: string
  }>
  excerpt: string
}

interface PostGridProps {
  posts: Post[]
  currentCategory?: 'all' | 'berita' | 'pengumuman'
  sectionTitle?: string // Optional title from Kabar Multi-Q section
}

export default function PostGrid({ posts, currentCategory = 'all', sectionTitle }: PostGridProps) {
  const gridRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Section title animation
      if (titleRef.current) {
        gsap.from(titleRef.current, {
          y: 50,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        })
      }

      // Cards stagger animation
      const cards = cardsRef.current?.querySelectorAll('.post-card')
      if (cards && cards.length > 0) {
        // Set initial state
        gsap.set(cards, { opacity: 1, y: 0 })

        gsap.from(cards, {
          y: 60,
          opacity: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: cardsRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
            once: true, // Only animate once
          },
        })
      }
    }, gridRef)

    return () => ctx.revert()
  }, [posts, sectionTitle])

  const formatDate = (dateString?: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date)
  }

  const getCategoryColor = (categoryTitle?: string) => {
    if (!categoryTitle) return { bg: 'bg-gray-100', text: 'text-gray-700' }
    const lower = categoryTitle.toLowerCase()
    if (lower.includes('berita')) return { bg: 'bg-blue-100', text: 'text-blue-700' }
    if (lower.includes('pengumuman')) return { bg: 'bg-purple-100', text: 'text-purple-700' }
    return { bg: 'bg-gray-100', text: 'text-gray-700' }
  }

  return (
    <div ref={gridRef} className="relative bg-gray-50 px-6 py-16">
      <div className="max-w-7xl mx-auto">
        {/* Section title if provided */}
        {sectionTitle && (
          <h2
            ref={titleRef}
            className="font-fredoka text-4xl md:text-5xl font-bold text-gray-800 text-center mb-12"
          >
            {sectionTitle}
          </h2>
        )}

        {/* Category filter tabs */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <Link
            href="/berita-dan-pengumuman"
            scroll={false}
            className={`px-6 py-3 rounded-full font-quicksand font-semibold text-sm transition-all duration-300 ${
              currentCategory === 'all'
                ? 'bg-indigo-500 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'
            }`}
          >
            Semua
          </Link>
          <Link
            href="/berita-dan-pengumuman/berita"
            scroll={false}
            className={`px-6 py-3 rounded-full font-quicksand font-semibold text-sm transition-all duration-300 ${
              currentCategory === 'berita'
                ? 'bg-blue-500 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-600'
            }`}
          >
            📰 Berita
          </Link>
          <Link
            href="/berita-dan-pengumuman/pengumuman"
            scroll={false}
            className={`px-6 py-3 rounded-full font-quicksand font-semibold text-sm transition-all duration-300 ${
              currentCategory === 'pengumuman'
                ? 'bg-purple-500 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-purple-50 hover:text-purple-600'
            }`}
          >
            📢 Pengumuman
          </Link>
        </div>

        {/* Posts grid */}
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-quicksand text-xl text-gray-500">
              Belum ada postingan di kategori ini.
            </p>
          </div>
        ) : (
          <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => {
              const imageUrl = post.heroImage?.url || null
              const categoryColors = getCategoryColor(post.categories?.[0]?.title)

              return (
                <Link
                  key={post.id}
                  href={`/berita-dan-pengumuman/${post.slug}`}
                  className="post-card group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 flex flex-col"
                >
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden bg-gray-200">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                        <span className="text-6xl opacity-30">📰</span>
                      </div>
                    )}
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col gap-3 flex-grow">
                    {/* Category badge + date */}
                    <div className="flex items-center justify-between gap-2">
                      {post.categories && post.categories.length > 0 && (
                        <span
                          className={`${categoryColors.bg} ${categoryColors.text} px-3 py-1 rounded-full text-xs font-quicksand font-semibold`}
                        >
                          {post.categories[0].title}
                        </span>
                      )}
                      {post.publishedAt && (
                        <span className="text-xs text-gray-500 font-quicksand">
                          {formatDate(post.publishedAt)}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="font-fredoka text-xl font-bold text-gray-800 leading-tight group-hover:text-indigo-600 transition-colors duration-300 line-clamp-2">
                      {post.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="font-quicksand text-sm text-gray-600 leading-relaxed line-clamp-3 flex-grow">
                      {post.excerpt}
                    </p>

                    {/* Read more link */}
                    <div className="flex items-center gap-2 text-indigo-600 font-quicksand font-semibold text-sm mt-2">
                      <span>Baca Selengkapnya</span>
                      <span className="group-hover:translate-x-1 transition-transform duration-300">
                        →
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
