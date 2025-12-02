import Image from 'next/image';
import { aboutData } from '@/lib/data';

export default function About() {
  return (
    <section id="about" className="py-16 md:py-24 bg-secondary">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">
              {aboutData.title}
            </h2>
            <p className="text-muted-foreground text-lg">
              {aboutData.paragraph1}
            </p>
            <p className="text-muted-foreground text-lg">
              {aboutData.paragraph2}
            </p>
          </div>
          <div className="relative h-80 md:h-full w-full rounded-lg overflow-hidden shadow-lg">
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
