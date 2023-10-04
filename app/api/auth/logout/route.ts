import { NextRequest, NextResponse } from "next/server";
import { redirect } from "next/navigation";

import { cookies } from "next/headers";

export function GET(request: NextRequest) {
  cookies().set("token", "");

  if (request.nextUrl.pathname.startsWith("/student")) {
    return redirect("/student/auth");
  } else if (request.nextUrl.pathname.startsWith("/staff")) {
    return redirect("/staff/auth");
  }

  return redirect("/");
}
