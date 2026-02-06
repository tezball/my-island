import React, { useState, useRef, useCallback } from 'react';
import {
    type EntityType,
    type EntityImage,
    validateFile,
    uploadImage,
    deleteImage,
    setPrimaryImage,
} from '../../services/imageService';

interface ImageUploadProps {
    entityType: EntityType;
    entityId: string;
    images: EntityImage[];
    onImagesChange: (images: EntityImage[]) => void;
    maxImages?: number;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
    entityType,
    entityId,
    images,
    onImagesChange,
    maxImages = 10,
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const [uploadingCount, setUploadingCount] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFiles = useCallback(async (files: FileList | File[]) => {
        setError(null);
        const fileArray = Array.from(files);
        const remaining = maxImages - images.length;

        if (fileArray.length > remaining) {
            setError(`You can upload ${remaining} more image${remaining === 1 ? '' : 's'}.`);
            return;
        }

        for (const file of fileArray) {
            const validationError = validateFile(file);
            if (validationError) {
                setError(validationError);
                return;
            }
        }

        setUploadingCount(fileArray.length);

        const newImages: EntityImage[] = [];
        for (const file of fileArray) {
            try {
                const img = await uploadImage(entityType, entityId, file, {
                    primary: images.length === 0 && newImages.length === 0,
                });
                newImages.push(img);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Upload failed');
            } finally {
                setUploadingCount(prev => prev - 1);
            }
        }

        if (newImages.length > 0) {
            onImagesChange([...images, ...newImages]);
        }
    }, [entityType, entityId, images, maxImages, onImagesChange]);

    const handleDelete = async (imageId: number) => {
        try {
            await deleteImage(imageId);
            onImagesChange(images.filter(img => img.id !== imageId));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Delete failed');
        }
    };

    const handleSetPrimary = async (imageId: number) => {
        try {
            await setPrimaryImage(imageId);
            onImagesChange(
                images.map(img => ({
                    ...img,
                    isPrimary: img.id === imageId,
                }))
            );
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to set primary');
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const canUploadMore = images.length < maxImages;

    return (
        <div className="space-y-3">
            {/* Image Grid */}
            {images.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                    {images.map(img => (
                        <div key={img.id} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                            <img
                                src={img.url}
                                alt={img.altText || 'Uploaded image'}
                                className="w-full h-full object-cover"
                            />
                            {img.isPrimary && (
                                <span className="absolute top-1 left-1 text-[10px] font-bold px-1.5 py-0.5 bg-primary text-white rounded">
                                    Primary
                                </span>
                            )}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100">
                                {!img.isPrimary && (
                                    <button
                                        type="button"
                                        onClick={() => handleSetPrimary(img.id)}
                                        className="p-1.5 bg-white/90 rounded-lg text-gray-700 hover:bg-white transition-colors"
                                        title="Set as primary"
                                    >
                                        <span className="material-symbols-outlined text-base">star</span>
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => handleDelete(img.id)}
                                    className="p-1.5 bg-white/90 rounded-lg text-red-600 hover:bg-white transition-colors"
                                    title="Delete"
                                >
                                    <span className="material-symbols-outlined text-base">delete</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Upload Zone */}
            {canUploadMore && (
                <div
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className={`
                        border-2 border-dashed rounded-lg p-5 text-center cursor-pointer transition-colors
                        ${isDragging
                            ? 'border-primary bg-emerald-50 dark:bg-emerald-900/20'
                            : 'border-gray-300 dark:border-gray-700 hover:border-primary/50 bg-gray-50 dark:bg-gray-800'
                        }
                    `}
                >
                    {uploadingCount > 0 ? (
                        <div className="flex flex-col items-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2" />
                            <p className="text-sm text-gray-500">Uploading {uploadingCount} image{uploadingCount > 1 ? 's' : ''}...</p>
                        </div>
                    ) : (
                        <>
                            <span className="material-symbols-outlined text-3xl text-gray-400 dark:text-gray-500 mb-1">
                                add_photo_alternate
                            </span>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                <span className="font-medium text-primary">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                                JPEG, PNG, GIF, WebP up to 10MB
                            </p>
                        </>
                    )}
                </div>
            )}

            <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                multiple
                onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                        handleFiles(e.target.files);
                        e.target.value = '';
                    }
                }}
                className="hidden"
            />

            {error && (
                <p className="text-red-500 text-xs">{error}</p>
            )}
        </div>
    );
};
