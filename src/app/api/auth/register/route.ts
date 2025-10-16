import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword } from '@/lib/encryption';
import { encryptUserData } from '@/lib/encryption-middleware';
import { authRateLimit } from '@/lib/rate-limit';
import {
  createSuccessResponse,
  handleValidationError,
  handleServerError,
} from '@/lib/error-handler';
import { z } from 'zod';

export const runtime = 'nodejs';

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  company: z.string().optional(),
});

export async function POST(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResponse = authRateLimit(request);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    const body = await request.json();
    const validatedData = registerSchema.parse(body);

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          error: 'User with this email already exists',
          code: 'USER_EXISTS',
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(validatedData.password);

    // Create user with encrypted sensitive data
    const userData = {
      email: validatedData.email,
      password: hashedPassword,
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      company: validatedData.company,
      isEmailVerified: false, // Will be verified via email
    };

    const encryptedUserData = encryptUserData(userData);
    const user = await db.user.create({
      data: encryptedUserData as Parameters<typeof db.user.create>[0]['data'],
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        company: true,
        createdAt: true,
      },
    });

    // Send verification email
    try {
      const verificationResponse = await fetch(
        `${process.env.NEXTAUTH_URL}/api/auth/verify-email`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: user.email }),
        }
      );

      if (!verificationResponse.ok) {
        console.error('Failed to send verification email');
      }
    } catch (error) {
      console.error('Error sending verification email:', error);
    }

    return createSuccessResponse(
      {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          company: user.company,
        },
      },
      'User created successfully',
      201
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleValidationError(error);
    }

    return handleServerError(error);
  }
}
