import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { decryptUserData, encryptUserData } from '@/lib/encryption-middleware';
import { generalRateLimit } from '@/lib/rate-limit';
import {
  createSuccessResponse,
  handleValidationError,
  handleServerError,
  handleAuthError,
} from '@/lib/error-handler';
import { sanitizeFormData } from '@/lib/sanitize';
import { z } from 'zod';

export const runtime = 'nodejs';

const updateProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required').optional(),
  lastName: z.string().min(1, 'Last name is required').optional(),
  company: z.string().optional(),
  taxId: z.string().optional(),
  vatId: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
  phone: z.string().optional(),
});

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return handleAuthError('Authentication required');
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        company: true,
        taxId: true,
        vatId: true,
        address: true,
        city: true,
        postalCode: true,
        country: true,
        phone: true,
        isEmailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Decrypt sensitive data before returning
    const decryptedUser = decryptUserData(user);

    return createSuccessResponse(
      { user: decryptedUser },
      'Profile retrieved successfully'
    );
  } catch (error) {
    return handleServerError(error);
  }
}

export async function PUT(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResponse = generalRateLimit(request);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    const session = await auth();

    if (!session?.user?.id) {
      return handleAuthError('Authentication required');
    }

    const body = await request.json();
    const validatedData = updateProfileSchema.parse(body);

    // Sanitize input data
    const sanitizedData = sanitizeFormData(validatedData);

    // Encrypt sensitive data before updating
    const encryptedData = encryptUserData(sanitizedData);

    const updatedUser = await db.user.update({
      where: { id: session.user.id },
      data: encryptedData as Parameters<typeof db.user.update>[0]['data'],
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        company: true,
        taxId: true,
        vatId: true,
        address: true,
        city: true,
        postalCode: true,
        country: true,
        phone: true,
        updatedAt: true,
      },
    });

    // Decrypt sensitive data before returning
    const decryptedUser = decryptUserData(updatedUser);

    return createSuccessResponse(
      { user: decryptedUser },
      'Profile updated successfully'
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleValidationError(error);
    }

    return handleServerError(error);
  }
}
