
import { Skeleton } from '@/components/ui/skeleton';

export default function GrowthChartSkeleton() {
  return (
    <section id="growth" className="py-16 md:py-24 bg-secondary">
      <div className="container max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-12">
            <Skeleton className="h-10 w-3/4 mx-auto" />
            <div className="space-y-2 mt-4">
              <Skeleton className="h-5 w-full mx-auto" />
              <Skeleton className="h-5 w-5/6 mx-auto" />
            </div>
        </div>

        <div className="flex justify-center mb-8">
            <Skeleton className="h-10 w-[300px]" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="rounded-md border bg-card p-6 space-y-4">
                <div className="space-y-2">
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-4 w-3/4" />
                </div>
                <Skeleton className="h-[250px] md:h-[300px] w-full" />
            </div>
            <div className="rounded-md border bg-card p-6 space-y-4">
                <div className="space-y-2">
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-4 w-3/4" />
                </div>
                <Skeleton className="h-[250px] md:h-[300px] w-full" />
            </div>
        </div>
      </div>
    </section>
  );
}
