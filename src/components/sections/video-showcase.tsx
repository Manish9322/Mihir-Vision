'use server';

import { MONGODB_URI } from '@/config/config';
import type { VideoInfo } from '@/lib/video-data';
import VideoPlayerClient from './video-player-client';

const videoSectionData = {
    title: 'Explore Our Work',
    subheadline: 'A showcase of our latest projects, breakthroughs, and team stories. Click on any video to play.'
}

async function getVideosData(): Promise<VideoInfo[] | null> {
    if (!MONGODB_URI) {
        console.error('MongoDB URI is not configured, skipping fetch for Videos section.');
        return null;
    }

    try {
        const baseUrl = process.env.NODE_ENV === 'production'
            ? `https://` + process.env.NEXT_PUBLIC_VERCEL_URL
            : 'http://localhost:9002';
        
        const res = await fetch(`${baseUrl}/api/videos`, { cache: 'no-store' });

        if (!res.ok) {
            console.error(`Failed to fetch videos data: ${res.status} ${res.statusText}`);
            return null;
        }

        const data = await res.json();
        return data;
    } catch (error) {
        console.error('An error occurred while fetching videos data:', error);
        return null;
    }
}


export default async function VideoShowcase() {
  const videoData = await getVideosData();
  
  const visibleVideos = videoData?.filter(video => video.isVisible) || [];

  if (!visibleVideos || visibleVideos.length === 0) {
    return null;
  }

  return (
    <section id="video-showcase" className="py-16 md:py-24 bg-background">
      <div className="container max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">
            {videoSectionData.title}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {videoSectionData.subheadline}
          </p>
        </div>
        <VideoPlayerClient videoData={visibleVideos} />
      </div>
    </section>
  );
}
