
import { Skeleton } from '@/components/ui/skeleton';

export default function FeaturedProjectsSkeleton() {
  return (
    <section id="projects" className="py-16 md:py-24 bg-background">
      <div className="container max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-12">
            <Skeleton className="h-10 w-3/4 mx-auto" />
            <div className="space-y-2 mt-4">
                <Skeleton className="h-5 w-full mx-auto" />
                <Skeleton className="h-5 w-5/6 mx-auto" />
            </div>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="rounded-md border bg-card p-4 space-y-4">
                <Skeleton className="aspect-video w-full" />
                <div className="space-y-2">
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-5/6" />
                </div>
                <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-6 w-24 rounded-full" />
                </div>
                <Skeleton className="h-5 w-28" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
