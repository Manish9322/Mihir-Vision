
'use client';

import { useGetVideosDataQuery } from '@/services/api';
import VideoPlayerClient from './video-player-client';
import VideoShowcaseSkeleton from '../skeletons/video-showcase-skeleton';

const videoSectionData = {
    title: 'Explore Our Work',
    subheadline: 'A showcase of our latest projects, breakthroughs, and team stories. Click on any video to play.'
}

export default function VideoShowcase() {
  const { data: videoData, isLoading, isError } = useGetVideosDataQuery(undefined);
  
  if (isLoading) {
    return <VideoShowcaseSkeleton />;
  }

  const visibleVideos = videoData?.filter((video: any) => video.isVisible) || [];

  if (isError || !visibleVideos || visibleVideos.length === 0) {
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
