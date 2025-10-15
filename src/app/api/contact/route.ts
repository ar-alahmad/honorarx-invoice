import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';

const resend = new Resend(process.env.RESEND_API_KEY);

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = contactSchema.parse(body);

    // Send email using Resend
    const emailData = await resend.emails.send({
      from: 'HonorarX <noreply@honorarx.de>', // Your verified domain (after DNS setup)
      to: ['info@honorarx.de'], // Your business email for production
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
                </div>
                
                <div style="background-color: #ffffff; padding: 20px; border: 1px solid #e9ecef; border-radius: 8px; margin-bottom: 20px;">
                  <h3 style="color: #333333; margin-top: 0; margin-bottom: 15px;">Nachricht:</h3>
                  <div style="color: #333333; line-height: 1.6; white-space: pre-wrap; background-color: #f8f9fa; padding: 15px; border-radius: 5px;">${validatedData.message}</div>
                </div>
                
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

    // Also save to database for record keeping
    // TODO: Add database storage here if needed

    return NextResponse.json(
      {
        message: 'Email sent successfully',
        emailId: emailData.data?.id,
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
