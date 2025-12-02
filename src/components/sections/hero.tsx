import { heroData } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { ArrowRight, PlayCircle } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-[calc(100vh-3.5rem)] w-full overflow-hidden flex items-center justify-center py-16 md:py-24"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 to-transparent" />

      <div className="absolute -left-1/4 -top-1/4 h-1/2 w-1/2 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -bottom-1/4 -right-1/4 h-1/2 w-1/2 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative z-10 flex h-full items-center justify-center">
        <div className="container max-w-7xl px-4 text-center">
          <h1 className="animate-fade-in-up text-4xl font-extrabold tracking-tighter text-foreground sm:text-6xl md:text-7xl lg:text-8xl">
            {heroData.headline}
          </h1>
          <p className="animate-fade-in-up animation-delay-300 mx-auto mt-6 max-w-3xl text-lg text-foreground/70 md:text-xl">
            {heroData.subheadline}
          </p>

          <div className="animate-fade-in-up animation-delay-[450ms] mt-6 flex justify-center gap-2">
            {heroData.badges.map((badge) => (
              <Badge key={badge} variant="secondary" className="font-medium">
                {badge}
              </Badge>
            ))}
          </div>

          <div className="animate-fade-in-up animation-delay-600 mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="group rounded-full shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-primary/40 hover:scale-105 w-full sm:w-auto">
              <Link href="#about">
                {heroData.cta}
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
             <Button asChild size="lg" variant="ghost" className="group rounded-full transition-all duration-300 hover:bg-accent/80 w-full sm:w-auto">
              <Link href="#">
                <PlayCircle className="mr-2 h-5 w-5" />
                {heroData.secondaryCta}
              </Link>
            </Button>
          </div>
          
          <div className="animate-fade-in-up animation-delay-[900ms] mt-16 flex flex-wrap justify-center gap-8 text-foreground">
            {heroData.stats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center">
                <p className="text-3xl font-bold md:text-4xl">{stat.value}</p>
                <p className="text-sm text-foreground/60">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
