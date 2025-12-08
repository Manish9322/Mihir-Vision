
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-that-is-long-and-secure';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'mihir-vision.vercel.app';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Mihir-Vision@2025';

export async function POST(request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        if (email === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
            // Credentials are correct, create a JWT token
            const token = jwt.sign(
                { user: email, role: 'admin' },
                JWT_SECRET,
                { expiresIn: '1h' } // Token expires in 1 hour
            );

            return NextResponse.json({ token }, { status: 200 });
        } else {
            // Invalid credentials
            return NextResponse.json({ message: 'Invalid username or password' }, { status: 401 });
        }
    } catch (error) {
        return NextResponse.json({ message: 'An error occurred during login.', error: error.message }, { status: 500 });
    }
}
