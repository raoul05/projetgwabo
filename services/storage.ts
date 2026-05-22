import { createClient } from '@/lib/supabase/client'

const IMAGES_BUCKET = 'produits-images'
const VIDEOS_BUCKET = 'produits-videos'

const MAX_IMAGES = 3
const MAX_VIDEOS = 1
const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024 // 50MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const ALLOWED_VIDEO_TYPES = ['video/mp4']

export interface UploadResult {
  success: boolean
  path?: string
  publicUrl?: string
  error?: string
}

function generateFileName(file: File, prefix: string): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  return `${prefix}/${timestamp}-${random}.${ext}`
}

export function validateImageFile(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return 'Format non supporté. Utilisez JPG, PNG ou WebP.'
  }
  if (file.size > MAX_IMAGE_SIZE) {
    return 'Image trop grande. Maximum 5 Mo.'
  }
  return null
}

export function validateVideoFile(file: File): string | null {
  if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
    return 'Format non supporté. Seul le MP4 est accepté.'
  }
  if (file.size > MAX_VIDEO_SIZE) {
    return 'Vidéo trop grande. Maximum 50 Mo.'
  }
  return null
}

export async function uploadProductImage(
  file: File,
  productId: string
): Promise<UploadResult> {
  const validation = validateImageFile(file)
  if (validation) {
    return { success: false, error: validation }
  }

  const supabase = createClient()
  const path = generateFileName(file, `product-${productId}`)

  const { error } = await supabase.storage
    .from(IMAGES_BUCKET)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) {
    console.error('Error uploading image:', error)
    return { success: false, error: 'Erreur lors du téléchargement.' }
  }

  const { data: urlData } = supabase.storage
    .from(IMAGES_BUCKET)
    .getPublicUrl(path)

  return {
    success: true,
    path,
    publicUrl: urlData.publicUrl,
  }
}

export async function uploadProductVideo(
  file: File,
  productId: string
): Promise<UploadResult> {
  const validation = validateVideoFile(file)
  if (validation) {
    return { success: false, error: validation }
  }

  const supabase = createClient()
  const path = generateFileName(file, `product-${productId}`)

  const { error } = await supabase.storage
    .from(VIDEOS_BUCKET)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) {
    console.error('Error uploading video:', error)
    return { success: false, error: 'Erreur lors du téléchargement.' }
  }

  const { data: urlData } = supabase.storage
    .from(VIDEOS_BUCKET)
    .getPublicUrl(path)

  return {
    success: true,
    path,
    publicUrl: urlData.publicUrl,
  }
}

export async function deleteMedia(
  path: string,
  bucket: typeof IMAGES_BUCKET | typeof VIDEOS_BUCKET
): Promise<boolean> {
  const supabase = createClient()

  const { error } = await supabase.storage
    .from(bucket)
    .remove([path])

  if (error) {
    console.error('Error deleting media:', error)
    return false
  }

  return true
}

export function getPublicUrl(
  path: string,
  bucket: typeof IMAGES_BUCKET | typeof VIDEOS_BUCKET
): string {
  const supabase = createClient()

  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path)

  return data.publicUrl
}

export async function compressImage(file: File, maxWidth = 1200, quality = 0.8): Promise<File> {
  return new Promise((resolve) => {
    const img = new Image()
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    img.onload = () => {
      let { width, height } = img

      if (width > maxWidth) {
        height = (height * maxWidth) / width
        width = maxWidth
      }

      canvas.width = width
      canvas.height = height
      ctx?.drawImage(img, 0, 0, width, height)

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(new File([blob], file.name, { type: 'image/jpeg' }))
          } else {
            resolve(file)
          }
        },
        'image/jpeg',
        quality
      )
    }

    img.onerror = () => resolve(file)
    img.src = URL.createObjectURL(file)
  })
}

export { MAX_IMAGES, MAX_VIDEOS, IMAGES_BUCKET, VIDEOS_BUCKET }
