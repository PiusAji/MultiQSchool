import type { CollectionConfig } from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

async function uploadToCloudinary(fileData: any, fileName: string) {
  const { v2: cloudinary } = await import('cloudinary')

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  })

  const base64File = `data:${fileData.mimetype};base64,${fileData.data.toString('base64')}`

  // Sanitize filename: replace spaces with underscores or hyphens
  const originalName = fileName
    .replace(/\.[^/.]+$/, '') // Remove extension
    .replace(/\s+/g, '_') // Replace spaces with underscores
    .replace(/[^a-zA-Z0-9_-]/g, '-') // Replace special chars with hyphens

  return await cloudinary.uploader.upload(base64File, {
    folder: 'multiqschool',
    public_id: originalName,
    unique_filename: true,
  })
}

async function deleteFromCloudinary(cloudinaryUrl: string) {
  const { v2: cloudinary } = await import('cloudinary')

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  })

  // Extract public_id from Cloudinary URL
  const uploadIndex = cloudinaryUrl.indexOf('/upload/') + 8
  const urlAfterUpload = cloudinaryUrl.substring(uploadIndex)

  // Remove version number (v1234567890/) if present
  const withoutVersion = urlAfterUpload.replace(/^v\d+\//, '')

  // Remove file extension
  const publicIdEncoded = withoutVersion.substring(0, withoutVersion.lastIndexOf('.'))

  // Decode URL encoding (convert %20 back to spaces, etc.)
  const publicId = decodeURIComponent(publicIdEncoded)

  console.log('🗑️ Deleting from Cloudinary, public_id:', publicId)

  const result = await cloudinary.uploader.destroy(publicId)
  console.log('🗑️ Cloudinary delete result:', result)

  return result
}

export const Media: CollectionConfig = {
  slug: 'media',
  folders: true,
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
    },
    {
      name: 'caption',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()]
        },
      }),
    },
    {
      name: 'cloudinaryUrl',
      type: 'text',
      admin: { readOnly: true },
    },
  ],
  upload: {
    staticDir: path.resolve(dirname, '../../public/media'),
    adminThumbnail: 'thumbnail',
    focalPoint: true,
    imageSizes: [
      {
        name: 'thumbnail',
        width: 300,
      },
      {
        name: 'square',
        width: 500,
        height: 500,
      },
      {
        name: 'small',
        width: 600,
      },
      {
        name: 'medium',
        width: 900,
      },
      {
        name: 'large',
        width: 1400,
      },
      {
        name: 'xlarge',
        width: 1920,
      },
      {
        name: 'og',
        width: 1200,
        height: 630,
        crop: 'center',
      },
    ],
  },
  hooks: {
    afterChange: [
      async ({ doc, req, operation }) => {
        // Upload async, don't block the response
        if (operation === 'create' && req.file) {
          // Don't await - let it happen in background
          uploadToCloudinary(req.file, req.file.name || 'upload')
            .then(async (result) => {
              console.log('✅ Uploaded:', result.secure_url)
              // Update doc with cloudinary URL asynchronously
              try {
                await req.payload.update({
                  collection: 'media',
                  id: doc.id,
                  data: {
                    cloudinaryUrl: result.secure_url,
                  },
                })
              } catch (err) {
                console.error('Update error:', err)
              }
            })
            .catch((err) => console.error('❌ Upload error:', err))
        }
      },
    ],
    beforeDelete: [
      async ({ id, req }) => {
        // Fetch the document to get the cloudinaryUrl before deletion
        try {
          const doc = await req.payload.findByID({
            collection: 'media',
            id,
          })

          if (doc?.cloudinaryUrl) {
            const result = await deleteFromCloudinary(doc.cloudinaryUrl)
            console.log('✅ Deleted from Cloudinary:', result)
          }
        } catch (err) {
          console.error('❌ Cloudinary delete error:', err)
        }
      },
    ],
  },
}
