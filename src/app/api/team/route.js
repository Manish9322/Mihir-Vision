
import { NextResponse } from 'next/server';
import _db from "@/lib/utils/db.js";
import TeamMember from '@/models/team.model.js';

const seedTeam = [
    { 
        name: 'Jane Doe', 
        designation: 'CEO',
        avatarUrl: 'https://placehold.co/200x200/EFEFEF/AAAAAA&text=JD',
        bio: 'Visionary leader driving the future of innovation.',
        socialLinks: [{ platform: 'LinkedIn', url: '#' }],
        isVisible: true,
        order: 0,
    },
];

export async function GET() {
  try {
    await _db();
    let team = await TeamMember.find().sort({ order: 1 });
    if (!team || team.length === 0) {
      await TeamMember.deleteMany({});
      team = await TeamMember.insertMany(seedTeam);
    }
    return NextResponse.json(team, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching team members.', error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
    try {
        await _db();
        const body = await request.json();
        
        if (!Array.isArray(body)) {
            return NextResponse.json({ message: 'Request body must be an array of team members.' }, { status: 400 });
        }

        await TeamMember.deleteMany({});
        
        const itemsToInsert = body.map((item, index) => {
            const newItem = { ...item, order: index };
            if (newItem._id && String(newItem._id).startsWith('new_')) {
                delete newItem._id;
            }
            return newItem;
        });

        const newItems = await TeamMember.insertMany(itemsToInsert);

        return NextResponse.json(newItems, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error updating team members.', error: error.message }, { status: 500 });
    }
}
