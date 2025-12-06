
import Header from '@/components/layout/header';
import Hero from '@/components/sections/hero';
import VideoShowcase from '@/components/sections/video-showcase';
import About from '@/components/sections/about';
import ClientsMarquee from '@/components/sections/clients-marquee';
import Activities from '@/components/sections/activities';
import GrowthChart from '@/components/sections/growth-chart';
import FeaturedProjects from '@/components/sections/featured-projects';
import Gallery from '@/components/sections/gallery';
import Timeline from '@/components/sections/timeline';
import Faq from '@/components/sections/faq';
import Contact from '@/components/sections/contact';
import { Suspense } from 'react';
import AboutSkeleton from '@/components/skeletons/about-skeleton';
import ClientsMarqueeSkeleton from '@/components/skeletons/clients-marquee-skeleton';
import Footer from '@/components/layout/footer';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Hero />
        <Suspense fallback={<AboutSkeleton />}>
          <About />
        </Suspense>
        <Suspense fallback={<ClientsMarqueeSkeleton />}>
            <ClientsMarquee />
        </Suspense>
        <Activities />
        <GrowthChart />
        <VideoShowcase />
        <Gallery />
        <FeaturedProjects />
        <Timeline />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
