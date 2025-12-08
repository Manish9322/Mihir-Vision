
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
        const siteName = siteSettings?.siteName || 'Mihir Vision';

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
                                body { 
                                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                                    line-height: 1.6;
                                    font-size: 16px;
                                    color: #333;
                                    margin: 20px;
                                }
                                h1 {
                                    font-size: 24px;
                                    font-weight: 600;
                                    margin-bottom: 30px;
                                }
                                h2 {
                                    font-size: 20px;
                                    font-weight: 600;
                                    margin-top: 30px;
                                    margin-bottom: 15px;
                                    border-bottom: 1px solid #ddd;
                                    padding-bottom: 8px;
                                }
                                dl {
                                    margin: 0;
                                    padding: 0;
                                }
                                dt {
                                    font-weight: 600;
                                    color: #555;
                                    margin-top: 10px;
                                }
                                dd {
                                    margin-left: 0;
                                    margin-bottom: 10px;
                                    color: #333;
                                }
                                a {
                                    color: #007bff;
                                    text-decoration: none;
                                }
                                p {
                                    white-space: pre-wrap;
                                    font-size: 16px;
                                }
                                .footer {
                                    margin-top: 40px;
                                    font-size: 12px;
                                    color: #888;
                                }
                            </style>
                        </head>
                        <body>
                            <h1>New Inquiry from ${siteName}</h1>
                            
                            <h2>Sender Details</h2>
                            <dl>
                                <dt>Name:</dt>
                                <dd>${name}</dd>
                                
                                <dt>Email:</dt>
                                <dd><a href="mailto:${email}">${email}</a></dd>
                                
                                ${phone ? `<dt>Phone:</dt><dd>${phone}</dd>` : ''}
                            </dl>
                            
                            <h2>Message</h2>
                            <p>${message}</p>

                            <div class="footer">
                                This is an automated notification from ${siteName}.
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
