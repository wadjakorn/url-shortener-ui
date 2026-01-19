import { NextRequest, NextResponse, NextFetchEvent } from 'next/server';

export const config = {
  matcher: [
    '/open/:path*',
  ],
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export async function middleware(req: NextRequest, event: NextFetchEvent) {
  const { pathname, searchParams } = req.nextUrl;

  // Extract Short Code
  // Supports /open/code and /u/code
  const parts = pathname.split('/');
  const code = parts[parts.length - 1];

  if (!code) return NextResponse.next();

  try {
    // 1. Fetch Destination (Cached by Vercel Edge)
    const linkRes = await fetch(`${API_BASE_URL}/api/v1/public/links/${code}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 31536000 } // Force cache for 1 year
    });

    if (!linkRes.ok) {
        // If link not found, let the Next.js app handle the 404 page
        return NextResponse.next();
    }

    const link = await linkRes.json();
    const destination = link.original_url;

    if (!destination) {
        return NextResponse.next();
    }

    // 2. Fire Tracking Event (Background)
    const trackUrl = `${API_BASE_URL}/api/v1/public/links/${code}/track`;
    const referer = req.headers.get('referer') || '';
    const customRef = searchParams.get('custom_ref');
    
    // We send the tracking request but do NOT await it.
    // event.waitUntil() keeps the lambda alive until this finishes.
    event.waitUntil(
        fetch(trackUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                custom_ref: customRef || referer 
            })
        }).catch(err => console.error("Tracking failed", err))
    );

    // 3. Instant Redirect
    return NextResponse.redirect(destination, 307);

  } catch (error) {
    console.error("Middleware Error", error);
    // Fallback to application handling
    return NextResponse.next();
  }
}
