
import { Skeleton } from '@/components/ui/skeleton';

export default function TimelineSkeleton() {
  return (
    <section id="timeline" className="py-16 md:py-24 bg-secondary">
      <div className="container max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
            <Skeleton className="h-10 w-3/4 mx-auto" />
            <div className="space-y-2 mt-4">
                <Skeleton className="h-5 w-full mx-auto" />
                <Skeleton className="h-5 w-5/6 mx-auto" />
            </div>
        </div>

        <div className="relative">
          <div className="absolute left-4 top-0 h-full w-0.5 bg-border lg:left-1/2 lg:-translate-x-1/2" aria-hidden="true" />
            {[...Array(4)].map((_, index) => (
              <div key={index} className="relative mb-12 lg:flex lg:items-center">
                <div
                  className={`w-full lg:w-1/2 ${
                    index % 2 === 0 ? 'lg:pr-8' : 'lg:pl-8 lg:order-2'
                  }`}
                >
                  <div className="pl-12 lg:pl-0">
                    <div className="p-6 rounded-md bg-card space-y-3">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-6 w-1/2" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute left-4 top-1/2 -translate-x-1/2 -translate-y-1/2 lg:left-1/2 lg:order-1">
                    <Skeleton className="h-10 w-10 rounded-full" />
                </div>
                <div className="hidden lg:block lg:w-1/2"></div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}
