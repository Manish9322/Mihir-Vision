import { PlaceHolderImages } from './placeholder-images';
import type { ImagePlaceholder } from './placeholder-images';

const getImage = (id: string): ImagePlaceholder => {
  const image = PlaceHolderImages.find((img) => img.id === id);
  if (!image) {
    return {
      id: 'placeholder',
      description: 'Placeholder Image',
      imageUrl: 'https://placehold.co/600x400',
      imageHint: 'placeholder',
    };
  }
  return image;
};

export const videoSectionData = {
    title: 'Explore Our Work',
    subheadline: 'A showcase of our latest projects, breakthroughs, and team stories. Click on any video to play.'
}

export type VideoInfo = {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  thumbnail: ImagePlaceholder;
  videoUrl: string;
};

export const videoData: VideoInfo[] = [
  {
    id: 'vid1',
    title: 'Project Apex Launch',
    subtitle: 'Highlights from our most ambitious project yet.',
    duration: '0:45',
    thumbnail: getImage('video-thumb-1'),
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  },
  {
    id: 'vid2',
    title: 'Innovation Roundtable',
    subtitle: 'Our leadership team discusses the future of tech.',
    duration: '0:58',
    thumbnail: getImage('video-thumb-2'),
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
  },
  {
    id: 'vid3',
    title: 'A Day in the Life',
    subtitle: 'Behind the scenes with our engineering team.',
    duration: '0:15',
    thumbnail: getImage('video-thumb-3'),
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
  },
  {
    id: 'vid4',
    title: 'The Genesis Idea',
    subtitle: 'Our founder shares the story of Pinnacle Pathways.',
    duration: '1:00',
    thumbnail: getImage('video-thumb-4'),
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
  },
    {
    id: 'vid5',
    title: 'Community Impact',
    subtitle: 'How our work is making a difference.',
    duration: '0:59',
    thumbnail: getImage('video-thumb-5'),
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'
  },
  {
    id: 'vid6',
    title: 'Future of AI',
    subtitle: 'A deep dive into our AI research and development.',
    duration: '0:12',
    thumbnail: getImage('video-thumb-6'),
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnAnAdventure.mp4'
  },
];
