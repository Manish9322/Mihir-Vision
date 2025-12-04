import { NextResponse } from 'next/server';
import _db from "@/lib/utils/db.js";
import Client from '@/models/client.model.js';

const seedClients = [
    { name: 'QuantumLeap', logoUrl: 'https://placehold.co/150x50/white/black?text=QuantumLeap', website: '#', order: 0, isVisible: true },
    { name: 'Stellar Solutions', logoUrl: 'https://placehold.co/150x50/white/black?text=Stellar+Solutions', website: '#', order: 1, isVisible: true },
    { name: 'Nexus Innovations', logoUrl: 'https://placehold.co/150x50/white/black?text=Nexus+Innovations', website: '#', order: 2, isVisible: true },
    { name: 'Apex Dynamics', logoUrl: 'https://placehold.co/150x50/white/black?text=Apex+Dynamics', website: '#', order: 3, isVisible: true },
    { name: 'Horizon Labs', logoUrl: 'https://placehold.co/150x50/white/black?text=Horizon+Labs', website: '#', order: 4, isVisible: true },
    { name: 'Pioneer Group', logoUrl: 'https://placehold.co/150x50/white/black?text=Pioneer+Group', website: '#', order: 5, isVisible: true },
];

export async function GET() {
  try {
    await _db();
    let clients = await Client.find().sort({ order: 1 });
    if (!clients || clients.length === 0) {
      await Client.deleteMany({});
      clients = await Client.insertMany(seedClients);
    }
    return NextResponse.json(clients, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching clients.', error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
    try {
        await _db();
        const body = await request.json();
        
        if (!Array.isArray(body)) {
            return NextResponse.json({ message: 'Request body must be an array of clients.' }, { status: 400 });
        }

        await Client.deleteMany({});
        
        const clientsToInsert = body.map((client, index) => {
            const newClient = { ...client, order: index };
            if (newClient._id && typeof newClient._id === 'string' && newClient._id.startsWith('new_')) {
                delete newClient._id;
            }
            return newClient;
        });

        const newClients = await Client.insertMany(clientsToInsert);

        return NextResponse.json(newClients, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error updating clients.', error: error.message }, { status: 500 });
    }
}
