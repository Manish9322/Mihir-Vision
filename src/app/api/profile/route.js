import { NextResponse } from 'next/server';
import _db from "@/lib/utils/db.js";
import User from '@/models/user.model.js';

// Seed data to ensure there's always one user document for the admin
const seedUserData = {
    fullName: 'Admin User',
    email: 'admin@pinnaclepathways.com',
    avatarUrl: 'https://picsum.photos/seed/admin/128/128',
    phone: '123-456-7890',
    address: {
        street: '123 Innovation Drive',
        city: 'Techville',
        state: 'CA',
        zip: '90210',
        country: 'USA',
    }
};

export async function GET() {
  try {
    await _db();
    let user = await User.findOne();
    if (!user) {
      user = await User.create(seedUserData);
    }
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching user profile.', error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
    try {
        await _db();
        const body = await request.json();
        
        // Find the single user document, we assume there is only one for the admin.
        let user = await User.findOne();
        if (!user) {
            // If no user exists for some reason, create one.
            const newUser = await User.create(body);
            return NextResponse.json(newUser, { status: 200 });
        }

        // Update the found user document by its _id
        const updatedUser = await User.findByIdAndUpdate(
            user._id,
            body,
            {
                new: true,
                runValidators: true,
            }
        );

        return NextResponse.json(updatedUser, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error updating user profile.', error: error.message }, { status: 500 });
    }
}
