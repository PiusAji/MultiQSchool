import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import HeroAkademikPGTK from '@/components/PageComponents/HeroAkademikPGTK'
import KurikulumPGTK from '@/components/PageComponents/KurikulumPGTK'
import type { Section } from '@/payload-types'

export async function generateMetadata() {
  const payload = await getPayload({ config })

  const pages = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'akademik/pg-tk' } },
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
                typeof page.meta.image === 'object' && page.meta.image?.url
                  ? page.meta.image.url
                  : '',
            },
          ]
        : undefined,
    },
  }
}

export default async function AkademikPGTKPage() {
  const payload = await getPayload({ config })

  const pages = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'akademik/pg-tk' } },
    depth: 2,
  })

  const page = pages.docs[0]
  if (!page) notFound()

  const sections = page.sections as Section[] | undefined

  if (!sections || sections.length === 0) {
    return <main>No sections found</main>
  }

  // sections[0] = "Akademik PG/TK" (hero)
  // sections[1] = "Kurikulum PG/TK"
  const heroSection = sections[0]
  const kurikulumSection = sections[1]

  return (
    <main>
      <HeroAkademikPGTK section={heroSection} />
      {kurikulumSection && <KurikulumPGTK section={kurikulumSection} />}
    </main>
  )
}
