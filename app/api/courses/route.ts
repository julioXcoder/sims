import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { courseSchema } from "@/types/schemas";
import _ from "lodash";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validation = courseSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid course data" },
        { status: 400 },
      );
    }

    const { name, maxAssessmentMarks, finalMarks } = body;

    const newCourse = await prisma.course.create({
      data: {
        name,
        maxAssessmentMarks,
        finalMarks,
      },
    });

    const courseData = _.pick(newCourse, [
      "id",
      "name",
      "maxAssessmentMarks",
      "finalMarks",
    ]);

    return NextResponse.json(courseData, { status: 201 });
  } catch (ex) {
    // TODO: Log the console.error();

    return NextResponse.json(
      { error: "An error occurred while processing your request" },
      { status: 500 },
    );
  }
}
