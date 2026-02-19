import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { RichText } from '@payloadcms/richtext-lexical/react'

// Helper to extract plain text excerpt
function extractExcerpt(content: any, maxLength = 150): string {
  if (!content) return ''

  try {
    const root = content?.root
    if (!root || !root.children) return ''

    let text = ''

    const extractText = (node: any): void => {
      if (node.text) {
        text += node.text + ' '
      }
      if (node.children && Array.isArray(node.children)) {
        node.children.forEach(extractText)
      }
    }

    root.children.forEach(extractText)

    text = text.trim()
    if (text.length > maxLength) {
      return text.substring(0, maxLength).trim() + '...'
    }
    return text
  } catch (error) {
    return ''
  }
}

export async function generateStaticParams() {
  const payload = await getPayload({ config })

  const posts = await payload.find({
    collection: 'posts',
    where: {
      _status: { equals: 'published' },
    },
    limit: 1000,
    pagination: false,
  })

  return posts.docs.map((post) => ({
    slug: post.slug || '',
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayload({ config })

  const posts = await payload.find({
    collection: 'posts',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  const post = posts.docs[0]
  if (!post) return { title: 'Post Not Found' }

  const imageUrl =
    typeof post.heroImage === 'object' && post.heroImage
      ? (post.heroImage as any).cloudinaryUrl || post.heroImage.url
      : undefined

  return {
    title: post.title,
    description: extractExcerpt(post.content, 160),
    openGraph: {
      title: post.title,
      description: extractExcerpt(post.content, 160),
      images: imageUrl ? [{ url: imageUrl }] : undefined,
    },
  }
}

export default async function PostDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayload({ config })

  // Fetch the post
  const posts = await payload.find({
    collection: 'posts',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  })

  const post = posts.docs[0]
  if (!post) return notFound()

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date)
  }

  const imageUrl =
    typeof post.heroImage === 'object' && post.heroImage?.url ? post.heroImage.url : null

  const categoryColors = (categoryTitle?: string) => {
    if (!categoryTitle) return { bg: 'bg-gray-100', text: 'text-gray-700' }
    const lower = categoryTitle.toLowerCase()
    if (lower.includes('berita')) return { bg: 'bg-blue-100', text: 'text-blue-700' }
    if (lower.includes('pengumuman')) return { bg: 'bg-purple-100', text: 'text-purple-700' }
    return { bg: 'bg-gray-100', text: 'text-gray-700' }
  }

  const firstCategory =
    post.categories && Array.isArray(post.categories) && post.categories.length > 0
      ? typeof post.categories[0] === 'object'
        ? post.categories[0]
        : null
      : null

  const colors = categoryColors(firstCategory?.title)

  // Fetch related posts (same category, exclude current)
  const relatedPosts = firstCategory
    ? await payload.find({
        collection: 'posts',
        where: {
          _status: { equals: 'published' },
          categories: { contains: firstCategory.id },
          id: { not_equals: post.id },
        },
        sort: '-publishedAt',
        limit: 3,
        depth: 1,
      })
    : null

  return (
    <main className="bg-gray-50">
      {/* Hero section */}
      <div className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 pt-40 pb-20 -mt-[120px]">
        <div className="max-w-4xl mx-auto px-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm font-quicksand text-gray-600 mb-6">
            <Link href="/berita-dan-pengumuman" className="hover:text-indigo-600 transition-colors">
              Berita & Pengumuman
            </Link>
            <span>/</span>
            {firstCategory && (
              <>
                <Link
                  href={`/berita-dan-pengumuman/${firstCategory.title?.toLowerCase()}`}
                  className="hover:text-indigo-600 transition-colors"
                >
                  {firstCategory.title}
                </Link>
                <span>/</span>
              </>
            )}
            <span className="text-gray-400">{post.title}</span>
          </div>

          {/* Category + Date */}
          <div className="flex items-center gap-3 mb-4">
            {firstCategory && (
              <span
                className={`${colors.bg} ${colors.text} px-4 py-1.5 rounded-full text-sm font-quicksand font-semibold`}
              >
                {firstCategory.title}
              </span>
            )}
            {post.publishedAt && (
              <span className="text-sm text-gray-600 font-quicksand">
                {formatDate(post.publishedAt)}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="font-fredoka text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight mb-8">
            {post.title}
          </h1>
        </div>
      </div>

      {/* Hero Image */}
      {imageUrl && (
        <div className="max-w-5xl mx-auto px-6 -mt-10 mb-12">
          <div className="relative w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
            <Image src={imageUrl} alt={post.title || ''} fill className="object-cover" priority />
          </div>
        </div>
      )}

      {/* Content */}
      <article className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12">
          <div
            className="prose prose-lg prose-slate max-w-none
            prose-headings:font-fredoka prose-headings:text-gray-800
            prose-p:font-quicksand prose-p:text-gray-700 prose-p:leading-relaxed
            prose-a:text-indigo-600 prose-a:no-underline hover:prose-a:underline
            prose-strong:text-gray-800 prose-strong:font-semibold
            prose-ul:font-quicksand prose-ol:font-quicksand
            prose-li:text-gray-700
            prose-img:rounded-2xl prose-img:shadow-md
          "
          >
            <RichText data={post.content} />
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts && relatedPosts.docs.length > 0 && (
        <div className="max-w-5xl mx-auto px-6 py-16">
          <h2 className="font-fredoka text-3xl font-bold text-gray-800 mb-8 text-center">
            Baca Juga
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedPosts.docs.map((related) => {
              const relatedImageUrl =
                typeof related.heroImage === 'object' && related.heroImage?.url
                  ? related.heroImage.url
                  : null

              return (
                <Link
                  key={related.id}
                  href={`/berita-dan-pengumuman/${related.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500"
                >
                  <div className="relative h-48 bg-gray-200">
                    {relatedImageUrl ? (
                      <Image
                        src={relatedImageUrl}
                        alt={related.title || ''}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                        <span className="text-5xl opacity-30">📰</span>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-fredoka text-lg font-bold text-gray-800 leading-tight group-hover:text-indigo-600 transition-colors duration-300 line-clamp-2">
                      {related.title}
                    </h3>
                    {related.publishedAt && (
                      <p className="text-xs text-gray-500 font-quicksand mt-2">
                        {formatDate(related.publishedAt)}
                      </p>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* Back button */}
      <div className="max-w-4xl mx-auto px-6 pb-16 text-center">
        <Link
          href="/berita-dan-pengumuman"
          className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-500 text-white font-quicksand font-semibold rounded-full hover:bg-indigo-600 transition-colors duration-300 shadow-lg"
        >
          ← Kembali ke Semua Berita
        </Link>
      </div>
    </main>
  )
}
