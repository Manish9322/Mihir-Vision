
import { NextResponse } from 'next/server';
import _db from "@/lib/utils/db.js";
import Contact from '@/models/contact.model.js';

// DELETE a contact message
export async function DELETE(request, { params }) {
    try {
        await _db();
        const { id } = params;
        const deletedContact = await Contact.findByIdAndDelete(id);

        if (!deletedContact) {
            return NextResponse.json({ message: 'Contact not found.' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Contact deleted successfully.' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error deleting contact.', error: error.message }, { status: 500 });
    }
}

// UPDATE a contact message (e.g., to change status)
export async function PATCH(request, { params }) {
    try {
        await _db();
        const { id } = params;
        const body = await request.json();

        const updatedContact = await Contact.findByIdAndUpdate(id, body, { new: true, runValidators: true });

        if (!updatedContact) {
            return NextResponse.json({ message: 'Contact not found.' }, { status: 404 });
        }

        return NextResponse.json(updatedContact, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error updating contact.', error: error.message }, { status: 500 });
    }
}
