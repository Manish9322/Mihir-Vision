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

export type VideoInfo = {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  thumbnail: ImagePlaceholder;
};

export const videoData: VideoInfo[] = [
  {
    id: 'vid1',
    title: 'Project Apex Launch',
    subtitle: 'Highlights from our most ambitious project yet.',
    duration: '2:35',
    thumbnail: getImage('video-thumb-1'),
  },
  {
    id: 'vid2',
    title: 'Innovation Roundtable',
    subtitle: 'Our leadership team discusses the future of tech.',
    duration: '15:42',
    thumbnail: getImage('video-thumb-2'),
  },
  {
    id: 'vid3',
    title: 'A Day in the Life',
    subtitle: 'Behind the scenes with our engineering team.',
    duration: '5:18',
    thumbnail: getImage('video-thumb-3'),
  },
  {
    id: 'vid4',
    title: 'The Genesis Idea',
    subtitle: 'Our founder shares the story of Pinnacle Pathways.',
    duration: '8:55',
    thumbnail: getImage('video-thumb-4'),
  },
    {
    id: 'vid5',
    title: 'Community Impact',
    subtitle: 'How our work is making a difference.',
    duration: '4:02',
    thumbnail: getImage('video-thumb-5'),
  },
  {
    id: 'vid6',
    title: 'Future of AI',
    subtitle: 'A deep dive into our AI research and development.',
    duration: '12:30',
    thumbnail: getImage('video-thumb-6'),
  },
];