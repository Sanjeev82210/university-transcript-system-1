import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { teacher } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, userId } = body;

    // Validate required fields
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json(
        { 
          error: 'Name is required and must be a non-empty string',
          code: 'MISSING_NAME' 
        },
        { status: 400 }
      );
    }

    if (!email || typeof email !== 'string' || email.trim() === '') {
      return NextResponse.json(
        { 
          error: 'Email is required and must be a non-empty string',
          code: 'MISSING_EMAIL' 
        },
        { status: 400 }
      );
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { 
          error: 'Invalid email format',
          code: 'INVALID_EMAIL_FORMAT' 
        },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedEmail = email.trim().toLowerCase();
    const sanitizedName = name.trim();

    // Check for duplicate email
    const existingTeacher = await db.select()
      .from(teacher)
      .where(eq(teacher.email, sanitizedEmail))
      .limit(1);

    if (existingTeacher.length > 0) {
      return NextResponse.json(
        { 
          error: 'A teacher with this email already exists',
          code: 'DUPLICATE_EMAIL' 
        },
        { status: 400 }
      );
    }

    // Create new teacher
    const newTeacher = await db.insert(teacher)
      .values({
        name: sanitizedName,
        email: sanitizedEmail,
        userId: userId || null,
        createdAt: new Date().toISOString()
      })
      .returning();

    return NextResponse.json(newTeacher[0], { status: 201 });

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const teachers = await db.select().from(teacher);
    
    return NextResponse.json(teachers, { status: 200 });

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
      },
      { status: 500 }
    );
  }
}