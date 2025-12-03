import { PlaceHolderImages } from './placeholder-images';
import type { ImagePlaceholder } from './placeholder-images';
import { BarChart3, Dna, Rocket, Users, Target, Lightbulb, Bot, Check, Package, Award, UsersRound, Globe, Activity, DollarSign, BookOpen, Mail } from 'lucide-react';

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

export const heroData = {
  headline: 'Forging New Paths to the Pinnacle',
  subheadline: 'At Pinnacle Pathways, we pioneer solutions for the next generation of challenges. Explore our journey of innovation and discovery.',
  cta: 'Discover Our Mission',
  secondaryCta: 'Explore More',
  image: getImage('hero-background'),
  badges: ['Innovation', 'Excellence', 'Impact'],
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
    { label: 'Projects Completed', value: '150+', icon: Package },
    { label: 'Patents Filed', value: '75', icon: Award },
    { label: 'Team Members', value: '200', icon: UsersRound },
    { label: 'Global Partners', value: '40+', icon: Globe },
  ],
};

export const growthChartData = {
  title: 'Our Trajectory of Innovation',
  subheadline: 'The chart below illustrates our consistent growth in key areas of innovation, reflecting our commitment to pushing boundaries and achieving new milestones.',
  chartTitle: 'Projects & Patents',
  chartSubheadline: 'Projects and patents filed over the years',
  chartData: [
    { year: '2020', projects: 40, patents: 24, investment: 10 },
    { year: '2021', projects: 30, patents: 13, investment: 15 },
    { year: '2022', projects: 50, patents: 35, investment: 25 },
    { year: '2023', projects: 60, patents: 42, investment: 30 },
    { year: '2024', projects: 80, patents: 55, investment: 40 },
  ],
};


export const futureMissionsData = {
  title: 'Featured Projects',
  subheadline: 'A showcase of the innovative solutions we\'ve delivered for our clients.',
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

export const galleryData = {
    title: 'Screenshot Gallery',
    subheadline: 'A glimpse into the worlds we are creating. Explore a selection of screenshots from our flagship projects.',
    images: [
        getImage('gallery-1'),
        getImage('gallery-2'),
        getImage('gallery-3'),
        getImage('gallery-4'),
        getImage('gallery-5'),
        getImage('gallery-6'),
    ]
}

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

export const faqData = {
    title: 'Frequently Asked Questions',
    subheadline: 'Find answers to common questions about our work, mission, and partnerships.',
    faqs: [
        {
            question: 'What is the primary focus of Pinnacle Pathways?',
            answer: 'Our primary focus is on pioneering solutions for next-generation challenges through advanced research, technology development, and strategic partnerships. We aim to create a significant impact in areas like connectivity, sustainability, and healthcare.'
        },
        {
            question: 'How can my organization partner with you?',
            answer: 'We are always open to collaborating with organizations that share our vision. Please reach out to us via our contact form with your proposal, and our partnerships team will get back to you to discuss potential synergies.'
        },
        {
            question: 'Are you currently hiring?',
            answer: 'We are constantly looking for talented individuals to join our team. Please visit our careers page for open positions and information on how to apply. We look for passionate innovators from diverse backgrounds.'
        },
        {
            question: 'What are some of your key technological achievements?',
            answer: 'One of our key achievements was the development of a proprietary algorithm that revolutionized data processing. We have also made significant strides in AI integration and are leading research in decentralized communication networks.'
        },
    ]
}

export const contactData = {
  title: 'Get In Touch',
  subheadline: 'Have a question or want to work together? Drop us a line. We’d love to hear from you.'
};

export const contactsData = {
  messages: [
    {
      id: '1',
      name: 'Olivia Martin',
      email: 'olivia.martin@email.com',
      message: 'Interested in learning more about Project Nebula. Can we schedule a call?',
      date: '2023-06-23',
      status: 'New'
    },
    {
      id: '2',
      name: 'Liam Anderson',
      email: 'liam.anderson@email.com',
      message: 'Great work on the AI integration! We have a potential partnership opportunity.',
      date: '2023-06-22',
      status: 'Replied'
    },
    {
      id: '3',
      name: 'Sophia Davis',
      email: 'sophia.davis@email.com',
      message: 'Question about your strategic partnerships program. Who is the best point of contact?',
      date: '2023-06-21',
      status: 'New'
    },
    {
      id: '4',
      name: 'Noah Wilson',
      email: 'noah.wilson@example.com',
      message: 'Inquiry about career opportunities.',
      date: '2023-06-20',
      status: 'Replied',
    },
    {
      id: '5',
      name: 'Emma Garcia',
      email: 'emma.garcia@example.com',
      message: 'Following up on our conversation from last week.',
      date: '2023-06-19',
      status: 'New',
    },
  ]
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

export const dashboardData = {
  stats: [
    {
      title: 'Total Visitors',
      value: '45,231',
      change: '+20.1%',
      icon: Users,
    },
    {
      title: 'New Messages',
      value: '+2,350',
      change: '+180.1%',
      icon: Mail,
    },
    {
      title: 'Active Projects',
      value: '12',
      change: '+19% from last month',
      icon: BookOpen,
    },
    {
      title: 'R&D Spend',
      value: '$5.2M',
      change: '+3.5%',
      icon: DollarSign,
    },
  ],
  activities: [
    {
      user: 'Admin User',
      action: 'updated the About section.',
      timestamp: '2 hours ago',
    },
    {
      user: 'Admin User',
      action: 'added a new mission to Future Missions.',
      timestamp: '6 hours ago',
    },
    {
      user: 'Admin User',
      action: 'replied to a contact message from Sophia Davis.',
      timestamp: '1 day ago',
    },
     {
      user: 'Admin User',
      action: 'updated the DNA Timeline with a new event.',
      timestamp: '2 days ago',
    },
     {
      user: 'Admin User',
      action: 'added a new image to the gallery.',
      timestamp: '3 days ago',
    },
    {
      user: 'Admin User',
      action: 'updated general site settings.',
      timestamp: '4 days ago',
    },
  ]
}
