import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { academicYearSchema } from "@/types/schemas";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validation = academicYearSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid Academic Year Data" },
        { status: 400 },
      );
    }

    const { year } = body;

    const newAcademicYear = await prisma.academicYear.create({
      data: {
        year,
      },
    });

    return NextResponse.json(newAcademicYear, { status: 201 });
  } catch (ex) {
    // TODO: Log the console.error();

    return NextResponse.json(
      { error: "An error occurred while processing your request" },
      { status: 500 },
    );
  }
}
