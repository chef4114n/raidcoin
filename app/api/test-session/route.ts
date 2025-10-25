import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    console.log('=== SESSION TEST API ===');
    console.log('Request headers:', Object.fromEntries(request.headers.entries()));
    
    const session = await getServerSession(authOptions);
    console.log('Raw session:', session);
    
    return NextResponse.json({
      hasSession: !!session,
      hasUser: !!session?.user,
      hasEmail: !!session?.user?.email,
      userEmail: session?.user?.email,
      fullSession: session
    });
  } catch (error) {
    console.error('Session test error:', error);
    return NextResponse.json({ error: 'Session test failed', details: error }, { status: 500 });
  }
}