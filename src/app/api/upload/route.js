
import { NextResponse } from 'next/server';
import { uploadFile } from '@/lib/utils/upload';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ message: 'No file provided.' }, { status: 400 });
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Generate a unique file name
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;

    // Upload to Cloudinary
    const imageUrl = await uploadFile(buffer, fileName, file.type);

    if (imageUrl) {
      return NextResponse.json({ url: imageUrl }, { status: 200 });
    } else {
      throw new Error('Cloudinary upload failed to return a URL.');
    }

  } catch (error) {
    console.error("Upload API error:", error);
    return NextResponse.json({ message: 'File upload failed.', error: error.message }, { status: 500 });
  }
}
