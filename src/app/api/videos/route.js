import { NextResponse } from 'next/server';
import _db from "@/lib/utils/db.js";
import Video from '@/models/video.model.js';

export async function GET() {
  try {
    await _db();
    const videos = await Video.find().sort({ order: 1 });
    return NextResponse.json(videos, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching videos.', error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
    try {
        await _db();
        const body = await request.json();
        
        if (!Array.isArray(body)) {
            return NextResponse.json({ message: 'Request body must be an array of videos.' }, { status: 400 });
        }

        await Video.deleteMany({});
        
        const videosToInsert = body.map((video, index) => ({
            ...video,
            order: index, 
        }));

        const newVideos = await Video.insertMany(videosToInsert);

        return NextResponse.json(newVideos, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error updating videos.', error: error.message }, { status: 500 });
    }
}
