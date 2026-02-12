import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  try {
    return await updateSession(request);
  } catch (error) {
    // Log the actual error
    console.error('=== MIDDLEWARE ERROR ===');
    console.error('Path:', request.nextUrl.pathname);
    console.error('Error:', error);
    console.error('Message:', error instanceof Error ? error.message : String(error));
    console.error('Stack:', error instanceof Error ? error.stack : 'No stack');
    
    // Don't fail completely, just pass through
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};