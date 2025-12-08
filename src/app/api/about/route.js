import { NextResponse } from 'next/server';
import _db from "@/lib/utils/db.js";
import About from '@/models/about.model.js';

// Seed data to ensure there's always one document
const seedAboutData = {
    title: 'Who We Are',
    paragraph1: 'Mihir Vision was founded on the principle of relentless innovation. We are a collective of thinkers, creators, and pioneers dedicated to pushing the boundaries of what\'s possible. Our diverse team brings together expertise from various fields to tackle complex problems with creative and effective solutions.',
    highlights: [
        "Commitment to groundbreaking research and development.",
        "Fostering a culture of collaboration and creativity.",
        "Delivering solutions that create tangible, real-world impact."
    ],
    image: {
        imageUrl: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHx0ZWFtJTIwY29sbGFib3JhdGlvbnxlbnwwfHx8fDE3NjQ3MzU1NjJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
        description: 'Team collaborating in a modern office.'
    }
};

export async function GET() {
  try {
    await _db();
    let about = await About.findOne();
    if (!about) {
      // If no document exists, create one with the seed data
      about = await About.create(seedAboutData);
    }
    return NextResponse.json(about, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching about data.', error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
    try {
        await _db();
        const body = await request.json();
        const updatedAbout = await About.findOneAndUpdate({}, body, {
            new: true,
            upsert: true, 
            runValidators: true,
        });
        return NextResponse.json(updatedAbout, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error updating about data.', error: error.message }, { status: 500 });
    }
}
