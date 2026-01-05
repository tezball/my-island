import { useState, useRef, useCallback } from 'react'
import Icon from './Icon'
import { cn } from '@/lib/utils'

interface ImageUploadProps {
  images: string[]
  onChange: (images: string[]) => void
  maxImages?: number
  className?: string
}

// Recommended image dimensions for different use cases
const IMAGE_GUIDELINES = {
  recommended: '1920 × 1080 pixels (16:9 ratio)',
  minimum: '1200 × 800 pixels',
  maxSize: '10MB per image',
  formats: 'JPG, PNG, WebP',
}

export default function ImageUpload({
  images,
  onChange,
  maxImages = 10,
  className,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return

    setError(null)
    setIsLoading(true)

    const newImages: string[] = []
    const remainingSlots = maxImages - images.length

    for (let i = 0; i < Math.min(files.length, remainingSlots); i++) {
      const file = files[i]

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError(`${file.name} is not an image file`)
        continue
      }

      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        setError(`${file.name} exceeds 10MB limit`)
        continue
      }

      // Convert to base64 for preview (in production, you'd upload to S3/cloud storage)
      try {
        const base64 = await fileToBase64(file)
        newImages.push(base64)
      } catch {
        setError(`Failed to process ${file.name}`)
      }
    }

    if (newImages.length > 0) {
      onChange([...images, ...newImages])
    }

    setIsLoading(false)
  }, [images, maxImages, onChange])

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFiles(e.dataTransfer.files)
  }, [handleFiles])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files)
    // Reset input value so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [handleFiles])

  const handleRemove = useCallback((index: number) => {
    onChange(images.filter((_, i) => i !== index))
  }, [images, onChange])

  const handleReorder = useCallback((fromIndex: number, toIndex: number) => {
    const newImages = [...images]
    const [removed] = newImages.splice(fromIndex, 1)
    newImages.splice(toIndex, 0, removed)
    onChange(newImages)
  }, [images, onChange])

  const moveToFirst = useCallback((index: number) => {
    if (index === 0) return
    handleReorder(index, 0)
  }, [handleReorder])

  const canAddMore = images.length < maxImages

  return (
    <div className={cn('space-y-4', className)}>
      {/* Upload Area */}
      {canAddMore && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            'relative border-2 border-dashed rounded-xl p-6 sm:p-8 text-center cursor-pointer transition-all',
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-gray-300 dark:border-gray-600 hover:border-primary hover:bg-gray-50 dark:hover:bg-gray-800/50'
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleInputChange}
            className="hidden"
          />

          <div className="space-y-3">
            <div className={cn(
              'mx-auto w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-colors',
              isDragging ? 'bg-primary/20' : 'bg-gray-100 dark:bg-gray-700'
            )}>
              <Icon
                name={isDragging ? 'cloud_upload' : 'add_photo_alternate'}
                size={24}
                className={isDragging ? 'text-primary' : 'text-gray-500'}
              />
            </div>

            <div>
              <p className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">
                {isDragging ? 'Drop images here' : 'Drag & drop images'}
              </p>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                or <span className="text-primary font-medium">click to browse</span>
              </p>
            </div>

            {isLoading && (
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <Icon name="progress_activity" size={16} className="animate-spin" />
                Processing...
              </div>
            )}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-400">
          <Icon name="error" size={18} />
          {error}
        </div>
      )}

      {/* Image Guidelines */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Icon name="lightbulb" size={20} className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-blue-900 dark:text-blue-300 mb-2">Image Tips</p>
            <ul className="space-y-1 text-blue-700 dark:text-blue-400 text-xs sm:text-sm">
              <li className="flex items-start gap-2">
                <Icon name="check_circle" size={14} className="mt-0.5 flex-shrink-0" />
                <span><strong>Recommended:</strong> {IMAGE_GUIDELINES.recommended}</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="check_circle" size={14} className="mt-0.5 flex-shrink-0" />
                <span><strong>Minimum:</strong> {IMAGE_GUIDELINES.minimum}</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="check_circle" size={14} className="mt-0.5 flex-shrink-0" />
                <span><strong>Max size:</strong> {IMAGE_GUIDELINES.maxSize}</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="check_circle" size={14} className="mt-0.5 flex-shrink-0" />
                <span><strong>Formats:</strong> {IMAGE_GUIDELINES.formats}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Image Previews */}
      {images.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {images.length} of {maxImages} images
            </p>
            <p className="text-xs text-gray-500">
              Tap an image to make it the cover
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {images.map((image, index) => (
              <div
                key={index}
                className={cn(
                  'relative group aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all cursor-pointer',
                  index === 0
                    ? 'border-primary ring-2 ring-primary/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                )}
                onClick={() => moveToFirst(index)}
              >
                <img
                  src={image}
                  alt={`Property photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />

                {/* Cover badge */}
                {index === 0 && (
                  <div className="absolute top-2 left-2 px-2 py-1 bg-primary text-gray-900 text-xs font-bold rounded-md shadow">
                    Cover Photo
                  </div>
                )}

                {/* Remove button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemove(index)
                  }}
                  className="absolute top-2 right-2 w-7 h-7 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Icon name="close" size={16} className="text-white" />
                </button>

                {/* Make cover hint */}
                {index !== 0 && (
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <span className="text-white text-xs font-medium bg-black/60 px-2 py-1 rounded">
                      Set as cover
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {images.length === 0 && !canAddMore && (
        <p className="text-center text-gray-500 py-4">
          Maximum number of images reached
        </p>
      )}
    </div>
  )
}
