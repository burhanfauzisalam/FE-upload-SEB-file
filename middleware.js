import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export async function middleware(request) {
  const token = request.cookies.get("token");
  const session_s = request.cookies.get("id-student");

  const url = request.nextUrl.clone();

  if (url.pathname.startsWith("/teacher")) {
    // If the request is for a teacher path
    if (!token) {
      // If not authenticated as a teacher, redirect to login
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // If the request is for a student path
  if (url.pathname.startsWith("/student")) {
    if (!session_s) {
      // If not authenticated as a student, redirect to login
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // If the request is for the login path
  if (url.pathname.startsWith("/login")) {
    // If already authenticated as a teacher, redirect to the teacher dashboard
    if (token) {
      return NextResponse.redirect(new URL("/teacher", request.url));
    }
    // If already authenticated as a student, redirect to the student dashboard
    if (session_s) {
      return NextResponse.redirect(new URL("/student", request.url));
    }
  }

  // Allow the request to proceed if no redirects are needed
  return NextResponse.next();
}
