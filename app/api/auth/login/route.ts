import { connectToDatabase } from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const { email, password } = await req.json();

    // Find admin with matching credentials
    const admin = await db.collection('admins').findOne({ email, password });

    if (!admin) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { id: admin._id, email: admin.email },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to login' },
      { status: 500 }
    );
  }
}
