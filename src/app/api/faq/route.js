import { NextResponse } from 'next/server';
import _db from "@/lib/utils/db.js";
import Faq from '@/models/faq.model.js';

const seedFaqs = [
    {
        question: 'What is the primary focus of Pinnacle Pathways?',
        answer: 'Our primary focus is on pioneering solutions for next-generation challenges through advanced research, technology development, and strategic partnerships. We aim to create a significant impact in areas like connectivity, sustainability, and healthcare.',
        order: 0,
        isVisible: true,
    },
    {
        question: 'How can my organization partner with you?',
        answer: 'We are always open to collaborating with organizations that share our vision. Please reach out to us via our contact form with your proposal, and our partnerships team will get back to you to discuss potential synergies.',
        order: 1,
        isVisible: true,
    },
    {
        question: 'Are you currently hiring?',
        answer: 'We are constantly looking for talented individuals to join our team. Please visit our careers page for open positions and information on how to apply. We look for passionate innovators from diverse backgrounds.',
        order: 2,
        isVisible: true,
    },
    {
        question: 'What are some of your key technological achievements?',
        answer: 'One of our key achievements was the development of a proprietary algorithm that revolutionized data processing. We have also made significant strides in AI integration and are leading research in decentralized communication networks.',
        order: 3,
        isVisible: true,
    },
];

export async function GET() {
  try {
    await _db();
    let faqs = await Faq.find().sort({ order: 1 });
    if (!faqs || faqs.length === 0) {
      await Faq.deleteMany({});
      faqs = await Faq.insertMany(seedFaqs);
    }
    return NextResponse.json(faqs, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching FAQs.', error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
    try {
        await _db();
        const body = await request.json();
        
        if (!Array.isArray(body)) {
            return NextResponse.json({ message: 'Request body must be an array of FAQs.' }, { status: 400 });
        }

        await Faq.deleteMany({});
        
        const faqsToInsert = body.map((faq, index) => {
            const newFaq = { ...faq, order: index };
            if (newFaq._id && typeof newFaq._id === 'string' && newFaq._id.startsWith('new_')) {
                delete newFaq._id;
            }
            return newFaq;
        });

        const newFaqs = await Faq.insertMany(faqsToInsert);

        return NextResponse.json(newFaqs, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error updating FAQs.', error: error.message }, { status: 500 });
    }
}
