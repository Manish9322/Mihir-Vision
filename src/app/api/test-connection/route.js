import { NextResponse } from 'next/server';
import _db from "@/lib/utils/db.js";

export async function GET(request) {
  try {
    const connection = await _db();
    if (connection) {
      // The connection object is large, so we just confirm it exists.
      await connection.disconnect();
      return NextResponse.json({ message: 'MongoDB connection successful!', status: 'connected' });
    } else {
       return NextResponse.json({ message: 'MongoDB URI is not configured.', status: 'disconnected' }, { status: 500 });
    }
  } catch (error) {
    console.error('API connection test error:', error);
    return NextResponse.json({ message: 'MongoDB connection failed.', error: error.message, status: 'error' }, { status: 500 });
  }
}
