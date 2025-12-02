import Header from '@/components/layout/header';
import Hero from '@/components/sections/hero';
import About from '@/components/sections/about';
import Activities from '@/components/sections/activities';
import GrowthChart from '@/components/sections/growth-chart';
import FutureMissions from '@/components/sections/future-missions';
import Timeline from '@/components/sections/timeline';
import Contact from '@/components/sections/contact';
import Footer from '@/components/layout/footer';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Hero />
        <About />
        <Activities />
        <GrowthChart />
        <FutureMissions />
        <Timeline />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
