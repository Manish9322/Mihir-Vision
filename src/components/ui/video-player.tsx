'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  RefreshCcw,
  Loader2,
} from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { VideoInfo } from '@/lib/video-data';

interface VideoPlayerProps {
  video: VideoInfo;
  isLoading: boolean;
}

export function VideoPlayer({ video, isLoading }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    setIsPlaying(false);
    setIsFinished(false);
    setProgress(0);
  }, [video]);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleTimeUpdate = () => {
      setProgress(videoElement.currentTime);
    };
    const handleDurationChange = () => {
      setDuration(videoElement.duration);
    };
    const handleVideoEnd = () => {
      setIsPlaying(false);
      setIsFinished(true);
    };
    
    const handleFullscreenChange = () => {
      if (document) {
        setIsFullscreen(!!document.fullscreenElement);
      }
    };


    videoElement.addEventListener('timeupdate', handleTimeUpdate);
    videoElement.addEventListener('durationchange', handleDurationChange);
    videoElement.addEventListener('ended', handleVideoEnd);
    if (document) {
        document.addEventListener('fullscreenchange', handleFullscreenChange);
    }


    return () => {
      videoElement.removeEventListener('timeupdate', handleTimeUpdate);
      videoElement.removeEventListener('durationchange', handleDurationChange);
      videoElement.removeEventListener('ended', handleVideoEnd);
      if (document) {
        document.removeEventListener('fullscreenchange', handleFullscreenChange);
      }
    };
  }, []);

  const togglePlay = () => {
    const videoElement = videoRef.current;
    if (videoElement) {
      if (isPlaying) {
        videoElement.pause();
      } else {
        if (isFinished) {
          videoElement.currentTime = 0;
          setIsFinished(false);
        }
        videoElement.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.muted = !isMuted;
      setIsMuted(!isMuted);
      if (!isMuted && videoElement.volume === 0) {
        videoElement.volume = 1;
        setVolume(1);
      }
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.volume = newVolume;
      setVolume(newVolume);
      if (newVolume > 0 && isMuted) {
        videoElement.muted = false;
        setIsMuted(false);
      }
    }
  };

  const handleSeek = (value: number[]) => {
    const seekTime = value[0];
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.currentTime = seekTime;
      setProgress(seekTime);
      if (isFinished) {
        setIsFinished(false);
        setIsPlaying(true);
        videoElement.play();
      }
    }
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (container) {
      if (!document.fullscreenElement) {
        container.requestFullscreen().catch((err) => {
          console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
        });
      } else {
        document.exitFullscreen();
      }
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time) || time < 0) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <Card ref={containerRef} className="overflow-hidden border-0 relative w-full group/player bg-black">
      <CardContent className="p-0">
        <div className="relative aspect-video w-full">
          <video
            ref={videoRef}
            src={video.videoUrl}
            className="w-full h-full"
            poster={video.thumbnail.imageUrl}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onClick={togglePlay}
          />

          {(isLoading || !isPlaying) && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center pointer-events-none">
              {isLoading ? (
                <Loader2 className="h-16 w-16 text-white/80 animate-spin" />
              ) : isFinished ? (
                 <Button variant="ghost" size="icon" className="h-28 w-28 text-white/80 hover:text-white pointer-events-auto" onClick={togglePlay}>
                    <RefreshCcw className="h-20 w-20" />
                </Button>
              ) : (
                <Button size="icon" className="h-28 w-28 rounded-full bg-primary/80 dark:bg-transparent text-primary-foreground dark:text-white/80 hover:bg-primary dark:hover:text-white pointer-events-auto" onClick={togglePlay}>
                    <Play className="h-24 w-24 fill-current" />
                </Button>
              )}
            </div>
          )}

          <div
            className={cn(
              "absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent transition-opacity duration-300",
              "opacity-0 group-hover/player:opacity-100",
              isPlaying && "group-focus-within/player:opacity-100"
            )}
          >
            <div className="flex items-center gap-4 text-white">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/20" onClick={togglePlay}>
                {isPlaying ? <Pause /> : <Play />}
              </Button>

              <div className="text-xs font-mono">
                {formatTime(progress)} / {formatTime(duration)}
              </div>
              
              <Slider
                value={[progress]}
                max={duration || 1}
                step={1}
                onValueChange={handleSeek}
                className="flex-1"
              />

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/20" onClick={toggleMute}>
                  {isMuted || volume === 0 ? <VolumeX /> : <Volume2 />}
                </Button>
                <Slider
                  value={[volume]}
                  max={1}
                  step={0.1}
                  onValueChange={handleVolumeChange}
                  className="w-24"
                />
              </div>

              <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/20" onClick={toggleFullscreen}>
                {isFullscreen ? <Minimize /> : <Maximize />}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
