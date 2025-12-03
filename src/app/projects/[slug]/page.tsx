import { notFound } from 'next/navigation';
import Image from 'next/image';
import { futureMissionsData } from '@/lib/data';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function generateStaticParams() {
  return futureMissionsData.missions.map((mission) => ({
    slug: mission.slug,
  }));
}

export default function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const mission = futureMissionsData.missions.find(m => m.slug === params.slug);

  if (!mission) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-16 md:py-24">
        <div className="container max-w-4xl">
            <Button asChild variant="ghost" className="mb-8">
                <Link href="/#projects">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Projects
                </Link>
            </Button>
          <div className="relative aspect-video w-full rounded-xl overflow-hidden mb-8 border">
            <Image
              src={mission.image.imageUrl}
              alt={mission.image.description}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-headline mb-4">{mission.title}</h1>
          <div className="flex flex-wrap gap-2 mb-6">
            {mission.tags.map(tag => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
          </div>
          <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground">
            <p>{mission.description}</p>
            {/* You can add more detailed content here */}
             <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
             <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
