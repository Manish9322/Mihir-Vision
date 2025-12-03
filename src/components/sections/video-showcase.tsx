'use client';

import { useState } from 'react';
import Image from 'next/image';
import { videoData, videoSectionData } from '@/lib/video-data';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PlayCircle } from 'lucide-react';
import { VideoPlayer } from '@/components/ui/video-player';

export default function VideoShowcase() {
  const [activeVideo, setActiveVideo] = useState(videoData[0]);
  const [isLoading, setIsLoading] = useState(false);

  const handleVideoSelect = (video: typeof videoData[0]) => {
    if (activeVideo.id !== video.id) {
      setIsLoading(true);
      setActiveVideo(video);
      // Simulate loading time for the new video
      setTimeout(() => setIsLoading(false), 500);
    }
  };

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
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <VideoPlayer video={activeVideo} isLoading={isLoading} />
            <div className="mt-4">
              <h3 className="text-2xl font-bold font-headline">{activeVideo.title}</h3>
              <p className="text-muted-foreground mt-1">{activeVideo.subtitle}</p>
              <p className="text-sm text-muted-foreground mt-2">Duration: {activeVideo.duration}</p>
            </div>
          </div>

          <div className="lg:col-span-2">
            <ScrollArea className="h-[400px] w-full pr-4 scrollbar-hide">
              <div className="space-y-4">
                {videoData.map((video) => (
                  <Card
                    key={video.id}
                    className={`flex items-center gap-4 p-3 cursor-pointer transition-all shadow-sm ${
                      activeVideo.id === video.id ? 'bg-primary/10 border-primary' : 'bg-secondary/50'
                    }`}
                    onClick={() => handleVideoSelect(video)}
                  >
                    <div className="relative h-16 w-28 flex-shrink-0 overflow-hidden rounded-md">
                      <Image
                        src={video.thumbnail.imageUrl}
                        alt={video.title}
                        fill
                        className="object-cover"
                        sizes="7rem"
                      />
                    </div>
                    <div className="flex-grow min-w-0">
                      <h4 className="font-semibold text-sm truncate">{video.title}</h4>
                      <span className="text-xs text-muted-foreground">{video.duration}</span>
                    </div>
                    <PlayCircle
                      className={`h-6 w-6 flex-shrink-0 transition-colors ${
                        activeVideo.id === video.id ? 'text-primary' : 'text-muted-foreground/50'
                      }`}
                    />
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </section>
  );
}
