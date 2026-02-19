import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateHeader } from './hooks/revalidateHeader'

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'navItems',
      type: 'array',
      fields: [
        {
          name: 'type',
          type: 'radio',
          required: true,
          defaultValue: 'link',
          options: [
            {
              label: 'Link (clickable)',
              value: 'link',
            },
            {
              label: 'Dropdown (has sub-items)',
              value: 'dropdown',
            },
          ],
        },
        {
          name: 'label',
          type: 'text',
          required: true,
          label: 'Label',
          admin: {
            condition: (data, siblingData) => siblingData?.type === 'dropdown',
          },
        },
        {
          name: 'link',
          type: 'group',
          label: 'Link',
          admin: {
            condition: (data, siblingData) => siblingData?.type === 'link',
          },
          fields: [
            link({
              appearances: false,
            }),
          ],
        },
        {
          name: 'subItems',
          type: 'array',
          label: 'Sub Items',
          admin: {
            condition: (data, siblingData) => siblingData?.type === 'dropdown',
            initCollapsed: true,
          },
          fields: [
            link({
              appearances: false,
            }),
            {
              name: 'description',
              type: 'text',
              label: 'Description (optional)',
              admin: {
                description: 'Short description shown in dropdown menu',
              },
            },
          ],
        },
      ],
      maxRows: 6,
      admin: {
        initCollapsed: true,
        components: {},
      },
    },
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}
