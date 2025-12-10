
'use client';

import { heroData } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Phone, Mail, Package, Gamepad2, UsersRound, Globe } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useGetHeroStatsQuery } from '@/services/api';
import PageViewTracker from '@/components/analytics/page-view-tracker';
import { Skeleton } from '../ui/skeleton';

const HeroStatsSkeleton = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
        {[...Array(4)].map((_, i) => (
            <Card key={i} className="flex flex-col items-center justify-center p-6 bg-primary/10 border-0 backdrop-blur-sm rounded-md">
                <Skeleton className="h-10 w-10 mb-3" />
                <Skeleton className="h-9 w-16 mb-1" />
                <Skeleton className="h-4 w-24" />
            </Card>
        ))}
    </div>
);

export default function Hero() {
  const { data: heroStats, isLoading } = useGetHeroStatsQuery(undefined);
  
  const phone = heroStats?.phone;
  const email = heroStats?.email;

  const dynamicStats = [
    { label: 'Projects Completed', value: heroStats?.projectsCount, icon: Package },
    { label: 'Total Games', value: heroStats?.gamesCount, icon: Gamepad2 },
    { label: 'Team Members', value: heroStats?.teamCount, icon: UsersRound },
    { label: 'Global Partners', value: heroStats?.clientsCount, icon: Globe },
  ];


  return (
    <section
      id="hero"
      className="relative w-full overflow-hidden flex items-center justify-center pt-16 md:pt-24 bg-background"
    >
      <PageViewTracker pageName="Home" />

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
              <a href={`tel:${phone}`}>
                <Phone className="mr-2 h-5 w-5" />
                {isLoading ? <Skeleton className="h-5 w-32" /> : phone}
              </a>
            </Button>
             <Button asChild size="lg" variant="ghost" className="group rounded-full transition-all duration-300 hover:bg-accent/80 w-full sm:w-auto">
              <a href={`mailto:${email}`}>
                <Mail className="mr-2 h-5 w-5" />
                {isLoading ? <Skeleton className="h-5 w-40" /> : 'Email Us'}
              </a>
            </Button>
          </div>
        </div>

        <div className="container max-w-7xl mt-12 md:mt-16 pb-16 md:pb-24">
            {isLoading ? <HeroStatsSkeleton /> : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                {dynamicStats.map((stat) => (
                    <Card key={stat.label} className="flex flex-col items-center justify-center p-6 bg-primary/10 border-0 backdrop-blur-sm rounded-md">
                        <stat.icon className="h-10 w-10 text-primary mb-3" />
                        <p className="text-3xl md:text-4xl font-bold text-foreground">{stat.value}</p>
                        <p className="text-sm text-muted-foreground mt-1 text-center">{stat.label}</p>
                    </Card>
                ))}
                </div>
            )}
        </div>
      </div>
    </section>
  );
}
