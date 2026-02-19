import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import GalleryHero from '@/components/PageComponents/GalleryHero'
import GalleryGrid from '@/components/PageComponents/GalleryGrid'
import type { Section } from '@/payload-types'

export async function generateMetadata() {
  const payload = await getPayload({ config })

  const pages = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'galeri' } },
    depth: 3,
  })

  const page = pages.docs[0]
  if (!page) return { title: 'Galeri' }

  return {
    title: page.meta?.title || page.title,
    description: page.meta?.description,
    openGraph: {
      title: page.meta?.title || page.title,
      description: page.meta?.description,
      images:
        page.meta?.image && typeof page.meta.image === 'object' && page.meta.image?.url
          ? [{ url: page.meta.image.url }]
          : undefined,
    },
  }
}

export default async function GaleriPage() {
  const payload = await getPayload({ config })

  const pages = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'galeri' } },
    // depth: 3 to resolve: page → sections → galleries → images (media)
    depth: 3,
  })

  const page = pages.docs[0]
  if (!page) notFound()

  const sections = page.sections as Section[] | undefined

  if (!sections || sections.length === 0) {
    return (
      <main>
        <p>No sections found.</p>
      </main>
    )
  }

  // sections[0] = GalleryHero  (title, description, image)
  // sections[1] = GalleryGrid  (title, galleries relationship)
  const heroSection = sections[0]
  const gridSection = sections[1]

  return (
    <main>
      <GalleryHero section={heroSection} />
      {gridSection && <GalleryGrid section={gridSection} />}
    </main>
  )
}
