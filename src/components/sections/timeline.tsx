'use server';

import { MONGODB_URI } from '@/config/config';
import { Lightbulb, Target, Users, Bot } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type TimelineEvent = {
    _id?: string;
    year: string;
    title: string;
    description: string;
    icon: string;
    isVisible: boolean;
};

const iconMap: { [key: string]: LucideIcon } = {
    Lightbulb: Lightbulb,
    Target: Target,
    Users: Users,
    Bot: Bot,
};

async function getTimelineData(): Promise<TimelineEvent[] | null> {
    if (!MONGODB_URI) {
        console.error('MongoDB URI is not configured, skipping fetch for Timeline section.');
        return null;
    }

    try {
        const baseUrl = process.env.NODE_ENV === 'production'
            ? `https://` + process.env.NEXT_PUBLIC_VERCEL_URL
            : 'http://localhost:9002';
        
        const res = await fetch(`${baseUrl}/api/timeline`, { cache: 'no-store' });

        if (!res.ok) {
            console.error(`Failed to fetch timeline data: ${res.status} ${res.statusText}`);
            return null;
        }

        const data = await res.json();
        return data;
    } catch (error) {
        console.error('An error occurred while fetching timeline data:', error);
        return null;
    }
}

export default async function Timeline() {
    const timelineEvents = await getTimelineData();
    const visibleEvents = timelineEvents?.filter(event => event.isVisible) || [];

    const timelineData = {
        title: 'Our DNA Timeline',
        subheadline: 'A look back at the key milestones that have shaped our journey and defined who we are today.',
    };

    if (!visibleEvents || visibleEvents.length === 0) {
        return null;
    }

  return (
    <section id="timeline" className="py-16 md:py-24 bg-secondary">
      <div className="container max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">
            {timelineData.title}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {timelineData.subheadline}
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-4 top-0 h-full w-0.5 bg-border dark:bg-primary/50 lg:left-1/2 lg:-translate-x-1/2" aria-hidden="true" />

          {visibleEvents.map((event, index) => {
            const Icon = iconMap[event.icon] || Lightbulb;
            return (
              <div key={event._id || event.year} className="relative mb-12 lg:flex lg:items-center">
                <div
                  className={`w-full lg:w-1/2 ${
                    index % 2 === 0 ? 'lg:pr-8 lg:text-right' : 'lg:pl-8 lg:order-2'
                  }`}
                >
                  <div className="pl-12 lg:pl-0 lg:text-inherit">
                    <div className="p-6 rounded-lg bg-card shadow-md">
                      <p className="text-sm font-semibold text-primary">{event.year}</p>
                      <h3 className="mt-1 text-xl font-bold font-headline">{event.title}</h3>
                      <p className="mt-2 text-muted-foreground">{event.description}</p>
                    </div>
                  </div>
                </div>
                
                <div className="absolute left-4 top-1/2 -translate-x-1/2 -translate-y-1/2 lg:left-1/2 lg:order-1">
                  <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center ring-8 ring-secondary">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>

                {/* Empty div for spacing on the other side */}
                <div className="hidden lg:block lg:w-1/2"></div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  );
}
