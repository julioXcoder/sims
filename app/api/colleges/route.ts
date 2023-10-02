import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { collegeSchema } from "@/types/schemas";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = collegeSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid college Data" },
        { status: 400 },
      );
    }

    const { name } = body;

    const newCollege = await prisma.college.create({
      data: {
        name,
      },
    });

    return NextResponse.json(newCollege, { status: 201 });
  } catch (ex) {
    // TODO: Log the console.error();

    return NextResponse.json(
      { error: "An error occurred while processing your request" },
      { status: 500 },
    );
  }
}
