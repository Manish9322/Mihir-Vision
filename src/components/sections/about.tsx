import Image from 'next/image';
import { aboutData } from '@/lib/data';
import { Check } from 'lucide-react';

export default function About() {
  return (
    <section id="about" className="py-16 md:py-24 bg-secondary">
      <div className="container max-w-7xl">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <div className="space-y-6">
            <p className="text-sm font-semibold text-primary uppercase tracking-wider">
              {aboutData.tagline}
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">
              {aboutData.title}
            </h2>
            <p className="text-muted-foreground text-lg">
              {aboutData.paragraph1}
            </p>
            <div className="space-y-4">
                {aboutData.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-start gap-3">
                        <div className="bg-primary/10 text-primary p-1.5 rounded-full mt-1">
                            <Check className="h-4 w-4" />
                        </div>
                        <p className="text-muted-foreground flex-1">{highlight}</p>
                    </div>
                ))}
            </div>
          </div>
          <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden border-2 border-border/10">
            <Image
              src={aboutData.image.imageUrl}
              alt={aboutData.image.description}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              data-ai-hint={aboutData.image.imageHint}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
