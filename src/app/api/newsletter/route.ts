import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Validate email
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Check if already subscribed
    const existingSubscriber = await prisma.subscriber.findUnique({
      where: { email: trimmedEmail },
    });

    if (existingSubscriber) {
      return NextResponse.json(
        {
          success: true,
          message: 'Email already subscribed to newsletter',
          email: trimmedEmail,
        },
        { status: 200 }
      );
    }

    // Create new subscriber
    const subscriber = await prisma.subscriber.create({
      data: {
        email: trimmedEmail,
        verified: false,
      },
    });

    console.log(`Newsletter subscription: ${trimmedEmail}`);

    return NextResponse.json(
      {
        success: true,
        message: 'Successfully subscribed to newsletter',
        email: subscriber.email,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe to newsletter' },
      { status: 500 }
    );
  }
}

// Optional: Add GET endpoint for testing
export async function GET() {
  return NextResponse.json(
    { message: 'Newsletter API endpoint' },
    { status: 200 }
  );
}
