import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAuth } from "./lib";
import { headers } from "next/headers";

export async function middleware(request: NextRequest) {
  let token = request.cookies.get("token")?.value;
  const authUser =
    token && (await verifyAuth(token).catch((ex) => console.log(ex)));

  if (authUser) {
    const userId = authUser.id.toString();
    const response = NextResponse.next();

    response.headers.set("userId", userId);

    if (authUser && request.url.includes("/auth")) {
      if (authUser.role === "STUDENT") {
        return NextResponse.redirect(
          new URL("/student/dashboard", request.url),
        );
      } else if (authUser.role === "STAFF") {
        return NextResponse.redirect(new URL("/staff/dashboard", request.url));
      } else if (authUser.role === "STAFF") {
        return NextResponse.redirect(new URL("/staff/dashboard", request.url));
      }
    }

    return response;
  }

  if (request.nextUrl.pathname.startsWith("/auth") && !authUser) return;

  if (!authUser) return NextResponse.redirect(new URL("/auth", request.url));
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/student/:path*", "/auth"],
};
