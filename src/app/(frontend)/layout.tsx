import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import { Fredoka, Quicksand } from 'next/font/google'
import React from 'react'

import { AdminBar } from '@/components/AdminBar'

import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'
import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'
import SmoothScroll from '@/components/SmoothScroll'
import PageTransition from '@/components/PageTransition'

const fredoka = Fredoka({
  subsets: ['latin'],
  variable: '--font-fredoka',
  weight: ['400', '500', '600', '700'],
})

const quicksand = Quicksand({
  subsets: ['latin'],
  variable: '--font-quicksand',
  weight: ['400', '500', '600', '700'],
})

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()

  const payload = await getPayload({ config })

  const header = await payload.findGlobal({
    slug: 'header',
    depth: 2,
  })

  const footer = await payload.findGlobal({
    slug: 'footer',
    depth: 2,
  })

  return (
    <html className={cn(fredoka.variable, quicksand.variable)} lang="en" suppressHydrationWarning>
      <head>
        <InitTheme />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
      </head>
      <body>
        <Providers>
          <AdminBar
            adminBarProps={{
              preview: isEnabled,
            }}
          />
          <SmoothScroll>
            <PageTransition>
              <Header navItems={header?.navItems as any} />
              {children}
              <Footer navItems={footer?.navItems as any} />
            </PageTransition>
          </SmoothScroll>
        </Providers>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  verification: {
    google: 'E5glzkCxn3E5q0Ol_l7aNu6J5CIgu8IlapfyANez_fw',
  },
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: '@payloadcms',
  },
}
