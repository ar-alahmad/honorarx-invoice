import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { authRateLimit } from '@/lib/rate-limit';
import {
  createSuccessResponse,
  handleValidationError,
  handleServerError,
} from '@/lib/error-handler';
import { sanitizeEmail } from '@/lib/sanitize';
import { Resend } from 'resend';
import crypto from 'crypto';

const resend = new Resend(process.env.RESEND_API_KEY);

const verifyEmailSchema = z.object({
  email: z.string().email('Invalid email address'),
});

const confirmVerificationSchema = z.object({
  email: z.string().email('Invalid email address'),
  code: z
    .string()
    .min(6, 'Verification code must be 6 digits')
    .max(6, 'Verification code must be 6 digits'),
});

// Send verification email
export async function POST(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResponse = authRateLimit(request);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    const body = await request.json();
    const { email } = verifyEmailSchema.parse(body);

    // Sanitize email input
    const sanitizedEmail = sanitizeEmail(email);

    const user = await db.user.findUnique({
      where: { email: sanitizedEmail },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.isEmailVerified) {
      return NextResponse.json(
        { error: 'Email already verified' },
        { status: 400 }
      );
    }

    // Generate 6-digit verification code
    const verificationCode = crypto.randomInt(100000, 999999).toString();

    // Store verification code in dedicated fields
    const verificationExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await db.user.update({
      where: { id: user.id },
      data: {
        emailVerificationCode: verificationCode,
        emailVerificationExpiry: verificationExpiry,
      },
    });

    // Send verification email
    const emailResult = await resend.emails.send({
      from: 'HonorarX <noreply@honorarx.de>',
      to: [email],
      subject: 'E-Mail-Verifizierung - HonorarX',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>E-Mail-Verifizierung - HonorarX</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #333333; margin: 0; font-size: 24px;">HonorarX</h1>
              <p style="color: #666666; margin: 5px 0 0 0;">Professionelle Rechnungserstellung</p>
            </div>
            
            <h2 style="color: #333333; font-size: 20px; margin-bottom: 20px;">E-Mail-Adresse bestätigen</h2>
            
            <p style="color: #333333; line-height: 1.6; margin-bottom: 20px;">
              Hallo ${user.firstName || 'Benutzer'},
            </p>
            
            <p style="color: #333333; line-height: 1.6; margin-bottom: 20px;">
              Vielen Dank für Ihre Registrierung bei HonorarX! Um Ihr Konto zu aktivieren, 
              bestätigen Sie bitte Ihre E-Mail-Adresse mit dem folgenden Verifizierungscode:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <div style="background-color: #f8f9fa; border: 2px solid #007bff; border-radius: 8px; padding: 20px; display: inline-block;">
                <h3 style="color: #333333; margin: 0 0 10px 0; font-size: 16px;">Ihr Verifizierungscode:</h3>
                <div style="font-size: 32px; font-weight: bold; color: #007bff; letter-spacing: 4px; font-family: monospace;">
                  ${verificationCode}
                </div>
              </div>
            </div>
            
            <p style="color: #666666; line-height: 1.6; margin-bottom: 20px;">
              <strong>Wichtige Hinweise:</strong>
            </p>
            <ul style="color: #666666; line-height: 1.6; margin-bottom: 20px;">
              <li>Dieser Code ist 15 Minuten gültig</li>
              <li>Geben Sie den Code auf der Verifizierungsseite ein</li>
              <li>Falls Sie sich nicht registriert haben, können Sie diese E-Mail ignorieren</li>
            </ul>
            
            <div style="margin-top: 40px; padding: 20px; background-color: #f8f9fa; border-radius: 8px; border-left: 4px solid #007bff;">
              <p style="margin: 0; color: #666666; font-size: 14px; line-height: 1.5;">
                <strong>HonorarX Team</strong><br>
                Professionelle Rechnungserstellung für Deutschland<br>
                <a href="https://honorarx.de" style="color: #007bff; text-decoration: none;">honorarx.de</a>
              </p>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eeeeee;">
              <p style="margin: 0; color: #999999; font-size: 12px; text-align: center;">
                Diese E-Mail wurde automatisch generiert. Bitte antworten Sie nicht auf diese E-Mail.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log('Verification email sent successfully:', emailResult);

    return NextResponse.json(
      {
        message: 'Verification code sent to your email',
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

    console.error('Email verification error:', error);
    return NextResponse.json(
      { error: 'Failed to send verification email' },
      { status: 500 }
    );
  }
}

// Confirm verification code
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, code } = confirmVerificationSchema.parse(body);

    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.isEmailVerified) {
      return NextResponse.json(
        { error: 'Email already verified' },
        { status: 400 }
      );
    }

    // Check if verification code matches and is not expired
    if (
      user.emailVerificationCode !== code ||
      !user.emailVerificationExpiry ||
      user.emailVerificationExpiry < new Date()
    ) {
      return NextResponse.json(
        { error: 'Invalid or expired verification code' },
        { status: 400 }
      );
    }

    // Mark email as verified
    await db.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
        emailVerifiedAt: new Date(),
        emailVerificationCode: null,
        emailVerificationExpiry: null,
      },
    });

    return NextResponse.json(
      { message: 'Email verified successfully' },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Email verification confirmation error:', error);
    return NextResponse.json(
      { error: 'Failed to verify email' },
      { status: 500 }
    );
  }
}
