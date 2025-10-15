import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';
import { put } from '@vercel/blob';
import { auth } from '@/lib/auth';

const resend = new Resend(process.env.RESEND_API_KEY);

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const formData = await request.formData();

    // Extract form fields
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const subject = formData.get('subject') as string;
    const message = formData.get('message') as string;

    // Validate form data
    const validatedData = contactSchema.parse({
      name,
      email,
      subject,
      message,
    });

    // Handle file uploads
    const uploadedFiles: string[] = [];
    const fileEntries = Array.from(formData.entries()).filter(([key]) =>
      key.startsWith('file_')
    );

    for (const [, file] of fileEntries) {
      if (file instanceof File) {
        try {
          // Upload file to Vercel Blob
          const blob = await put(
            `contact-files/${Date.now()}-${file.name}`,
            file,
            {
              access: 'public',
            }
          );
          uploadedFiles.push(blob.url);
        } catch (fileError) {
          console.error('File upload error:', fileError);
          // Continue with email even if file upload fails
        }
      }
    }

    // Create file links HTML
    const fileLinksHtml =
      uploadedFiles.length > 0
        ? `
        <div style="background-color: #fff3cd; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #ffc107;">
          <h3 style="color: #333333; margin-top: 0; margin-bottom: 15px;">Angehängte Dateien:</h3>
          <ul style="margin: 0; padding-left: 20px;">
            ${uploadedFiles
              .map((url) => {
                const fileName = url.split('/').pop() || 'Datei';
                return `<li style="margin: 5px 0;"><a href="${url}" style="color: #007bff; text-decoration: none;">${fileName}</a></li>`;
              })
              .join('')}
          </ul>
        </div>
      `
        : '';

    // Send email using Resend
    const emailData = await resend.emails.send({
      from: 'HonorarX <noreply@honorarx.de>',
      to: ['info@honorarx.de'],
      subject: `Contact Form: ${validatedData.subject}`,
      html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Neue Kontaktanfrage - HonorarX</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
              <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px;">
                <div style="text-align: center; margin-bottom: 30px;">
                  <h1 style="color: #333333; margin: 0; font-size: 24px;">HonorarX</h1>
                  <p style="color: #666666; margin: 5px 0 0 0;">Professionelle Rechnungserstellung</p>
                </div>
                
                <h2 style="color: #333333; font-size: 20px; margin-bottom: 20px;">Neue Kontaktanfrage</h2>
                
                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #007bff;">
                  <h3 style="color: #333333; margin-top: 0; margin-bottom: 15px;">Kontaktdaten:</h3>
                  <p style="margin: 8px 0; color: #333333;"><strong>Name:</strong> ${validatedData.name}</p>
                  <p style="margin: 8px 0; color: #333333;"><strong>E-Mail:</strong> <a href="mailto:${validatedData.email}" style="color: #007bff; text-decoration: none;">${validatedData.email}</a></p>
                  <p style="margin: 8px 0; color: #333333;"><strong>Betreff:</strong> ${validatedData.subject}</p>
                  <p style="margin: 8px 0; color: #333333;"><strong>Benutzer-ID:</strong> ${session.user.id}</p>
                  <p style="margin: 8px 0; color: #333333;"><strong>Authentifiziert:</strong> Ja (angemeldeter Benutzer)</p>
                </div>
                
                <div style="background-color: #ffffff; padding: 20px; border: 1px solid #e9ecef; border-radius: 8px; margin-bottom: 20px;">
                  <h3 style="color: #333333; margin-top: 0; margin-bottom: 15px;">Nachricht:</h3>
                  <div style="color: #333333; line-height: 1.6; white-space: pre-wrap; background-color: #f8f9fa; padding: 15px; border-radius: 5px;">${validatedData.message}</div>
                </div>
                
                ${fileLinksHtml}
                
                <div style="margin-top: 30px; padding: 20px; background-color: #e8f4f8; border-radius: 8px; border-left: 4px solid #17a2b8;">
                  <p style="margin: 0; color: #666666; font-size: 14px; line-height: 1.5;">
                    <strong>Hinweis:</strong> Diese Nachricht wurde über das HonorarX Kontaktformular auf 
                    <a href="https://honorarx.de" style="color: #007bff; text-decoration: none;">honorarx.de</a> gesendet.
                  </p>
                </div>
                
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eeeeee;">
                  <p style="margin: 0; color: #999999; font-size: 12px; text-align: center;">
                    HonorarX - Professionelle Rechnungserstellung für Deutschland
                  </p>
                </div>
              </div>
            </body>
            </html>
          `,
    });

    return NextResponse.json(
      {
        message: 'Email sent successfully',
        emailId: emailData.data?.id,
        uploadedFiles: uploadedFiles.length,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Email sending error:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
