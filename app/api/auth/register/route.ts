import { connectToDatabase } from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const { email, password } = await req.json();

    // Check if admin already exists
    const existingAdmin = await db.collection('admins').findOne({ email });
    if (existingAdmin) {
      return NextResponse.json(
        { error: 'Admin account already exists' },
        { status: 400 }
      );
    }

    // Create new admin
    const result = await db.collection('admins').insertOne({
      email,
      password, // In production, this should be hashed
      createdAt: new Date(),
    });

    return NextResponse.json(
      { id: result.insertedId, email },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to register admin' },
      { status: 500 }
    );
  }
}
