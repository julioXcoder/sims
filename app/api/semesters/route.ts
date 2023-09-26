import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import z from "zod";
import _ from "lodash";

const CourseInstanceSchema = z.object({
  courseId: z.number(),
  lecturerId: z.number(),
});

const BodySchema = z.object({
  name: z.string(),
  academicYearId: z.number(),
  courses: z.array(CourseInstanceSchema),
});

type Body = z.infer<typeof BodySchema>;

export async function GET(request: NextRequest) {
  try {
    const academicYears = await prisma.academicYear.findMany({
      include: {
        semesters: true,
      },
    });

    return NextResponse.json(academicYears, { status: 200 });
  } catch (ex) {
    // TODO: Log the console.error();

    return NextResponse.json(
      { error: "An error occurred while processing your request" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: Body = await request.json();

    const validation = BodySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const { name, academicYearId, courses } = body;

    const academicYear = await prisma.academicYear.findUnique({
      where: {
        id: academicYearId,
      },
    });

    if (!academicYear) {
      return NextResponse.json(
        { error: "Academic year Not Found" },
        { status: 404 },
      );
    }

    const lecturerData = await prisma.staff.findMany({
      where: {
        id: {
          in: body.courses.map((course) => course.lecturerId),
        },
      },
    });

    if (lecturerData.length !== body.courses.length) {
      return NextResponse.json(
        { error: "One or more lecturers not found" },
        { status: 404 },
      );
    }

    // Check if all courses exist
    const courseData = await prisma.course.findMany({
      where: {
        id: {
          in: courses.map((course) => course.courseId),
        },
      },
    });

    if (courseData.length !== body.courses.length) {
      return NextResponse.json(
        { error: "One or more courses not found" },
        { status: 404 },
      );
    }

    const newSemester = await prisma.semester.create({
      data: {
        name: name,
        academicYearId: academicYear.id,
      },
    });

    // Create new course instances for the semester
    await prisma.courseInstance.createMany({
      data: courses.map((course) => ({
        ...course,
        semesterId: newSemester.id,
      })),
    });

    const semesterData = _.pick(newSemester, ["id", "name"]);

    return NextResponse.json(semesterData, { status: 201 });
  } catch (ex) {
    // TODO: Log the console.error();

    return NextResponse.json(
      { error: "An error occurred while processing your request" },
      { status: 500 },
    );
  }
}
