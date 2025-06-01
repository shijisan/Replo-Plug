import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// middleware only supports edge runtime so use getToken instead of auth from lib

export async function middleware(req: NextRequest) {
  const token = await getToken({ 
    req, 
    secret: process.env.NEXTAUTH_SECRET!,
    secureCookie: process.env.NODE_ENV === "production"
  });

  if (!token) {
    return NextResponse.redirect(new URL("/auth", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*", "/dashboard/:path*"]
};