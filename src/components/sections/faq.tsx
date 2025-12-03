'use server';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { MONGODB_URI } from '@/config/config';

type FAQ = {
    _id?: string;
    question: string;
    answer: string;
};

const faqSectionData = {
    title: 'Frequently Asked Questions',
    subheadline: 'Find answers to common questions about our work, mission, and partnerships.',
};

async function getFaqData(): Promise<FAQ[] | null> {
    if (!MONGODB_URI) {
        console.error('MongoDB URI is not configured, skipping fetch for FAQ section.');
        return null;
    }

    try {
        const baseUrl = process.env.NODE_ENV === 'production'
            ? `https://` + process.env.NEXT_PUBLIC_VERCEL_URL
            : 'http://localhost:9002';
        
        const res = await fetch(`${baseUrl}/api/faq`, { cache: 'no-store' });

        if (!res.ok) {
            console.error(`Failed to fetch FAQ data: ${res.status} ${res.statusText}`);
            return null;
        }

        const data = await res.json();
        return data;
    } catch (error) {
        console.error('An error occurred while fetching FAQ data:', error);
        return null;
    }
}

export default async function Faq() {
  const faqs = await getFaqData();

  if (!faqs || faqs.length === 0) {
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
