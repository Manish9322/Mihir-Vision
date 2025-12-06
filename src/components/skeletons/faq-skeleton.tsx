
import { Skeleton } from '@/components/ui/skeleton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function FaqSkeleton() {
  return (
    <section id="faq" className="py-16 md:py-24 bg-secondary">
      <div className="container max-w-4xl">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Skeleton className="h-10 w-3/4 mx-auto" />
          <div className="space-y-2 mt-4">
            <Skeleton className="h-5 w-full mx-auto" />
            <Skeleton className="h-5 w-5/6 mx-auto" />
          </div>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {[...Array(4)].map((_, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-b">
              <AccordionTrigger className="py-4 text-left text-lg font-semibold hover:no-underline">
                <Skeleton className="h-6 w-3/4" />
              </AccordionTrigger>
              <AccordionContent className="pb-4 pt-0">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
