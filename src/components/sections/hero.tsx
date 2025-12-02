import Image from 'next/image';
import { heroData } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
  return (
    <section id="hero" className="relative h-[calc(100vh-3.5rem)] w-full">
      <Image
        src={heroData.image.imageUrl}
        alt={heroData.image.description}
        fill
        className="object-cover"
        priority
        data-ai-hint={heroData.image.imageHint}
      />
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 flex h-full items-center justify-center">
        <div className="container text-center text-primary-foreground">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl font-headline animate-fade-in-up">
            {heroData.headline}
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg md:text-xl animate-fade-in-up animation-delay-300">
            {heroData.subheadline}
          </p>
          <div className="mt-10 animate-fade-in-up animation-delay-600">
            <Button asChild size="lg">
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
