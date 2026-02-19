import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import HomeHero from '@/components/PageComponents/HomeHero'
import Akademik from '@/components/PageComponents/Akademik'
import Testimonial from '@/components/PageComponents/Testimonial'
import type { Section } from '@/payload-types'

export async function generateMetadata() {
  const payload = await getPayload({ config })

  const pages = await payload.find({
    collection: 'pages',
    where: {
      slug: {
        equals: 'home',
      },
    },
    depth: 2,
  })

  const page = pages.docs[0]

  if (!page) {
    return {
      title: 'Page Not Found',
    }
  }

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

export default async function HomePage() {
  const payload = await getPayload({ config })

  const pages = await payload.find({
    collection: 'pages',
    where: {
      slug: {
        equals: 'home',
      },
    },
    depth: 2, // This populates the sections relationship
  })

  const page = pages.docs[0]

  if (!page) {
    notFound()
  }

  const sections = page.sections as Section[] | undefined

  if (!sections || sections.length === 0) {
    return <main>No sections found</main>
  }

  // Find specific sections by title
  const akademikSection = sections.find((s) => s.title === 'Akademik')
  const testimonialSection = sections.find((s) => s.title === 'Testimonial')

  return (
    <main>
      {/* Render first section as Hero with second section (Tentang Kami) and third section (Highlight Kami) */}
      <HomeHero
        section={sections[0]}
        nextSection={sections[1]} // Tentang Kami
        highlightSection={sections[2]} // Activities & Programs / Highlight Kami
      />

      {/* Akademik Section (Award-winning style) */}
      {akademikSection && <Akademik section={akademikSection} />}

      {/* Testimonial Section (Spotlight animation) */}
      {testimonialSection && <Testimonial section={testimonialSection} />}

      {/* Render remaining sections (skip Hero, Tentang Kami, Highlight Kami, Akademik, and Testimonial) */}
      {sections
        .filter(
          (section) =>
            section.id !== sections[0].id &&
            section.id !== sections[1]?.id &&
            section.id !== sections[2]?.id &&
            section.id !== akademikSection?.id &&
            section.id !== testimonialSection?.id,
        )
        .map((section, index) => (
          <section
            key={section.id || index}
            className={`py-20 px-8 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
          >
            <div className="max-w-6xl mx-auto flex flex-col items-center text-center gap-8">
              {section.title && (
                <h2 className="font-fredoka text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800">
                  {section.title}
                </h2>
              )}

              {section.subtitle && (
                <h3 className="font-quicksand text-xl md:text-2xl lg:text-3xl font-semibold text-gray-600">
                  {section.subtitle}
                </h3>
              )}

              {section.image && typeof section.image === 'object' && section.image?.url && (
                <div className="w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    src={(section.image as any).cloudinaryUrl || section.image.url}
                    alt={section.title || ''}
                    className="w-full h-auto"
                  />
                </div>
              )}

              {section.description && (
                <div className="font-quicksand text-base md:text-lg lg:text-xl text-gray-500 leading-relaxed max-w-3xl whitespace-pre-line">
                  {section.description}
                </div>
              )}
            </div>
          </section>
        ))}
    </main>
  )
}
