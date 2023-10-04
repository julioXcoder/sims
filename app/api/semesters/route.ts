import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import z from "zod";
import _ from "lodash";

const SubjectInstanceSchema = z.object({
  subjectId: z.number(),
  lecturerId: z.number(),
});

const BodySchema = z.object({
  name: z.string(),
  academicYearId: z.number(),
  subjects: z.array(SubjectInstanceSchema),
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

    const students = await prisma.student.findMany();

    if (!validation.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const { name, academicYearId, subjects } = body;

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
          in: body.subjects.map((subject) => subject.lecturerId),
        },
      },
    });

    if (lecturerData.length !== body.subjects.length) {
      return NextResponse.json(
        { error: "One or more lecturers not found" },
        { status: 404 },
      );
    }

    // Check if all subjects exist
    const subjectData = await prisma.subject.findMany({
      where: {
        id: {
          in: subjects.map((subject) => subject.subjectId),
        },
      },
    });

    if (subjectData.length !== body.subjects.length) {
      return NextResponse.json(
        { error: "One or more subjects not found" },
        { status: 404 },
      );
    }

    const newSemester = await prisma.semester.create({
      data: {
        name: name,
        academicYearId: academicYear.id,
      },
    });

    // Create new subject instances for the semester
    for (const subject of subjects) {
      const newSubjectInstance = await prisma.subjectInstance.create({
        data: {
          ...subject,
          semesterId: newSemester.id,
        },
      });

      // For each new SubjectInstance, create a FinalResult record for each student
      for (const student of students) {
        await prisma.finalResult.create({
          data: {
            marks: null,
            studentYearId: student.id, // Connect the FinalResult to the StudentYear
            subjectInstanceId: newSubjectInstance.id, // Connect the FinalResult to the SubjectInstance
          },
        });
      }
    }

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
