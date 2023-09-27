import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { departmentSchema } from "@/types/schemas";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = departmentSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid department Data" },
        { status: 400 },
      );
    }

    const { name } = body;
    const newDepartment = await prisma.department.create({
      data: {
        name,
      },
    });

    return NextResponse.json(newDepartment, { status: 201 });
  } catch (ex) {
    // TODO: Log the console.error();

    return NextResponse.json(
      { error: "An error occurred while processing your request" },
      { status: 500 },
    );
  }
}
