import { NextRequest, NextResponse } from 'next/server';
import { connectToDb } from '@/db/mongodb';
import { User } from '@/models/User';
import { authenticateUser } from '@/middleware/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await authenticateUser(req);
    
    if (!user?.userId) {
      return NextResponse.json({ user: null });
    }

    await connectToDb();
    const dbUser = await User.findById(user.userId).select('email name');

    if (!dbUser) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({
      user: {
        id: dbUser._id,
        email: dbUser.email,
        name: dbUser.name
      }
    });

  } catch (error) {
    console.error('Auth check failed:', error);
    return NextResponse.json({ user: null });
  }
}