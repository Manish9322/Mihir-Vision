import { NextResponse } from 'next/server';
import _db from "@/lib/utils/db.js";
import Activity from '@/models/activity.model.js';

const seedActivities = [
    { icon: 'Rocket', title: 'Advanced Research', description: 'We invest in fundamental research to unlock new possibilities and lay the groundwork for future technologies.', order: 0 },
    { icon: 'Dna', title: 'Technology Development', description: 'From concept to reality, we develop cutting-edge technologies that are robust, scalable, and ready for real-world application.', order: 1 },
    { icon: 'Users', title: 'Strategic Partnerships', description: 'We collaborate with industry leaders and academic institutions to accelerate innovation and broaden our impact.', order: 2 },
];

export async function GET() {
  try {
    await _db();
    let activities = await Activity.find().sort({ order: 1 });
    if (!activities || activities.length === 0) {
      await Activity.deleteMany({});
      activities = await Activity.insertMany(seedActivities);
    }
    return NextResponse.json(activities, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching activities.', error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
    try {
        await _db();
        const body = await request.json();
        
        // Ensure body is an array
        if (!Array.isArray(body)) {
            return NextResponse.json({ message: 'Request body must be an array of activities.' }, { status: 400 });
        }

        await Activity.deleteMany({});
        
        const activitiesToInsert = body.map((activity, index) => ({
            ...activity,
            order: index, 
        }));

        const newActivities = await Activity.insertMany(activitiesToInsert);

        return NextResponse.json(newActivities, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error updating activities.', error: error.message }, { status: 500 });
    }
}
