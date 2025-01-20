import { NextResponse } from 'next/server';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const REDIRECT_URI = `${process.env.BASE_URL}/api/auth/google/callback`;

/**
 * Initializes the Google OAuth authentication flow
 * This endpoint generates a state parameter for CSRF protection and
 * redirects the user to Google's authentication page
 * 
 * @returns Redirects to Google's OAuth consent screen with required parameters
 */
export async function GET() {
  const state = Math.random().toString(36).substring(7);
  
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    scope: 'email profile',
    state,
    prompt: 'select_account',
  });

  const response = NextResponse.redirect(`${GOOGLE_AUTH_URL}?${params.toString()}`);
  response.cookies.set('oauth_state', state, { 
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 10
  });

  return response;
}