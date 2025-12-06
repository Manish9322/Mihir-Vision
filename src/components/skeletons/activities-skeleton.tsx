
import { Skeleton } from '@/components/ui/skeleton';

export default function ActivitiesSkeleton() {
  return (
    <section id="activities" className="py-16 md:py-24 bg-background">
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
            <div key={index} className="flex flex-col items-center text-center p-6">
                <Skeleton className="h-20 w-20 rounded-full mb-6" />
                <Skeleton className="h-8 w-1/2 mb-4" />
                <div className="space-y-2">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-5/6" />
                </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
