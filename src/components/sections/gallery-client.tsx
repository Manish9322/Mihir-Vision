'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { ImagePlaceholder } from '@/lib/placeholder-images';
import { ImagePreview } from '@/components/ui/image-preview';

export default function GalleryClient({ galleryData }: { galleryData: ImagePlaceholder[] }) {
  const [selectedImage, setSelectedImage] = useState<ImagePlaceholder | null>(null);

  return (
    <>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {galleryData.map((image, index) => (
            <div
            key={index}
            className="group relative aspect-video w-full rounded-xl overflow-hidden cursor-pointer"
            onClick={() => setSelectedImage(image)}
            >
            <Image
                src={image.imageUrl}
                alt={image.description}
                fill
                className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                data-ai-hint={image.imageHint}
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
            <div className="absolute bottom-4 left-4">
                <p className="text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
                {image.description}
                </p>
            </div>
            </div>
        ))}
        </div>

        {selectedImage && (
            <ImagePreview
            image={selectedImage}
            open={!!selectedImage}
            onOpenChange={(isOpen) => {
                if (!isOpen) {
                setSelectedImage(null);
                }
            }}
            />
        )}
    </>
  );
}
