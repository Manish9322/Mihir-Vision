
import { NextResponse } from 'next/server';
import _db from "@/lib/utils/db.js";
import Game from '@/models/game.model.js';

const seedGames = [
    { 
        title: 'CyberRunner 2077', 
        coverImageUrl: 'https://placehold.co/300x400/000000/FFFFFF/png?text=CyberRunner',
        description: 'An action RPG set in a dystopian future.',
        releaseDate: '2023-10-26',
        platforms: ['PC', 'PlayStation 5', 'Xbox Series X'],
        websiteUrl: '#',
        isVisible: true,
        order: 0,
    },
];

export async function GET() {
  try {
    await _db();
    let games = await Game.find().sort({ order: 1 });
    if (!games || games.length === 0) {
      await Game.deleteMany({});
      games = await Game.insertMany(seedGames);
    }
    return NextResponse.json(games, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching games.', error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
    try {
        await _db();
        const body = await request.json();
        
        if (!Array.isArray(body)) {
            return NextResponse.json({ message: 'Request body must be an array of games.' }, { status: 400 });
        }

        await Game.deleteMany({});
        
        const itemsToInsert = body.map((item, index) => {
            const newItem = { ...item, order: index };
            if (newItem._id && String(newItem._id).startsWith('new_')) {
                delete newItem._id;
            }
            return newItem;
        });

        const newItems = await Game.insertMany(itemsToInsert);

        return NextResponse.json(newItems, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error updating games.', error: error.message }, { status: 500 });
    }
}
