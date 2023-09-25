import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { studentRoleSchema } from "@/types/schemas";

interface Props {
  params: { studentId: string };
}

export async function POST(
  request: NextRequest,
  { params: { studentId } }: Props,
) {
  const body = await request.json();

  const validation = studentRoleSchema.safeParse(body);

  const student = await prisma.student.findUnique({
    where: {
      id: parseInt(studentId),
    },
  });

  if (!student) {
    return NextResponse.json({ error: "Student Not Found" }, { status: 404 });
  }

  if (!validation.success) {
    return NextResponse.json(
      { error: "Invalid Student Role" },
      { status: 400 },
    );
  }

  const newStudent = await prisma.student.update({
    where: { id: student.id },
    data: {
      roles: {
        create: {
          role: {
            connect: {
              name: body.role,
            },
          },
        },
      },
    },
  });

  return NextResponse.json("OK", { status: 200 });
}
