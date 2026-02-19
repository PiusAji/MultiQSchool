import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'

export const Sections: CollectionConfig = {
  slug: 'sections',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'subtitle', 'updatedAt'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Main title for this section',
      },
    },
    {
      name: 'subtitle',
      type: 'text',
      admin: {
        description: 'Optional subtitle or tagline',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Optional image for this section',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Main content/description for this section',
      },
    },
    // ✅ Gallery relationship — used by GalleryHero and GalleryGrid sections
    {
      name: 'galleries',
      type: 'relationship',
      relationTo: 'galleries',
      hasMany: true,
      admin: {
        description:
          'Select gallery albums to display in this section. Used for GalleryHero (pick 1) and GalleryGrid (pick all).',
      },
    },
    {
      name: 'subsections',
      type: 'array',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'subtitle',
          type: 'text',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'description',
          type: 'textarea',
        },
        {
          name: 'listItems',
          type: 'array',
          admin: {
            description: 'For mission points, bullet lists, etc.',
          },
          fields: [
            {
              name: 'text',
              type: 'text',
              required: true,
            },
            {
              name: 'icon',
              type: 'text',
              admin: {
                description: 'Optional emoji e.g. 🎯',
              },
            },
          ],
        },
      ],
    },
  ],
  versions: {
    drafts: true,
    maxPerDoc: 10,
  },
}
