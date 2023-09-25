import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

interface Props {
  params: { studentId: string };
}

export async function GET(
  request: NextRequest,
  { params: { studentId } }: Props,
) {
  const student = await prisma.student.findUnique({
    where: {
      id: parseInt(studentId),
    },
  });

  if (!student) {
    return NextResponse.json({ error: "Student Not Found" }, { status: 404 });
  }

  const studentResults = await prisma.student.findUnique({
    where: {
      id: student.id,
    },
    include: {
      finalResults: {
        orderBy: [
          { courseInstance: { semester: { academicYear: { year: "asc" } } } },
          { courseInstance: { semester: { name: "asc" } } },
        ],
        select: {
          marks: true,
          courseInstance: {
            select: {
              semester: {
                select: {
                  name: true,
                  academicYear: {
                    select: {
                      year: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
      CAResults: {
        orderBy: [
          { courseInstance: { semester: { academicYear: { year: "asc" } } } },
          { courseInstance: { semester: { name: "asc" } } },
        ],
        select: {
          marks: true,
          component: {
            select: {
              name: true,
            },
          },
          courseInstance: {
            select: {
              semester: {
                select: {
                  name: true,
                  academicYear: {
                    select: {
                      year: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  return NextResponse.json(studentResults, { status: 200 });
}
