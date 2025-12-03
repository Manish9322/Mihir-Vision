import { heroData, statsData } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Phone, Mail } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative w-full overflow-hidden flex items-center justify-center pt-16 md:pt-24"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 to-transparent" />

      <div className="absolute -left-1/4 -top-1/4 h-1/2 w-1/2 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -bottom-1/4 -right-1/4 h-1/2 w-1/2 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center">
        <div className="container px-4 text-center mt-0 sm:mt-0">
          <h1 className="animate-fade-in-up text-4xl font-extrabold tracking-tighter text-foreground sm:text-5xl lg:text-6xl/none">
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
            <Button asChild size="lg" className="group rounded-full shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-primary/40 hover:scale-102 w-full sm:w-auto">
              <a href="tel:+15551234567">
                <Phone className="mr-2 h-5 w-5" />
                +1 (555) 123-4567
              </a>
            </Button>
             <Button asChild size="lg" variant="ghost" className="group rounded-full transition-all duration-300 hover:bg-accent/80 w-full sm:w-auto">
              <a href="mailto:contact@pinnaclepathways.com">
                <Mail className="mr-2 h-5 w-5" />
                Email Us
              </a>
            </Button>
          </div>
        </div>

        <div className="container max-w-7xl mt-12 md:mt-16 pb-16 md:pb-24">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {statsData.stats.map((stat) => (
                <Card key={stat.label} className="flex flex-col items-center justify-center p-6 bg-background/30 border-0 backdrop-blur-sm">
                    <stat.icon className="h-10 w-10 text-primary mb-3" />
                    <p className="text-3xl md:text-4xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                </Card>
            ))}
            </div>
        </div>
      </div>
    </section>
  );
}
