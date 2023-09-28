import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import _ from "lodash";

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
    const finalResultsByYearAndSemester = studentResults.finalResults.reduce(
      (acc: Record<string, any>, finalResult) => {
        const year = finalResult.subjectInstance.semester.academicYear.year;
        const semester = finalResult.subjectInstance.semester.name;

        if (!acc[year]) {
          acc[year] = {};
        }

        if (!acc[year][semester]) {
          acc[year][semester] = {
            results: [],
          };
        }

        acc[year][semester].results.push(finalResult);

        return acc;
      },
      {},
    );

    const CAResultsByYearAndSemester = studentResults.CAResults.reduce(
      (acc: Record<string, any>, CAResult) => {
        const year = CAResult.subjectInstance.semester.academicYear.year;
        const semester = CAResult.subjectInstance.semester.name;

        if (!acc[year]) {
          acc[year] = {};
        }

        if (!acc[year][semester]) {
          acc[year][semester] = {
            results: [],
          };
        }

        const picked = _.pick(CAResult, ["marks", "component.name"]);

        acc[year][semester].results.push(picked);

        return acc;
      },
      {},
    );

    return NextResponse.json(
      { CA: CAResultsByYearAndSemester, finals: finalResultsByYearAndSemester },
      { status: 200 },
    );
  } catch (ex) {
    // TODO: Log the console.error();

    return NextResponse.json(
      { error: "An error occurred while processing your request" },
      { status: 500 },
    );
  }
}
