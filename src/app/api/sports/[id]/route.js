
import { NextResponse } from 'next/server';
import _db from "@/lib/utils/db.js";
import Sport from '@/models/sport.model.js';

export async function GET(request, { params }) {
    try {
        await _db();
        const { id } = params;
        const sport = await Sport.findById(id);

        if (!sport) {
            return NextResponse.json({ message: 'Sport not found.' }, { status: 404 });
        }

        return NextResponse.json(sport, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching sport.', error: error.message }, { status: 500 });
    }
}
