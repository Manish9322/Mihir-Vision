'use client';

import { useGetGalleryDataQuery } from '@/services/api';
import GalleryClient from './gallery-client';

const gallerySectionData = {
    title: 'Screenshot Gallery',
    subheadline: 'A glimpse into the worlds we are creating. Explore a selection of screenshots from our flagship projects.',
};

export default function Gallery() {
  const { data: galleryData, isLoading, isError } = useGetGalleryDataQuery(undefined);
  
  const visibleImages = galleryData?.filter((img: any) => img.isVisible) || [];

  if (isLoading || isError || !visibleImages || visibleImages.length === 0) {
    return null;
  }

  return (
    <section id="gallery" className="py-16 md:py-24 bg-secondary">
        <div className="container max-w-7xl">
            <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">
                {gallerySectionData.title}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
                {gallerySectionData.subheadline}
            </p>
            </div>
            <GalleryClient galleryData={visibleImages} />
        </div>
    </section>
  );
}
