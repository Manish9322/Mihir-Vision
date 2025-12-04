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
    let user = await User.findOne({ email: seedUserData.email });
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
        
        // Use the seed email as the unique key to find and update the admin user document.
        // The email in the body is allowed to be updated.
        const updatedUser = await User.findOneAndUpdate(
            { email: seedUserData.email }, // Find document by the original seed email
            body, // Apply the full update from the request body, including the new email
            {
                new: true,
                upsert: true, 
                runValidators: true,
            }
        );
        return NextResponse.json(updatedUser, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error updating user profile.', error: error.message }, { status: 500 });
    }
}
