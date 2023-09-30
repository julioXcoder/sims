import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAuth } from "./lib";
import { headers } from "next/headers";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  let token = request.cookies.get("token")?.value;
  const authUser =
    token && (await verifyAuth(token).catch((ex) => console.log(ex)));

  if (authUser) {
    const userId = authUser.id.toString();
    const response = NextResponse.next();

    response.headers.set("userDd", userId);
    return response;
  }

  if (request.nextUrl.pathname.startsWith("/auth") && !authUser) return;

  if (request.url.includes("/auth") && authUser) {
    return NextResponse.redirect(new URL("/student", request.url));
  }

  if (!authUser) return NextResponse.redirect(new URL("/auth", request.url));
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/student", "/auth", "/api"],
};
