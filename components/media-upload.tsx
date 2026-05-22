'use client'

import { useState, useCallback, useRef } from 'react'
import { Upload, X, Image as ImageIcon, Video, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { 
  validateImageFile, 
  validateVideoFile, 
  compressImage,
  uploadProductImage,
  uploadProductVideo,
  MAX_IMAGES, 
  MAX_VIDEOS 
} from '@/services/storage'
import { isSupabaseConfigured } from '@/lib/supabase/client'

interface MediaUploadProps {
  images: string[]
  video: string | null
  onImagesChange: (images: string[]) => void
  onVideoChange: (video: string | null) => void
  productId?: string
}

export function MediaUpload({ 
  images, 
  video, 
  onImagesChange, 
  onVideoChange,
  productId,
}: MediaUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadingImages, setUploadingImages] = useState(false)
  const [uploadingVideo, setUploadingVideo] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    setError(null)

    const files = Array.from(e.dataTransfer.files)
    
    for (const file of files) {
      if (file.type.startsWith('image/')) {
        await handleImageFile(file)
      } else if (file.type.startsWith('video/')) {
        await handleVideoFile(file)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images, video])

  const handleImageFile = async (file: File) => {
    if (images.length >= MAX_IMAGES) {
      setError(`Maximum ${MAX_IMAGES} images autorisées.`)
      return
    }

    const validation = validateImageFile(file)
    if (validation) {
      setError(validation)
      return
    }

    setUploadingImages(true)
    try {
      // Compress image
      const compressed = await compressImage(file)

      if (isSupabaseConfigured()) {
        const prodId = productId || `new-${Date.now()}`
        const res = await uploadProductImage(compressed, prodId)
        if (res.success && res.publicUrl) {
          onImagesChange([...images, res.publicUrl])
        } else {
          setError(res.error || 'Erreur lors du téléchargement de l\'image.')
        }
      } else {
        // Create local preview URL
        const previewUrl = URL.createObjectURL(compressed)
        onImagesChange([...images, previewUrl])
      }
    } catch {
      setError('Erreur lors du traitement de l\'image.')
    } finally {
      setUploadingImages(false)
    }
  }

  const handleVideoFile = async (file: File) => {
    if (video) {
      setError(`Maximum ${MAX_VIDEOS} vidéo autorisée.`)
      return
    }

    const validation = validateVideoFile(file)
    if (validation) {
      setError(validation)
      return
    }

    setUploadingVideo(true)
    try {
      if (isSupabaseConfigured()) {
        const prodId = productId || `new-${Date.now()}`
        const res = await uploadProductVideo(file, prodId)
        if (res.success && res.publicUrl) {
          onVideoChange(res.publicUrl)
        } else {
          setError(res.error || 'Erreur lors du téléchargement de la vidéo.')
        }
      } else {
        const previewUrl = URL.createObjectURL(file)
        onVideoChange(previewUrl)
      }
    } catch {
      setError('Erreur lors du traitement de la vidéo.')
    } finally {
      setUploadingVideo(false)
    }
  }

  const handleImageInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    const files = Array.from(e.target.files || [])
    for (const file of files) {
      await handleImageFile(file)
    }
    if (imageInputRef.current) imageInputRef.current.value = ''
  }

  const handleVideoInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    const files = Array.from(e.target.files || [])
    if (files[0]) {
      await handleVideoFile(files[0])
    }
    if (videoInputRef.current) videoInputRef.current.value = ''
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    onImagesChange(newImages)
  }

  const removeVideo = () => {
    onVideoChange(null)
  }

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-primary/50'
        }`}
      >
        <Upload className={`h-8 w-8 mx-auto mb-3 ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
        <p className="text-sm font-medium text-foreground mb-1">
          Glissez vos fichiers ici
        </p>
        <p className="text-xs text-muted-foreground mb-4">
          ou cliquez pour sélectionner
        </p>
        <div className="flex justify-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => imageInputRef.current?.click()}
            disabled={images.length >= MAX_IMAGES || uploadingImages}
          >
            {uploadingImages ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <ImageIcon className="h-4 w-4 mr-2" />
            )}
            Images ({images.length}/{MAX_IMAGES})
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => videoInputRef.current?.click()}
            disabled={!!video || uploadingVideo}
          >
            {uploadingVideo ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Video className="h-4 w-4 mr-2" />
            )}
            Vidéo ({video ? 1 : 0}/{MAX_VIDEOS})
          </Button>
        </div>
        <input
          ref={imageInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={handleImageInput}
        />
        <input
          ref={videoInputRef}
          type="file"
          accept="video/mp4"
          className="hidden"
          onChange={handleVideoInput}
        />
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      {/* Image previews */}
      {images.length > 0 && (
        <div>
          <p className="text-sm font-medium text-foreground mb-2">Images</p>
          <div className="grid grid-cols-3 gap-3">
            {images.map((src, index) => (
              <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-muted group">
                <img
                  src={src}
                  alt={`Image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Video preview */}
      {video && (
        <div>
          <p className="text-sm font-medium text-foreground mb-2">Vidéo</p>
          <div className="relative rounded-lg overflow-hidden bg-muted group">
            <video
              src={video}
              controls
              className="w-full max-h-48 object-cover"
            />
            <button
              type="button"
              onClick={removeVideo}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Guidelines */}
      <div className="text-xs text-muted-foreground space-y-1">
        <p>• Images: JPG, PNG, WebP — max 5 Mo chacune — max {MAX_IMAGES} images</p>
        <p>• Vidéo: MP4 uniquement — max 50 Mo — max {MAX_VIDEOS} vidéo</p>
      </div>
    </div>
  )
}
