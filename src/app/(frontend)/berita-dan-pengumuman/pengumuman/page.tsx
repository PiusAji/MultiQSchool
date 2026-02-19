import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import BeritaPengumumanHero from '@/components/PageComponents/BeritaPengumumanHero'
import PostGrid from '@/components/PageComponents/PostGrid'
import type { Section } from '@/payload-types'

// Helper to extract plain text excerpt from Lexical rich text
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
    console.error('Error extracting excerpt:', error)
    return ''
  }
}

export async function generateMetadata() {
  return {
    title: 'Multi-Q School | Pengumuman Terbaru Kerobokan, Bali',
    description:
      'Pengumuman resmi terbaru dari Multi-Q School Kerobokan, Bali untuk orang tua dan siswa PG/TK & SD. Selalu update bersama kami!',
  }
}

export default async function PengumumanPage() {
  const payload = await getPayload({ config })

  // Fetch page content
  const pages = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'berita-dan-pengumuman' } },
    depth: 2,
  })

  const page = pages.docs[0]
  if (!page) return notFound()

  const sections = page.sections as Section[] | undefined
  const heroSection = sections?.[0]
  const postGridSection = sections?.[1]

  // Find Pengumuman category ID
  const categoriesResult = await payload.find({
    collection: 'categories',
    where: {
      title: { equals: 'Pengumuman' },
    },
    limit: 1,
  })

  const pengumumanCategory = categoriesResult.docs[0]
  if (!pengumumanCategory) {
    // If category doesn't exist, show empty state
    return (
      <main>
        {heroSection && <BeritaPengumumanHero section={heroSection} />}
        <PostGrid posts={[]} currentCategory="pengumuman" sectionTitle={postGridSection?.title} />
      </main>
    )
  }

  // Fetch posts filtered by Pengumuman category
  const postsResult = await payload.find({
    collection: 'posts',
    where: {
      _status: { equals: 'published' },
      categories: { contains: pengumumanCategory.id },
    },
    sort: '-publishedAt',
    limit: 50,
    depth: 2,
  })

  // Transform posts with excerpts
  const posts = postsResult.docs.map((post) => ({
    id: post.id,
    slug: post.slug || '',
    title: post.title || '',
    heroImage:
      typeof post.heroImage === 'object' && post.heroImage !== null
        ? {
            url: (post.heroImage as any).cloudinaryUrl || post.heroImage.url,
            alt: post.heroImage.alt,
          }
        : null,
    publishedAt: post.publishedAt || null,
    categories: post.categories
      ? Array.isArray(post.categories)
        ? post.categories
            .filter((cat) => typeof cat === 'object')
            .map((cat: any) => ({
              title: cat.title,
              id: cat.id,
            }))
        : []
      : [],
    excerpt: extractExcerpt(post.content, 150),
  }))

  return (
    <main>
      {heroSection && <BeritaPengumumanHero section={heroSection} />}
      <PostGrid posts={posts} currentCategory="pengumuman" sectionTitle={postGridSection?.title} />
    </main>
  )
}
