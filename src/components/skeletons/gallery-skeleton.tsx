
import { Skeleton } from '@/components/ui/skeleton';

export default function GallerySkeleton() {
  return (
    <section id="gallery" className="py-16 md:py-24 bg-secondary">
        <div className="container max-w-7xl">
            <div className="text-center max-w-3xl mx-auto mb-12">
                <Skeleton className="h-10 w-3/4 mx-auto" />
                <div className="space-y-2 mt-4">
                    <Skeleton className="h-5 w-full mx-auto" />
                    <Skeleton className="h-5 w-5/6 mx-auto" />
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {[...Array(6)].map((_, index) => (
                    <Skeleton key={index} className="aspect-video w-full rounded-md" />
                ))}
            </div>
        </div>
    </section>
  );
}
