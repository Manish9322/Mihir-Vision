import { NextResponse } from 'next/server';
import _db from "@/lib/utils/db.js";
import Gallery from '@/models/gallery.model.js';

const seedGalleryImages = [
    { id: "gallery-1", description: "Futuristic soldier in a desolate landscape.", imageUrl: "https://images.unsplash.com/photo-1759663176507-66ef6ed6d5ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHxnYW1lJTIwY2hhcmFjdGVyfGVufDB8fHx8MTc2NDcwNzQ0M3ww&ixlib=rb-4.1.0&q=80&w=1080", imageHint: "game character", order: 0 },
    { id: "gallery-2", description: "Vibrant alien jungle with glowing flora.", imageUrl: "https://images.unsplash.com/photo-1465056836041-7f43ac27dcb5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxmYW50YXN5JTIwbGFuZHNjYXBlfGVufDB8fHx8MTc2NDcyNjI1OXww&ixlib=rb-4.1.0&q=80&w=1080", imageHint: "fantasy landscape", order: 1 },
    { id: "gallery-3", description: "A massive spaceship hangar with workers.", imageUrl: "https://images.unsplash.com/photo-1669040620781-3227ccd160fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxzY2ktZmklMjBpbnRlcmlvcnxlbnwwfHx8fDE3NjQ3NDEyNTl8MA&ixlib=rb-4.1.0&q=80&w=1080", imageHint: "sci-fi interior", order: 2 },
    { id: "gallery-4", description: "Close-up of a high-tech weapon.", imageUrl: "https://images.unsplash.com/photo-1617228827249-467df4b55e95?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxzY2ktZmklMjB3ZWFwb258ZW58MHx8fHwxNzY0NzQ0MzkwfDA&ixlib=rb-4.1.0&q=80&w=1080", imageHint: "sci-fi weapon", order: 3 },
    { id: "gallery-5", description: "A sprawling futuristic city at night.", imageUrl: "https://images.unsplash.com/photo-1514439827219-9137a0b99245?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxjeWJlcnB1bmslMjBjaXR5fGVufDB8fHx8MTc2NDY4NzU1MHww&ixlib.rb-4.1.0&q=80&w=1080", imageHint: "cyberpunk city", order: 4 },
    { id: "gallery-6", description: "A player character overlooking a vast canyon.", imageUrl: "https://images.unsplash.com/photo-1692685820393-fcf174d59b2f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxhZHZlbnR1cmUlMjBsYW5kc2NhcGV8ZW58MHx8fHwxNzY0NzQ0MzkwfDA&ixlib.rb-4.1.0&q=80&w=1080", imageHint: "adventure landscape", order: 5 },
];

export async function GET() {
  try {
    await _db();
    let images = await Gallery.find().sort({ order: 1 });
    if (!images || images.length === 0) {
      await Gallery.deleteMany({});
      images = await Gallery.insertMany(seedGalleryImages);
    }
    return NextResponse.json(images, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching gallery images.', error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
    try {
        await _db();
        const body = await request.json();
        
        if (!Array.isArray(body)) {
            return NextResponse.json({ message: 'Request body must be an array of images.' }, { status: 400 });
        }

        await Gallery.deleteMany({});
        
        const imagesToInsert = body.map((image, index) => {
            const newImage = { ...image, order: index };
            if (newImage.id && typeof newImage.id === 'string' && newImage.id.startsWith('new_')) {
                // Let Mongoose generate a new ObjectId by not providing our own `_id`
                const { _id, ...rest } = newImage;
                return rest;
            }
            return newImage;
        });

        const newImages = await Gallery.insertMany(imagesToInsert);

        return NextResponse.json(newImages, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error updating gallery.', error: error.message }, { status: 500 });
    }
}
