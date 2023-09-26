import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { studentSchema } from "@/types/schemas";
import _ from "lodash";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validation = studentSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid Student Data" },
        { status: 400 },
      );
    }

    const { firstName, lastName, password } = body;

    const newStudent = await prisma.student.create({
      data: {
        firstName,
        lastName,
        password,
        roles: {
          create: {
            role: {
              connect: {
                name: "STUDENT",
              },
            },
          },
        },
      },
    });

    const studentData = _.pick(newStudent, ["id", "firstName", "lastName"]);

    return NextResponse.json(studentData, { status: 201 });
  } catch (ex) {
    // TODO: Log the console.error();

    return NextResponse.json(
      { error: "An error occurred while processing your request" },
      { status: 500 },
    );
  }
}
