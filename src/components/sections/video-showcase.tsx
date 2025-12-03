'use client';

import { useState } from 'react';
import Image from 'next/image';
import { videoData, videoSectionData } from '@/lib/video-data';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PlayCircle } from 'lucide-react';

export default function VideoShowcase() {
  const [activeVideo, setActiveVideo] = useState(videoData[0]);

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
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="overflow-hidden border-0">
              <CardContent className="p-0">
                <div className="relative aspect-video w-full">
                  <Image
                    src={activeVideo.thumbnail.imageUrl}
                    alt={activeVideo.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 67vw"
                  />
                   <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <PlayCircle className="h-20 w-20 text-white/80 hover:text-white transition-colors cursor-pointer" />
                  </div>
                </div>
                <div className="p-4 bg-muted/50">
                    <h3 className="font-bold text-lg">{activeVideo.title}</h3>
                    <p className="text-sm text-muted-foreground">{activeVideo.subtitle}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <ScrollArea className="h-[450px] w-full">
                <div className="space-y-4 pr-4">
                {videoData.map((video) => (
                    <Card
                    key={video.id}
                    className={`flex items-center gap-4 p-3 cursor-pointer transition-all hover:shadow-md hover:-translate-y-1 ${
                        activeVideo.id === video.id ? 'bg-primary/10 border-primary' : 'bg-secondary/50'
                    }`}
                    onClick={() => setActiveVideo(video)}
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
                        <p className="text-xs text-muted-foreground truncate">{video.subtitle}</p>
                        <span className="text-xs text-muted-foreground">{video.duration}</span>
                    </div>
                    <PlayCircle className={`h-6 w-6 flex-shrink-0 transition-colors ${activeVideo.id === video.id ? 'text-primary' : 'text-muted-foreground/50' }`} />
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
