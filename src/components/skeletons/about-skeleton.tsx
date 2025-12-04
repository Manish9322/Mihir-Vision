import { Skeleton } from '@/components/ui/skeleton';
import { Check } from 'lucide-react';

export default function AboutSkeleton() {
  return (
    <section id="about" className="py-16 md:py-24 bg-secondary">
      <div className="container max-w-7xl">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <div className="space-y-6">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-10 w-3/4" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-5/6" />
            </div>
            <div className="space-y-4">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="bg-primary/10 text-primary p-1.5 rounded-full mt-1">
                    <Check className="h-4 w-4" />
                  </div>
                  <Skeleton className="h-5 w-full" />
                </div>
              ))}
            </div>
          </div>
          <div className="relative aspect-[4/3] w-full rounded-md overflow-hidden">
            <Skeleton className="h-full w-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
