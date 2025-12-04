
import { NextResponse } from 'next/server';
import _db from "@/lib/utils/db.js";
import Designation from '@/models/designation.model.js';

const seedDesignations = [
    { name: 'CEO', description: 'Chief Executive Officer', isUnique: true },
    { name: 'Lead Engineer', description: 'Leads the engineering team.', isUnique: false },
];

export async function GET() {
  try {
    await _db();
    let designations = await Designation.find().sort({ name: 1 });
    if (!designations || designations.length === 0) {
        designations = await Designation.insertMany(seedDesignations);
    }
    return NextResponse.json(designations, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching designations.', error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
    try {
        await _db();
        const body = await request.json();
        await Designation.deleteMany({});
        
        const designationsToInsert = body.map(designation => {
            if (designation._id && String(designation._id).startsWith('new_')) {
                delete designation._id;
            }
            return designation;
        });
        
        const newDesignations = await Designation.insertMany(designationsToInsert);
        return NextResponse.json(newDesignations, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error updating designations.', error: error.message }, { status: 500 });
    }
}
