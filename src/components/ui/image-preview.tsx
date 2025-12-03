'use client';

import Image from 'next/image';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import type { ImagePlaceholder } from '@/lib/placeholder-images';

interface ImagePreviewProps {
  image: ImagePlaceholder;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ImagePreview({ image, open, onOpenChange }: ImagePreviewProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 bg-transparent border-0 max-w-5xl w-full h-auto">
        <div className="relative aspect-video">
          <Image
            src={image.imageUrl}
            alt={image.description}
            fill
            className="object-contain"
            sizes="90vw"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}