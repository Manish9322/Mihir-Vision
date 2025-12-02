import { PlaceHolderImages } from './placeholder-images';
import type { ImagePlaceholder } from './placeholder-images';
import { BarChart3, Dna, Rocket, Users, Target, Lightbulb, Bot, Check } from 'lucide-react';

const getImage = (id: string): ImagePlaceholder => {
  const image = PlaceHolderImages.find((img) => img.id === id);
  if (!image) {
    return {
      id: 'placeholder',
      description: 'Placeholder Image',
      imageUrl: 'https://picsum.photos/seed/placeholder/600/400',
      imageHint: 'placeholder',
    };
  }
  return image;
};

export const heroData = {
  headline: 'Forging New Paths to the Pinnacle',
  subheadline: 'At Pinnacle Pathways, we pioneer solutions for the next generation of challenges. Explore our journey of innovation and discovery.',
  cta: 'Discover Our Mission',
  secondaryCta: 'Explore More',
  image: getImage('hero-background'),
  badges: ['Innovation', 'Excellence', 'Impact'],
  stats: [
    { value: '50+', label: 'Missions Completed' },
    { value: '10+', label: 'Active Programs' },
    { value: '5', label: 'Years of Experience' },
  ],
};

export const aboutData = {
  tagline: "Our Core Principles",
  title: 'Who We Are',
  paragraph1: 'Pinnacle Pathways was founded on the principle of relentless innovation. We are a collective of thinkers, creators, and pioneers dedicated to pushing the boundaries of what\'s possible. Our diverse team brings together expertise from various fields to tackle complex problems with creative and effective solutions.',
  paragraph2: 'Our journey is one of constant evolution, driven by a passion for discovery and a commitment to excellence. We believe in the power of collaboration and technology to build a better future, one breakthrough at a time.',
  image: getImage('about-image'),
  highlights: [
    "Commitment to groundbreaking research and development.",
    "Fostering a culture of collaboration and creativity.",
    "Delivering solutions that create tangible, real-world impact."
  ]
};

export const activitiesData = {
  title: 'What We Do',
  subheadline: 'Our work spans across several key areas of innovation, each aimed at creating a significant impact.',
  activities: [
    {
      icon: Rocket,
      title: 'Advanced Research',
      description: 'We invest in fundamental research to unlock new possibilities and lay the groundwork for future technologies.',
    },
    {
      icon: Dna,
      title: 'Technology Development',
      description: 'From concept to reality, we develop cutting-edge technologies that are robust, scalable, and ready for real-world application.',
    },
    {
      icon: Users,
      title: 'Strategic Partnerships',
      description: 'We collaborate with industry leaders and academic institutions to accelerate innovation and broaden our impact.',
    },
  ],
};

export const statsData = {
  title: 'Our Impact in Numbers',
  subheadline: 'We measure our success by the tangible impact we create. Here are some of our key achievements.',
  stats: [
    { label: 'Projects Completed', value: '150+' },
    { label: 'Patents Filed', value: '75' },
    { label: 'Team Members', value: '200' },
    { label: 'Global Partners', value: '40+' },
  ],
  chartData: [
    { year: '2020', projects: 40, patents: 24 },
    { year: '2021', projects: 30, patents: 13 },
    { year: '2022', projects: 50, patents: 35 },
    { year: '2023', projects: 60, patents: 42 },
    { year: '2024', projects: 80, patents: 55 },
  ],
};

export const futureMissionsData = {
  title: 'Future Missions',
  subheadline: 'Our eyes are always on the horizon. These are the next great challenges we aim to conquer.',
  missions: [
    {
      image: getImage('mission-1'),
      title: 'Project Nebula',
      description: 'Developing a decentralized global communication network to connect the unconnected.',
      tags: ['Connectivity', 'Decentralization'],
    },
    {
      image: getImage('mission-2'),
      title: 'Project Terra',
      description: 'Creating sustainable urban ecosystems using AI-driven resource management.',
      tags: ['Sustainability', 'AI', 'Smart Cities'],
    },
    {
      image: getImage('mission-3'),
      title: 'Project Chimera',
      description: 'Advancing personalized medicine through rapid genomic sequencing and analysis.',
      tags: ['Biotechnology', 'Healthcare'],
    },
  ],
};

export const timelineData = {
  title: 'Our DNA Timeline',
  subheadline: 'A look back at the key milestones that have shaped our journey and defined who we are today.',
  events: [
    {
      year: '2018',
      title: 'The Spark',
      description: 'Pinnacle Pathways was founded by a small group of innovators with a shared vision for the future.',
      icon: Lightbulb,
    },
    {
      year: '2020',
      title: 'First Breakthrough',
      description: 'Launched our first major project, revolutionizing data processing with a new proprietary algorithm.',
      icon: Target,
    },
    {
      year: '2022',
      title: 'Global Expansion',
      description: 'Opened our first international office and began forming strategic partnerships across the globe.',
      icon: Users,
    },
    {
      year: '2024',
      title: 'AI Integration',
      description: 'Successfully integrated our advanced AI platform across all core operations, boosting efficiency and innovation.',
      icon: Bot,
    },
  ],
};

export const footerData = {
  companyName: 'Pinnacle Pathways',
  quote: 'The best way to predict the future is to create it.',
  socials: [
    { name: 'X', url: '#' },
    { name: 'LinkedIn', url: '#' },
    { name: 'GitHub', url: '#' },
  ],
};
