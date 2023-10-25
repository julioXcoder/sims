import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAuth } from "./lib";

const roleConfig: {
  [key: string]: {
    dashboardUrl: string;
    allowedUrls: string[];
  };
} = {
  STUDENT: {
    dashboardUrl: "/student/application/dashboard",
    allowedUrls: ["/student"],
  },
  LECTURE: {
    dashboardUrl: "/staff/lecturer/dashboard",
    allowedUrls: ["/staff/lecturer"],
  },
  EXAMINATION_OFFICER: {
    dashboardUrl: "/staff/examination_officer/dashboard",
    allowedUrls: ["/staff/examination_officer"],
  },
  // Add more roles and their configurations here
};

const pathToAuthUrl: {
  [key: string]: string;
} = {
  "/staff": "/staff/auth",
  "/student": "/student/auth",
  // Add more paths and their auth URLs here
};

const authPaths = ["/student/auth", "/staff/auth"];

export async function middleware(request: NextRequest) {
  let token = request.cookies.get("token")?.value;
  const authUser =
    token && (await verifyAuth(token).catch((ex) => console.log(ex)));

  if (authUser) {
    const userId = authUser.id.toString();
    const response = NextResponse.next();

    response.headers.set("userId", userId);

    const config = roleConfig[authUser.role];

    if (config) {
      const { dashboardUrl, allowedUrls } = config;

      if (
        authUser &&
        authPaths.some((path) => request.nextUrl.pathname.startsWith(path))
      ) {
        if (dashboardUrl) {
          return NextResponse.redirect(new URL(dashboardUrl, request.url));
        }
      }

      if (
        !allowedUrls.some(
          (url) =>
            request.nextUrl.pathname === url ||
            request.nextUrl.pathname.startsWith(url + "/"),
        )
      ) {
        return NextResponse.redirect(new URL("/error", request.url));
      }
    }

    return response;
  }

  for (const path in pathToAuthUrl) {
    if (
      request.nextUrl.pathname.startsWith(path) &&
      request.nextUrl.pathname !== pathToAuthUrl[path]
    ) {
      return NextResponse.redirect(new URL(pathToAuthUrl[path], request.url));
    }
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/student/:path*", "/staff/:path*"],
};
