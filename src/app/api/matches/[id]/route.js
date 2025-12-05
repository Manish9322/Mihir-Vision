
import { NextResponse } from 'next/server';
import _db from "@/lib/utils/db.js";
import Match from '@/models/match.model.js';

// GET a single match by ID
export async function GET(request, { params }) {
    try {
        await _db();
        const { id } = params;
        const match = await Match.findById(id).populate('sport');
        if (!match) {
            return NextResponse.json({ message: 'Match not found.' }, { status: 404 });
        }
        return NextResponse.json(match, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching match.', error: error.message }, { status: 500 });
    }
}

// UPDATE a match
export async function PATCH(request, { params }) {
    try {
        await _db();
        const { id } = params;
        const body = await request.json();
        const updatedMatch = await Match.findByIdAndUpdate(id, body, { new: true, runValidators: true });
        if (!updatedMatch) {
            return NextResponse.json({ message: 'Match not found.' }, { status: 404 });
        }
        return NextResponse.json(updatedMatch, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error updating match.', error: error.message }, { status: 500 });
    }
}

// DELETE a match
export async function DELETE(request, { params }) {
    try {
        await _db();
        const { id } = params;
        const deletedMatch = await Match.findByIdAndDelete(id);
        if (!deletedMatch) {
            return NextResponse.json({ message: 'Match not found.' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Match deleted successfully.' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error deleting match.', error: error.message }, { status: 500 });
    }
}
