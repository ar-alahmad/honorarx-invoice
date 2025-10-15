import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { decryptUserData, encryptUserData } from '@/lib/encryption-middleware';
import { z } from 'zod';

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
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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

    return NextResponse.json({ user: decryptedUser });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    console.log('Profile update request body:', body);

    const validatedData = updateProfileSchema.parse(body);
    console.log('Validated data:', validatedData);

    // Encrypt sensitive data before updating
    const encryptedData = encryptUserData(validatedData);
    console.log('Encrypted data:', encryptedData);

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

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: decryptedUser,
    });
  } catch (error) {
    console.error('Profile update error:', error);

    if (error instanceof z.ZodError) {
      console.error('Validation error details:', error.issues);
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
