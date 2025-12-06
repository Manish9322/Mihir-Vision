
'use server';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '../ui/button';
import { ArrowRight } from 'lucide-react';
import { MONGODB_URI } from '@/config/config';
import type { ImagePlaceholder } from '@/lib/placeholder-images';

type Project = {
    _id?: string;
    image: ImagePlaceholder;
    title: string;
    slug: string;
    description: string;
    details: string;
    tags: string[];
    isVisible: boolean;
};

const futureMissionsData = {
  title: 'Featured Projects',
  subheadline: "A showcase of the innovative solutions we've delivered for our clients.",
};

async function getProjectsData(): Promise<Project[] | null> {
  if (!MONGODB_URI) {
    console.error('MongoDB URI is not configured, skipping fetch for Projects section.');
    return null;
  }

  try {
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? `https://` + process.env.NEXT_PUBLIC_VERCEL_URL
      : 'http://localhost:9002';
      
    const res = await fetch(`${baseUrl}/api/projects`, { cache: 'no-store' });

    if (!res.ok) {
      console.error(`Failed to fetch projects data: ${res.status} ${res.statusText}`);
      return null;
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('An error occurred while fetching projects data:', error);
    return null;
  }
}

export default async function FeaturedProjects() {
  const projects = await getProjectsData();
  
  const visibleProjects = projects?.filter(p => p.isVisible) || [];

  if (!visibleProjects || visibleProjects.length === 0) {
    return null;
  }

  return (
    <section id="projects" className="py-16 md:py-24 bg-background">
      <div className="container max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">
            {futureMissionsData.title}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {futureMissionsData.subheadline}
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {visibleProjects.map((mission) => (
            <Card key={mission.title} className="group overflow-hidden flex flex-col transition-all duration-300 ease-in-out hover:scale-[1.02] hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/10 rounded-md">
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={mission.image.imageUrl}
                  alt={mission.image.description}
                  fill
                  className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  data-ai-hint={mission.image.imageHint}
                />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
              <CardHeader>
                <CardTitle className="font-headline">{mission.title}</CardTitle>
                <CardDescription>{mission.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col justify-between">
                <div>
                    <div className="flex flex-wrap gap-2 mb-4">
                    {mission.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                        {tag}
                        </Badge>
                    ))}
                    </div>
                </div>
                <Button asChild variant="link" className="p-0 h-auto self-start group/link">
                  <Link href={`/projects/${mission.slug}`}>
                    Learn More <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 ease-in-out group-hover/link:translate-x-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
