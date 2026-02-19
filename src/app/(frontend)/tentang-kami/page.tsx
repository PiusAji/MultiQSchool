import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import TentangKamiHero from '@/components/PageComponents/TentangKamiHero'
import VisiMisi from '@/components/PageComponents/VisiMisi'
import MetodeMengajar from '@/components/PageComponents/MetodeMengajar'
import type { Section } from '@/payload-types'

export async function generateMetadata() {
  const payload = await getPayload({ config })

  const pages = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'tentang-kami' } },
    depth: 2,
  })

  const page = pages.docs[0]
  if (!page) return { title: 'Page Not Found' }

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

export default async function TentangKamiPage() {
  const payload = await getPayload({ config })

  const pages = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'tentang-kami' } },
    depth: 2,
  })

  const page = pages.docs[0]
  if (!page) return notFound()

  const sections = page.sections as Section[] | undefined

  if (!sections || sections.length === 0) {
    return <main>No sections found</main>
  }

  // sections[0] → TentangKamiHero
  // sections[1] → VisiMisi
  // sections[2] → MetodeMengajar
  const heroSection = sections[0]
  const visiMisiSection = sections[1]
  const metodeSection = sections[2]

  return (
    <main>
      <TentangKamiHero section={heroSection} />
      {visiMisiSection && <VisiMisi section={visiMisiSection} />}
      {metodeSection && <MetodeMengajar section={metodeSection} />}
    </main>
  )
}
