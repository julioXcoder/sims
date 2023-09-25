import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { studentSchema } from "@/types/schemas";
import _ from "lodash";

export async function POST(request: NextRequest) {
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

  const pickedStudent = _.pick(newStudent, ["id", "firstName", "lastName"]);

  return NextResponse.json(pickedStudent, { status: 201 });
}
