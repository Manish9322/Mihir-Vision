'use server';

import { MONGODB_URI } from '@/config/config';
import type { ImagePlaceholder } from '@/lib/placeholder-images';
import GalleryClient from './gallery-client';

const gallerySectionData = {
    title: 'Screenshot Gallery',
    subheadline: 'A glimpse into the worlds we are creating. Explore a selection of screenshots from our flagship projects.',
};

async function getGalleryData(): Promise<ImagePlaceholder[] | null> {
    if (!MONGODB_URI) {
        console.error('MongoDB URI is not configured, skipping fetch for Gallery section.');
        return null;
    }

    try {
        const baseUrl = process.env.NODE_ENV === 'production'
            ? `https://` + process.env.NEXT_PUBLIC_VERCEL_URL
            : 'http://localhost:9002';
        
        const res = await fetch(`${baseUrl}/api/gallery`, { cache: 'no-store' });

        if (!res.ok) {
            console.error(`Failed to fetch gallery data: ${res.status} ${res.statusText}`);
            return null;
        }

        const data = await res.json();
        return data;
    } catch (error) {
        console.error('An error occurred while fetching gallery data:', error);
        return null;
    }
}

export default async function Gallery() {
  const galleryData = await getGalleryData();

  if (!galleryData || galleryData.length === 0) {
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
            <GalleryClient galleryData={galleryData} />
        </div>
    </section>
  );
}
