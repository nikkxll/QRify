import { NextResponse } from 'next/server';
import { connectToDb } from '@/db/mongodb';
import { User } from '@/models/User';
import { authenticateUser } from '@/middleware/auth';

/**
 * Endpoint to check user's authentication status and retrieve basic profile information
 * This handler validates the user's authentication token and returns their profile data
 * if they are successfully authenticated
 * 
 * @returns JSON response containing user data or null if not authenticated
 */
export async function GET() {
  try {
    const user = await authenticateUser();
    
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