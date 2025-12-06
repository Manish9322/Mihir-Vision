
import { Skeleton } from '@/components/ui/skeleton';

export default function VideoShowcaseSkeleton() {
  return (
    <section id="video-showcase" className="py-16 md:py-24 bg-background">
      <div className="container max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-12">
            <Skeleton className="h-10 w-3/4 mx-auto" />
            <div className="space-y-2 mt-4">
                <Skeleton className="h-5 w-full mx-auto" />
                <Skeleton className="h-5 w-5/6 mx-auto" />
            </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3 space-y-4">
                <Skeleton className="aspect-video w-full" />
                <div className="space-y-2">
                    <Skeleton className="h-8 w-1/2" />
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/4" />
                </div>
            </div>

            <div className="lg:col-span-2">
                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-1 gap-2">
                {[...Array(6)].map((_, index) => (
                    <div key={index}>
                        {/* Mobile view skeleton */}
                        <Skeleton className="lg:hidden aspect-video w-full rounded-md" />
                        
                        {/* Desktop view skeleton */}
                        <div className="hidden lg:flex items-center gap-4 p-3">
                            <Skeleton className="h-14 w-24 flex-shrink-0 rounded-md" />
                            <div className="flex-grow space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-3 w-1/3" />
                            </div>
                        </div>
                    </div>
                ))}
                </div>
            </div>
        </div>
      </div>
    </section>
  );
}
