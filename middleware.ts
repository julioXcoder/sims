import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAuth } from "./lib";

export async function middleware(request: NextRequest) {
  let token = request.cookies.get("token")?.value;
  const authUser =
    token && (await verifyAuth(token).catch((ex) => console.log(ex)));

  if (authUser) {
    const userId = authUser.id.toString();
    const response = NextResponse.next();

    response.headers.set("userId", userId);

    if (
      authUser &&
      (request.nextUrl.pathname.startsWith("/staff/auth") ||
        request.nextUrl.pathname.startsWith("/student/auth"))
    ) {
      // Redirect to the user's dashboard or previous page
      if (authUser.role === "STUDENT") {
        return NextResponse.redirect(
          new URL("/student/application/dashboard", request.url),
        );
      } else if (authUser.role === "LECTURE") {
        return NextResponse.redirect(
          new URL("/staff/lecturer/dashboard", request.url),
        );
      } else if (authUser.role === "EXAMINATION_OFFICER") {
        return NextResponse.redirect(
          new URL("/staff/staff/examination_officer/dashboard", request.url),
        );
      }
    }

    if (
      (authUser.role === "LECTURE" && request.url.includes("/student")) ||
      (authUser.role === "STUDENT" && request.url.includes("/staff"))
    ) {
      return NextResponse.redirect(new URL("/error", request.url));
    }

    return response;
  }

  if (
    (request.nextUrl.pathname.startsWith("/student/auth") ||
      request.nextUrl.pathname.startsWith("/staff/auth")) &&
    !authUser
  )
    return;

  if (!authUser) {
    if (request.nextUrl.pathname.startsWith("/staff")) {
      return NextResponse.redirect(new URL("/staff/auth", request.url));
    } else if (request.nextUrl.pathname.startsWith("/student")) {
      return NextResponse.redirect(new URL("/student/auth", request.url));
    }
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/student/:path*", "/staff/:path*"],
};
