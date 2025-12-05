
import { NextResponse } from 'next/server';
import _db from "@/lib/utils/db.js";
import Contact from '@/models/contact.model.js';
import User from '@/models/user.model.js';
import Settings from '@/models/settings.model.js';
import { Resend } from 'resend';
import 'dotenv/config';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;


// GET all contacts
export async function GET() {
  try {
    await _db();
    let contacts = await Contact.find().sort({ createdAt: -1 });
    return NextResponse.json(contacts, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching contacts.', error: error.message }, { status: 500 });
  }
}

// POST a new contact message and send email notification
export async function POST(request) {
    try {
        await _db();
        const body = await request.json();
        
        // 1. Save the contact message to the database
        const newContact = await Contact.create(body);

        // 2. Fetch the admin user's email for notification
        const adminUser = await User.findOne();
        const notifyEmail = adminUser?.email;
        const siteSettings = await Settings.findOne();
        const siteName = siteSettings?.siteName || 'Pinnacle Pathways';

        // 3. If a notification email is set and Resend is configured, send the email
        if (resend && notifyEmail) {
            const { name, email, phone, message } = body;
            
            try {
                await resend.emails.send({
                    from: `Contact Form <${process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'}>`,
                    to: notifyEmail,
                    subject: `New Contact Form Submission from ${name}`,
                    html: `
                        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                            <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                                <h2 style="font-size: 24px; color: #000; border-bottom: 2px solid #eee; padding-bottom: 10px;">New Message from ${siteName} Contact Form</h2>
                                <p style="font-size: 16px;">You have received a new message from your website's contact form.</p>
                                <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 20px;">
                                    <p style="margin: 0; padding-bottom: 10px;"><strong>Name:</strong> ${name}</p>
                                    <p style="margin: 0; padding-bottom: 10px;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #007bff;">${email}</a></p>
                                    ${phone ? `<p style="margin: 0; padding-bottom: 10px;"><strong>Phone:</strong> ${phone}</p>` : ''}
                                    <p style="margin: 0;"><strong>Message:</strong></p>
                                    <p style="margin: 0; white-space: pre-wrap;">${message}</p>
                                </div>
                                <p style="font-size: 12px; color: #888; margin-top: 20px;">This is an automated notification. Please do not reply directly to this email.</p>
                            </div>
                        </div>
                    `
                });
            } catch (emailError) {
                console.error("Resend email sending error:", emailError);
                // Do not throw an error here, as the main operation (saving contact) was successful.
                // The contact was saved, even if the email notification failed.
            }
        } else {
             if (!resend) console.warn("Resend is not configured. RESEND_API_KEY might be missing.");
             if (!notifyEmail) console.warn("Admin notification email not found.");
        }

        return NextResponse.json(newContact, { status: 201 });
    } catch (error) {
        console.error("Error in contact form submission:", error);
        return NextResponse.json({ message: 'Error creating contact message.', error: error.message }, { status: 500 });
    }
}
