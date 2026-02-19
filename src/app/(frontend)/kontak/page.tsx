import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import ContactHero from '@/components/PageComponents/ContactHero'
import ContactUs from '@/components/PageComponents/ContactUs'
import type { Section } from '@/payload-types'

export async function generateMetadata() {
  const payload = await getPayload({ config })

  const pages = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'kontak' } },
    depth: 2,
  })

  const page = pages.docs[0]
  if (!page) return { title: 'Kontak' }

  return {
    title: page.meta?.title || page.title,
    description: page.meta?.description,
    openGraph: {
      title: page.meta?.title || page.title,
      description: page.meta?.description,
      images: page.meta?.image
        ? [
            {
              url:
                typeof page.meta.image === 'object' && page.meta.image
                  ? (page.meta.image as any).cloudinaryUrl || page.meta.image.url || ''
                  : '',
            },
          ]
        : undefined,
    },
  }
}

export default async function KontakPage() {
  const payload = await getPayload({ config })

  const pages = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'kontak' } },
    depth: 2,
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

  // sections[0] = ContactHero  (title, image, description)
  // sections[1] = ContactUs    (title only)
  const heroSection = sections[0]
  const contactSection = sections[1]

  return (
    <main>
      <ContactHero section={heroSection} />
      {contactSection && <ContactUs section={contactSection} />}
    </main>
  )
}
