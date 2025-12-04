
import { NextResponse } from 'next/server';
import _db from "@/lib/utils/db.js";
import Country from '@/models/country.model.js';

const seedCountries = [{ name: 'USA', description: 'United States of America' }];

export async function GET() {
  try {
    await _db();
    let countries = await Country.find().sort({ name: 1 });
    if (!countries || countries.length === 0) {
        countries = await Country.insertMany(seedCountries);
    }
    return NextResponse.json(countries, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching countries.', error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
    try {
        await _db();
        const body = await request.json();
        await Country.deleteMany({});
        const newCountries = await Country.insertMany(body);
        return NextResponse.json(newCountries, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error updating countries.', error: error.message }, { status: 500 });
    }
}
