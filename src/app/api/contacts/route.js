
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
                    from: `${siteName} <onboarding@resend.dev>`,
                    to: notifyEmail,
                    subject: `New Inquiry from ${name}`,
                    html: `
                        <!DOCTYPE html>
                        <html lang="en">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <style>
                                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji'; background-color: #f4f4f7; color: #333; margin: 0; padding: 0; }
                                .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); overflow: hidden; }
                                .header { background-color: #4A00E0; /* A shade of purple */ color: #ffffff; padding: 30px; text-align: center; }
                                .header h1 { margin: 0; font-size: 28px; font-weight: 600; }
                                .content { padding: 30px; }
                                .content h2 { font-size: 22px; color: #4A00E0; margin-top: 0; margin-bottom: 20px; border-bottom: 2px solid #eee; padding-bottom: 10px; }
                                .details-grid { display: grid; grid-template-columns: 120px 1fr; gap: 10px 20px; }
                                .details-grid dt { font-weight: 600; color: #555; }
                                .details-grid dd { margin: 0; color: #333; }
                                .message-box { background-color: #f9f9f9; border: 1px solid #eee; border-radius: 5px; padding: 20px; margin-top: 25px; }
                                .message-box p { margin: 0; white-space: pre-wrap; line-height: 1.6; }
                                .footer { background-color: #f4f4f7; padding: 20px; text-align: center; font-size: 12px; color: #888; }
                            </style>
                        </head>
                        <body>
                            <div class="container">
                                <div class="header">
                                    <h1>New Inquiry Received</h1>
                                </div>
                                <div class="content">
                                    <h2>Sender's Details</h2>
                                    <dl class="details-grid">
                                        <dt>Name:</dt>
                                        <dd>${name}</dd>
                                        <dt>Email:</dt>
                                        <dd><a href="mailto:${email}" style="color: #4A00E0; text-decoration: none;">${email}</a></dd>
                                        ${phone ? `<dt>Phone:</dt><dd>${phone}</dd>` : ''}
                                    </dl>
                                    <div class="message-box">
                                        <p>${message}</p>
                                    </div>
                                </div>
                                <div class="footer">
                                    This is an automated notification from ${siteName}.
                                </div>
                            </div>
                        </body>
                        </html>
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
