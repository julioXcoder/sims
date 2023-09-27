import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

interface Props {
  params: { studentId: string };
}

export async function GET(
  request: NextRequest,
  { params: { studentId } }: Props,
) {
  try {
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
            {
              subjectInstance: { semester: { academicYear: { year: "asc" } } },
            },
            { subjectInstance: { semester: { name: "asc" } } },
          ],
          select: {
            marks: true,
            subjectInstance: {
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
            {
              subjectInstance: { semester: { academicYear: { year: "asc" } } },
            },
            { subjectInstance: { semester: { name: "asc" } } },
          ],
          select: {
            marks: true,
            component: {
              select: {
                name: true,
              },
            },
            subjectInstance: {
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

    if (!studentResults) {
      return NextResponse.json(
        { error: "Student results not found" },
        { status: 404 },
      );
    }

    // Transform the data
    const resultsByYearAndSemester = studentResults.finalResults.reduce(
      (acc: Record<string, any>, finalResult) => {
        const year = finalResult.subjectInstance.semester.academicYear.year;
        const semester = finalResult.subjectInstance.semester.name;

        if (!acc[year]) {
          acc[year] = {};
        }

        if (!acc[year][semester]) {
          acc[year][semester] = {
            finals: [],
            CA: [],
          };
        }

        acc[year][semester].finals.push(finalResult);

        const caResults = studentResults.CAResults.filter(
          (caResult) => caResult.subjectInstance.semester.name === semester,
        );

        acc[year][semester].CA.push(...caResults);

        return acc;
      },
      {},
    );

    return NextResponse.json(resultsByYearAndSemester, { status: 200 });
  } catch (ex) {
    // TODO: Log the console.error();

    return NextResponse.json(
      { error: "An error occurred while processing your request" },
      { status: 500 },
    );
  }
}
