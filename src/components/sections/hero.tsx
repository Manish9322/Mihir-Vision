import { heroData } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
  return (
    <section id="hero" className="relative h-[calc(80vh-3.5rem)] w-full bg-primary text-primary-foreground">
      <div className="relative z-10 flex h-full items-center justify-center">
        <div className="container text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl font-headline animate-fade-in-up">
            {heroData.headline}
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg md:text-xl text-primary-foreground/80 animate-fade-in-up animation-delay-300">
            {heroData.subheadline}
          </p>
          <div className="mt-10 animate-fade-in-up animation-delay-600">
            <Button asChild size="lg" variant="secondary">
              <Link href="#about">
                {heroData.cta}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
