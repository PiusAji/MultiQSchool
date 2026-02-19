import type { CollectionConfig } from 'payload'

import { authenticated } from '../access/authenticated'
import { authenticatedOrPublished } from '../access/authenticatedOrPublished'

export const Galleries: CollectionConfig = {
  slug: 'galleries',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'date', 'updatedAt'],
    description: 'Manage gallery albums/activities shown on the Gallery page.',
  },
  defaultPopulate: {
    title: true,
    category: true,
    date: true,
    coverImage: true,
    images: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Activity or event name, e.g. "Pentas Seni 2024"',
      },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Pentas Seni', value: 'pentas-seni' },
        { label: 'Outing', value: 'outing' },
        { label: 'Competition', value: 'competition' },
        { label: 'Wisuda', value: 'wisuda' },
        { label: 'Other', value: 'other' },
      ],
      admin: {
        description: 'Type of activity',
      },
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      admin: {
        description: 'Date of the activity — used for sorting',
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'dd MMMM yyyy',
        },
      },
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Hero/cover image shown as the big preview',
      },
    },
    {
      name: 'images',
      type: 'array',
      minRows: 1,
      maxRows: 5,
      admin: {
        description: 'Up to 5 images for this activity (shown in the accordion strip)',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          type: 'text',
          admin: {
            description: 'Optional label shown on the image strip (e.g. "Tarian Khas Daerah")',
          },
        },
      ],
    },
  ],
  versions: {
    drafts: true,
    maxPerDoc: 10,
  },
}
