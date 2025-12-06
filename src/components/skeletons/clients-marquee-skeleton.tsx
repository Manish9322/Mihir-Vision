
import { Skeleton } from '@/components/ui/skeleton';

export default function ClientsMarqueeSkeleton() {
  return (
    <section id="clients" className="py-12 md:py-16 bg-background border-y">
      <div className="container max-w-7xl">
        <div className="text-center mb-8">
            <Skeleton className="h-5 w-64 mx-auto" />
        </div>
        <div className="relative overflow-hidden">
            <div className="flex">
                {[...Array(6)].map((_, index) => (
                    <div key={index} className="flex-shrink-0 w-48 h-20 mx-6 flex items-center justify-center">
                        <Skeleton className="w-[150px] h-[50px]" />
                    </div>
                ))}
            </div>
        </div>
      </div>
    </section>
  );
}
