# Payload CMS Setup Documentation

## Project Overview

This is a **Next.js + Payload CMS** project for a preschool and elementary school website. The setup uses a simplified collection structure focused on reusable sections.

---

## Collections Architecture

### 1. Pages Collection

**Location**: `src/collections/Pages/index.ts`

**Purpose**: Main pages of the website (Home, About, Contact, etc.)

**Key Fields**:

- `title` (text, required) - Page title
- `slug` (auto-generated) - URL slug
  - Homepage uses slug: `home` (NOT `/`)
  - Other pages use simple slugs: `about`, `contact`, etc.
- `sections` (relationship to Sections collection, hasMany: true) - The main content
- `meta` (SEO fields) - Meta title, description, image
- `publishedAt` (date) - Publication date

**Important Notes**:

- ❌ **NO Hero tab** - Removed, hero is now just the first section
- ❌ **NO Content/Blocks tab** - Removed, all content uses sections
- ✅ Only has: **Sections tab** and **SEO tab**
- The **first section** in the sections array is automatically rendered as the hero with special styling
- Remaining sections render as standard content sections

**Revalidation**:

- Has hooks for Next.js cache revalidation on publish/delete
- Located in `src/collections/Pages/hooks/revalidatePage.ts`

---

### 2. Sections Collection

**Location**: `src/collections/Sections/index.ts`

**Purpose**: Reusable content sections that can be added to any page

**Key Fields**:

- `title` (text, required) - Section title
- `subtitle` (text, optional) - Section subtitle/tagline
- `image` (upload, relationTo: 'media', optional) - Section image
- `description` (textarea, optional) - Section description/content

**Important Notes**:

- ⚠️ Description is **`textarea`** NOT `richText`
- This means it's plain text (no bold, italics, etc.)
- Line breaks are preserved with `whitespace-pre-line` CSS
- Sections are **reusable** across multiple pages
- Sections are **versioned** with drafts enabled

**Access Control**:

- Create/Update/Delete: Authenticated users only
- Read: Authenticated or published content

---

## Frontend Implementation

### Homepage

**Location**: `src/app/(frontend)/page.tsx`

**How it works**:

1. Fetches the page with slug `home` from Payload
2. Populates sections relationship (depth: 2)
3. Renders first section using `<HomeHero>` component from `@/components/PageComponents/HomeHero`
4. Renders remaining sections in a simple layout

**Key Code Pattern**:

```typescript
const pages = await payload.find({
  collection: 'pages',
  where: { slug: { equals: 'home' } },
  depth: 2, // Important: populates sections
})

const sections = page.sections as Section[]
```

---

### HomeHero Component

**Location**: `src/components/PageComponents/HomeHero.tsx`

**Purpose**: Animated hero section for the first section on homepage

**Design Features**:

- Playful, warm aesthetic for preschool/elementary school
- Organic floating shapes with GSAP animations
- Warm gradient background (amber/orange tones)
- Responsive grid layout (2 columns on desktop, 1 on mobile)
- Blob-shaped image container with rotation
- Parallax scroll effects

**Styling**:

- ✅ Uses **Tailwind CSS** (NO inline styles)
- Custom fonts: Fredoka (display) + Quicksand (body)
- All utility classes, easy to customize

**Animations** (GSAP):

- Elastic entrance for title
- Staggered reveals for elements
- Continuous floating animation for shapes
- Parallax scroll for image and shapes
- Smooth easing curves throughout

**Dependencies**:

- `gsap` - Main animation library
- `gsap/ScrollTrigger` - Scroll-based animations
- `next/image` - Optimized image loading

---

## Technical Stack

### Core Technologies

- **Framework**: Next.js (App Router)
- **CMS**: Payload CMS
- **Database**: MongoDB (via @payloadcms/db-mongodb)
- **Styling**: Tailwind CSS
- **Animations**: GSAP + ScrollTrigger
- **Image Optimization**: Next.js Image component

### Key Dependencies

```json
{
  "gsap": "^3.x.x",
  "payload": "^3.x.x",
  "next": "^15.x.x"
}
```

---

## Tailwind Configuration

### Custom Fonts Added

**Location**: `tailwind.config.ts`

```typescript
fontFamily: {
  fredoka: ['Fredoka', 'Comic Sans MS', 'cursive', 'sans-serif'],
  quicksand: ['Quicksand', 'sans-serif'],
}
```

### Font Loading

**Location**: `src/app/layout.tsx`

```typescript
import { Fredoka, Quicksand } from 'next/font/google'

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
```

---

## Content Management Workflow

### Creating a New Page

1. Go to Collections → Pages
2. Click "Create New"
3. Enter title and slug
4. Go to **Sections tab**
5. Select sections to add (first one = hero)
6. Go to **SEO tab** and fill in meta data
7. Publish

### Creating a Section

1. Go to Collections → Sections
2. Click "Create New"
3. Fill in:
   - Title (required)
   - Subtitle (optional)
   - Image (optional)
   - Description (optional, plain text)
4. Save and publish
5. Section is now available to add to any page

### Homepage Setup

**Important**: The homepage slug must be exactly `home` (not `/`)

The revalidation hook converts `home` → `/` automatically:

```typescript
const path = doc.slug === 'home' ? '/' : `/${doc.slug}`
```

---

## Important Design Decisions

### Why No Blocks System?

Previously, Pages had a "Content" tab with blocks (CallToAction, MediaBlock, etc.). We removed this because:

- ✅ Simpler mental model
- ✅ More consistent design across pages
- ✅ Easier for non-technical users
- ✅ Reusable content across pages
- ✅ All content follows same structure

### Why textarea Instead of richText?

The Sections collection uses `textarea` instead of `richText` because:

- ✅ Simpler to render (no serializer needed)
- ✅ Adequate for hero/section content
- ✅ Avoids TypeScript complexity
- ✅ Better for short-form content

**Note**: If rich formatting is needed in the future, can switch to `richText` and add proper serializer.

### Why First Section = Hero?

Instead of a dedicated Hero field/tab:

- ✅ More flexible (any section can be a hero)
- ✅ Consistent data structure
- ✅ Easier to manage
- ✅ Can have different hero styles per page

---

## Common Issues & Solutions

### Issue: TypeScript Error on `relationTo: 'sections'`

**Cause**: Sections collection not registered in payload.config.ts

**Solution**:

```typescript
// payload.config.ts
import { Sections } from './collections/Sections'

collections: [Pages, Posts, Media, Categories, Users, Sections]
```

### Issue: Description Not Rendering

**Cause**: Trying to render textarea as if it's richText

**Solution**: Just use `{section.description}` (it's a string)

### Issue: Line Breaks Not Showing

**Solution**: Add `whitespace-pre-line` Tailwind class

### Issue: GSAP Not Working

**Solution**:

```bash
npm install gsap
```

Then import and register:

```typescript
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)
```

---

## File Structure Reference

```
src/
├── app/
│   ├── (frontend)/
│   │   └── page.tsx              # Homepage
│   └── layout.tsx                # Root layout with fonts
├── collections/
│   ├── Pages/
│   │   ├── index.ts              # Pages collection config
│   │   └── hooks/
│   │       └── revalidatePage.ts # Revalidation logic
│   ├── Sections/
│   │   └── index.ts              # Sections collection config
│   ├── Posts/
│   ├── Media/
│   ├── Categories/
│   └── Users/
├── components/
│   └── PageComponents/
│       └── HomeHero.tsx          # Animated hero component
├── utilities/
│   └── generatePreviewPath.ts    # Preview URL generation
├── payload.config.ts             # Main Payload config
├── tailwind.config.ts            # Tailwind config
└── payload-types.ts              # Auto-generated types
```

---

## Future Enhancements

Potential additions to consider:

- [ ] Add CTA button to hero section
- [ ] Create different section layouts (image left, image right, centered, etc.)
- [ ] Add section type field for different styling
- [ ] Add video background option for hero
- [ ] Create reusable section templates
- [ ] Add animation controls (enable/disable per section)
- [ ] Add section ordering/drag-drop in admin
- [ ] Create section preview in admin panel

---

## Contact & Context

**Project Type**: Preschool and Elementary School Website

**Design Style**: Playful, warm, organic, welcoming

**Target Audience**: Parents and children

**Key Features**: Reusable sections, animated hero, mobile-friendly

---

_Last Updated: February 2026_
_This document should be provided to AI assistants for context in future conversations._
