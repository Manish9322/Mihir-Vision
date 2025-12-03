import Image from 'next/image';
import { futureMissionsData } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '../ui/button';
import { ArrowRight } from 'lucide-react';

export default function FutureMissions() {
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
          {futureMissionsData.missions.map((mission) => (
            <Card key={mission.title} className="overflow-hidden flex flex-col">
              <div className="relative h-48 w-full">
                <Image
                  src={mission.image.imageUrl}
                  alt={mission.image.description}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  data-ai-hint={mission.image.imageHint}
                />
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
                <Button variant="link" className="p-0 h-auto self-start">
                  Learn More <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
