
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

type Project = {
    _id?: string;
    image: {
      imageUrl: string;
      description: string;
    };
    title: string;
    slug: string;
    description: string;
    details: string;
    tags: string[];
};

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

async function getProjects(): Promise<Project[] | null> {
  try {
    // Use relative URL for API calls within the same deployment
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:9002';
    const res = await fetch(`${baseUrl}/api/projects`, { 
      cache: 'no-store',
      next: { revalidate: 0 }
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    return null;
  }
}

export default async function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const projects = await getProjects();
  const mission = projects?.find(m => m.slug === params.slug);

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
          <div className="relative aspect-video w-full rounded-md overflow-hidden mb-8 border">
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
            <p>{mission.details}</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
