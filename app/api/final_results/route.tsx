import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import z from "zod";

const BodySchema = z.object({
  marks: z.number(),
  studentId: z.number(),
  subjectInstanceId: z.number(),
});

type Body = z.infer<typeof BodySchema>;

export async function POST(request: NextRequest) {
  try {
    const body: Body = await request.json();

    const validation = BodySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const { marks, studentId, subjectInstanceId } = body;

    const student = await prisma.student.findUnique({
      where: {
        id: studentId,
      },
    });

    if (!student) {
      return NextResponse.json({ error: "Student Not Found" }, { status: 404 });
    }

    const subjectInstance = await prisma.subjectInstance.findUnique({
      where: {
        id: subjectInstanceId,
      },
    });

    if (!subjectInstance) {
      return NextResponse.json(
        { error: "Subject Instance Not Found" },
        { status: 404 },
      );
    }

    const newFinalResult = await prisma.finalResult.create({
      data: {
        marks,
        studentId: student.id,
        subjectInstanceId: subjectInstance.id,
      },
    });

    return NextResponse.json(newFinalResult, { status: 201 });
  } catch (ex) {
    // TODO: Log the console.error();

    return NextResponse.json(
      { error: "An error occurred while processing your request" },
      { status: 500 },
    );
  }
}
