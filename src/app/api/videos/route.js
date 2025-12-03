import { NextResponse } from 'next/server';
import _db from "@/lib/utils/db.js";
import Video from '@/models/video.model.js';

const seedVideos = [
  {
    id: 'vid1',
    title: 'Project Apex Launch',
    subtitle: 'Highlights from our most ambitious project yet.',
    duration: '0:45',
    thumbnail: { id: "video-thumb-1", description: "Rocket launching into the sky.", imageUrl: "https://images.unsplash.com/photo-1541185934-01b600ea069c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw5fHxyb2NrZXQlMjBsYXVuY2h8ZW58MHx8fHwxNzY0NjY3Nzk3fDA&ixlib=rb-4.1.0&q=80&w=1080", imageHint: "rocket launch" },
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    order: 0,
  },
  {
    id: 'vid2',
    title: 'Innovation Roundtable',
    subtitle: 'Our leadership team discusses the future of tech.',
    duration: '0:58',
    thumbnail: { id: "video-thumb-2", description: "People in a modern meeting room.", imageUrl: "https://images.unsplash.com/photo-1686771416282-3888ddaf249b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxidXNpbmVzcyUyMG1lZXRpbmd8ZW58MHx8fHwxNzY0NzQwOTkzfDA&ixlib=rb-4.1.0&q=80&w=1080", imageHint: "business meeting" },
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    order: 1,
  },
  {
    id: 'vid3',
    title: 'A Day in the Life',
    subtitle: 'Behind the scenes with our engineering team.',
    duration: '0:15',
    thumbnail: { id: "video-thumb-3", description: "Engineers working with hardware.", imageUrl: "https://images.unsplash.com/photo-1556761175-b413da4baf72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxlbmdpbmVlcmluZyUyMHRlYW18ZW58MHx8fHwxNzY0NzQxNDU2fDA&ixlib=rb-4.1.0&q=80&w=1080", imageHint: "engineering team" },
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    order: 2,
  },
  {
    id: 'vid4',
    title: 'The Genesis Idea',
    subtitle: 'Our founder shares the story of Pinnacle Pathways.',
    duration: '1:00',
    thumbnail: { id: "video-thumb-4", description: "Portrait of a person thinking.", imageUrl: "https://images.unsplash.com/photo-1758691737644-ef8be18256c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxmb3VuZGVyJTIwcG9ydHJhaXR8ZW58MHx8fHwxNzY0NzQxNDU2fDA&ixlib=rb-4.1.0&q=80&w=1080", imageHint: "founder portrait" },
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
    order: 3,
  },
  {
    id: 'vid5',
    title: 'Community Impact',
    subtitle: 'How our work is making a difference.',
    duration: '0:59',
    thumbnail: { id: "video-thumb-5", description: "People volunteering in a community.", imageUrl: "https://images.unsplash.com/photo-1527525443983-6e60c75fff46?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxjb21tdW5pdHklMjB3b3JrfGVufDB8fHx8MTc2NDY0NjA3Nnww&ixlib=rb-4.1.0&q=80&w=1080", imageHint: "community work" },
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    order: 4,
  },
  {
    id: 'vid6',
    title: 'Future of AI',
    subtitle: 'A deep dive into our AI research and development.',
    duration: '0:12',
    thumbnail: { id: "video-thumb-6", description: "Abstract visualization of AI network.", imageUrl: "https://images.unsplash.com/photo-1697577418970-95d99b5a55cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlfGVufDB8fHx8MTc2NDc0MTQ1Nnww&ixlib=rb-4.1.0&q=80&w=1080", imageHint: "artificial intelligence" },
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnAnAdventure.mp4',
    order: 5,
  },
];

export async function GET() {
  try {
    await _db();
    let videos = await Video.find().sort({ order: 1 });
    if (!videos || videos.length === 0) {
      await Video.deleteMany({});
      videos = await Video.insertMany(seedVideos);
    }
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
