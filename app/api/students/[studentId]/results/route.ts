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

    if (!studentResults) {
      return NextResponse.json(
        { error: "Student results not found" },
        { status: 404 },
      );
    }

    // Transform the data
    const resultsByYearAndSemester = studentResults.finalResults.reduce(
      (acc: Record<string, any>, finalResult) => {
        const year = finalResult.courseInstance.semester.academicYear.year;
        const semester = finalResult.courseInstance.semester.name;

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
          (caResult) => caResult.courseInstance.semester.name === semester,
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
