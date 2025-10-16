import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword } from '@/lib/encryption';
import { authRateLimit } from '@/lib/rate-limit';
import {
  createSuccessResponse,
  handleValidationError,
  handleServerError,
} from '@/lib/error-handler';
import { sanitizeEmail } from '@/lib/sanitize';
import { Resend } from 'resend';
import { z } from 'zod';
import crypto from 'crypto';

export const runtime = 'nodejs';

const resend = new Resend(process.env.RESEND_API_KEY);

const resetPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

const updatePasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
});

// Request password reset
export async function POST(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResponse = authRateLimit(request);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    const body = await request.json();
    const { email } = resetPasswordSchema.parse(body);

    // Sanitize email input
    const sanitizedEmail = sanitizeEmail(email);

    // Check if user exists
    const user = await db.user.findUnique({
      where: { email: sanitizedEmail },
    });

    if (!user) {
      // Don't reveal if user exists or not for security
      return createSuccessResponse(
        {
          message:
            'If an account with that email exists, we have sent a password reset link.',
        },
        'Password reset request processed',
        200
      );
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Save reset token to database
    await db.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    // Send password reset email
    const resetUrl = `${process.env.NEXTAUTH_URL}/passwort-zuruecksetzen?token=${resetToken}`;

    console.log('Sending password reset email to:', email);
    console.log('Reset URL:', resetUrl);

    const emailResult = await resend.emails.send({
      from: 'HonorarX <noreply@honorarx.de>',
      to: [email], // Send to the actual user's email
      subject: 'Ihr HonorarX Passwort zurücksetzen',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Passwort zurücksetzen - HonorarX</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #333333; margin: 0; font-size: 24px;">HonorarX</h1>
              <p style="color: #666666; margin: 5px 0 0 0;">Professionelle Rechnungserstellung</p>
            </div>
            
            <h2 style="color: #333333; font-size: 20px; margin-bottom: 20px;">Passwort zurücksetzen</h2>
            
            <p style="color: #333333; line-height: 1.6; margin-bottom: 20px;">
              Hallo ${user.firstName || 'Benutzer'},
            </p>
            
            <p style="color: #333333; line-height: 1.6; margin-bottom: 20px;">
              Sie haben eine Anfrage zum Zurücksetzen Ihres Passworts für Ihr HonorarX-Konto gestellt. 
              Klicken Sie auf den unten stehenden Button, um ein neues Passwort festzulegen:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background-color: #007bff; color: #ffffff; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold; font-size: 16px;">
                Passwort zurücksetzen
              </a>
            </div>
            
            <p style="color: #666666; line-height: 1.6; margin-bottom: 20px;">
              <strong>Wichtige Hinweise:</strong>
            </p>
            <ul style="color: #666666; line-height: 1.6; margin-bottom: 20px;">
              <li>Dieser Link ist 1 Stunde gültig</li>
              <li>Falls Sie diese Anfrage nicht gestellt haben, können Sie diese E-Mail ignorieren</li>
              <li>Ihr Passwort wird nicht geändert, bis Sie den Link verwenden</li>
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

    console.log('Email sent successfully:', emailResult);

    return createSuccessResponse(
      {
        message:
          'If an account with that email exists, we have sent a password reset link.',
      },
      'Password reset email sent',
      200
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleValidationError(error);
    }

    return handleServerError(error);
  }
}

// Update password with token
export async function PUT(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResponse = authRateLimit(request);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    const body = await request.json();
    const { token, newPassword } = updatePasswordSchema.parse(body);

    // Find user with valid reset token
    const user = await db.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date(), // Token not expired
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: 'Invalid or expired reset token',
          code: 'INVALID_TOKEN',
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update password and clear reset token
    await db.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return createSuccessResponse(
      { message: 'Password updated successfully' },
      'Password updated',
      200
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleValidationError(error);
    }

    return handleServerError(error);
  }
}
