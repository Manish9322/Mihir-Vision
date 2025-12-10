
'use client';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useGetActivitiesDataQuery } from '@/services/api';
import { Rocket, Dna, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import ActivitiesSkeleton from '../skeletons/activities-skeleton';

const iconMap: { [key: string]: LucideIcon } = {
    Rocket: Rocket,
    Dna: Dna,
    Users: Users,
};

export default function Activities() {
  const { data: activities, isLoading, isError } = useGetActivitiesDataQuery(undefined);

  if (isLoading) {
    return <ActivitiesSkeleton />;
  }

  const visibleActivities = activities?.filter((a: any) => a.isVisible) || [];

  if (isError || !visibleActivities || visibleActivities.length === 0) {
    return null;
  }

  const activitiesData = {
    title: 'What We Do',
    subheadline: 'Our work spans across several key areas of innovation, each aimed at creating a significant impact.',
  };
  
  return (
    <section id="activities" className="py-16 md:py-24 bg-background">
      <div className="container max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">
            {activitiesData.title}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {activitiesData.subheadline}
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {visibleActivities.map((activity: any) => {
            const Icon = iconMap[activity.icon] || Rocket;
            return (
              <Card
                key={activity.title}
                className="relative group overflow-hidden rounded-md p-6 text-center bg-card transition-all duration-300 ease-in-out hover:-translate-y-2"
              >
                <div
                  className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  aria-hidden="true"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent"
                  aria-hidden="true"
                />
                <div className="relative z-10 flex flex-col items-center h-full">
                  <CardHeader className="p-0">
                    <div className="mx-auto bg-primary/10 text-primary rounded-full h-20 w-20 flex items-center justify-center mb-6 shadow-inner ring-1 ring-primary/20">
                      <Icon className="h-10 w-10" />
                    </div>
                    <CardTitle className="font-headline text-2xl mb-2">{activity.title}</CardTitle>
                    <CardDescription className="text-base text-muted-foreground/80 leading-relaxed">
                      {activity.description}
                    </CardDescription>
                  </CardHeader>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
