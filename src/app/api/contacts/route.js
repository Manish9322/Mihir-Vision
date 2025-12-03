
import { NextResponse } from 'next/server';
import _db from "@/lib/utils/db.js";
import Contact from '@/models/contact.model.js';

// Seed data for initial testing
const seedContacts = [
    { name: 'Olivia Martin', email: 'olivia.martin@email.com', message: 'Interested in learning more about Project Nebula. Can we schedule a call?', status: 'New', createdAt: new Date('2023-06-23') },
    { name: 'Liam Anderson', email: 'liam.anderson@email.com', message: 'Great work on the AI integration! We have a potential partnership opportunity.', status: 'Replied', createdAt: new Date('2023-06-22') },
    { name: 'Sophia Davis', email: 'sophia.davis@email.com', message: 'Question about your strategic partnerships program. Who is the best point of contact?', status: 'New', createdAt: new Date('2023-06-21') },
];

// GET all contacts
export async function GET() {
  try {
    await _db();
    let contacts = await Contact.find().sort({ createdAt: -1 });
     if (!contacts || contacts.length === 0) {
      // For initial setup, you might want to seed the database
      // await Contact.insertMany(seedContacts);
      // contacts = await Contact.find().sort({ createdAt: -1 });
    }
    return NextResponse.json(contacts, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching contacts.', error: error.message }, { status: 500 });
  }
}


// POST a new contact message
export async function POST(request) {
    try {
        await _db();
        const body = await request.json();
        const newContact = await Contact.create(body);
        return NextResponse.json(newContact, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: 'Error creating contact message.', error: error.message }, { status: 500 });
    }
}
