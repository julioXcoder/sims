import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import z from "zod";

const BodySchema = z.object({
  marks: z.number(),
  studentId: z.number(),
  componentId: z.number(),
  courseInstanceId: z.number(),
});

type Body = z.infer<typeof BodySchema>;

export async function POST(request: NextRequest) {
  try {
    const body: Body = await request.json();

    const validation = BodySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const { studentId, componentId, courseInstanceId } = body;

    const student = await prisma.student.findUnique({
      where: {
        id: studentId,
      },
    });

    if (!student) {
      return NextResponse.json({ error: "Student Not Found" }, { status: 404 });
    }

    const component = await prisma.cAComponent.findUnique({
      where: {
        id: componentId,
      },
    });

    if (!component) {
      return NextResponse.json(
        { error: "CA component Not Found" },
        { status: 404 },
      );
    }

    const courseInstance = await prisma.courseInstance.findUnique({
      where: {
        id: courseInstanceId,
      },
    });

    if (!courseInstance) {
      return NextResponse.json(
        { error: "Course Instance Not Found" },
        { status: 404 },
      );
    }

    const newCAResult = await prisma.cAResult.create({
      data: body,
    });

    return NextResponse.json(newCAResult, { status: 201 });
  } catch (ex) {
    // TODO: Log the console.error();

    return NextResponse.json(
      { error: "An error occurred while processing your request" },
      { status: 500 },
    );
  }
}
