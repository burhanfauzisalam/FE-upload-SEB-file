import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export async function middleware(request) {
  const token = request.cookies.get("token");

  const url = request.nextUrl.clone();

  if (url.pathname.startsWith("/dashboard")) {
    // If the request is for a teacher path
    if (!token) {
      // If not authenticated as a teacher, redirect to login
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // If the request is for the login path
  if (url.pathname.startsWith("/login")) {
    // If already authenticated as a teacher, redirect to the teacher dashboard
    if (token) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // Allow the request to proceed if no redirects are needed
  return NextResponse.next();
}
