
'use client';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useGetFaqDataQuery } from '@/services/api';
import FaqSkeleton from '../skeletons/faq-skeleton';

const faqSectionData = {
    title: 'Frequently Asked Questions',
    subheadline: 'Find answers to common questions about our work, mission, and partnerships.',
};

export default function Faq() {
  const { data: allFaqs, isLoading, isError } = useGetFaqDataQuery(undefined);

  if (isLoading) {
    return <FaqSkeleton />;
  }

  const faqs = allFaqs?.filter((faq: any) => faq.isVisible) || [];

  if (isError || !faqs || faqs.length === 0) {
    return null;
  }
  
  return (
    <section id="faq" className="py-16 md:py-24 bg-secondary">
      <div className="container max-w-4xl">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">
            {faqSectionData.title}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {faqSectionData.subheadline}
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={faq._id || index} value={`item-${index}`}>
              <AccordionTrigger className="text-left text-lg font-semibold hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pt-2">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
