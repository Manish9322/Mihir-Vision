
import { NextResponse } from 'next/server';
import _db from "@/lib/utils/db.js";
import City from '@/models/city.model.js';

const seedCities = [{ name: 'San Francisco', description: 'City by the Bay', state: 'California' }];

export async function GET() {
  try {
    await _db();
    let cities = await City.find().sort({ name: 1 });
    if (!cities || cities.length === 0) {
        cities = await City.insertMany(seedCities);
    }
    return NextResponse.json(cities, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching cities.', error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
    try {
        await _db();
        const body = await request.json();
        await City.deleteMany({});
        
        const citiesToInsert = body.map(city => {
            if (city._id && String(city._id).startsWith('new_')) {
                delete city._id;
            }
            return city;
        });
        
        const newCities = await City.insertMany(citiesToInsert);
        return NextResponse.json(newCities, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error updating cities.', error: error.message }, { status: 500 });
    }
}
