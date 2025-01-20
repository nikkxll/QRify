import { NextRequest, NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import { connectToDb } from '@/db/mongodb';
import { User } from '@/models/User';
import { cookies } from 'next/headers';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

async function createToken(userId: string) {
  return new SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

/**
 * Handles user authentication operations including registration and login
 * Manages secure cookie-based session storage and user data persistence
 * 
 * @param req - Next.js request object containing authentication parameters
 * @returns JSON response with user data or error message
 */
export async function POST(req: NextRequest) {
  try {
    await connectToDb();
    const { email, password, name, action } = await req.json();

    if (action === 'register') {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return NextResponse.json(
          { error: 'Email already registered' },
          { status: 400 }
        );
      }

      const user = new User({ email, password, name });
      await user.save();

      const token = await createToken(user._id.toString());
      const cookieStore = await cookies();
      
      cookieStore.set('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: COOKIE_MAX_AGE
      });

      return NextResponse.json({
        user: {
          id: user._id,
          email: user.email,
          name: user.name
        }
      });
    }

    if (action === 'login') {
      const user = await User.findOne({ email });
      if (!user || !(await user.comparePassword(password))) {
        return NextResponse.json(
          { error: 'Invalid credentials' },
          { status: 401 }
        );
      }

      const token = await createToken(user._id.toString());
      const cookieStore = await cookies();
      
      cookieStore.set('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: COOKIE_MAX_AGE
      });

      return NextResponse.json({
        user: {
          id: user._id,
          email: user.email,
          name: user.name
        }
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}

/**
 * Handles user logout by removing the authentication cookie
 * 
 * @returns JSON response indicating successful logout
 */
export async function DELETE() {
  const cookieStore = await cookies();

  cookieStore.delete('auth_token');
  return NextResponse.json({ success: true });
}