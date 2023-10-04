import { NextRequest, NextResponse } from "next/server";
import { redirect } from "next/navigation";

import { cookies } from "next/headers";

export function GET(request: NextRequest) {
  cookies().set("token", "");

  return redirect("/student/auth");
}
