import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAuth } from "./lib";
import { headers } from "next/headers";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  let token = request.cookies.get("token")?.value;
  const verified =
    token && (await verifyAuth(token).catch((ex) => console.log(ex)));

  if (request.nextUrl.pathname.startsWith("/auth") && !verified) return;

  if (request.url.includes("/auth") && verified) {
    return NextResponse.redirect(new URL("/student", request.url));
  }

  if (!verified) return NextResponse.redirect(new URL("/auth", request.url));
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/student", "/auth", "/api"],
};
