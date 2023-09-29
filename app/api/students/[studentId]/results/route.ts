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
                subject: {
                  select: {
                    name: true, // select the subject name
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
                subject: {
                  select: {
                    name: true, // select the subject name
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
    // TODO: Original
    // const finalResultsByYearAndSemester = studentResults.finalResults.reduce(
    //   (acc: Record<string, any>, finalResult) => {
    //     const year = finalResult.subjectInstance.semester.academicYear.year;
    //     const semester = finalResult.subjectInstance.semester.name;
    //     const subjectName = finalResult.subjectInstance.subject.name;

    //     if (!acc[year]) {
    //       acc[year] = {};
    //     }

    //     if (!acc[year][semester]) {
    //       acc[year][semester] = {
    //         results: [],
    //       };
    //     }

    //     const picked = _.pick(finalResult, ["marks"]);

    //     // If the subject does not exist in the results array, add it
    //     // This time, we're not wrapping `picked` in an array
    //     acc[year][semester].results.push({ [subjectName]: picked });

    //     return acc;
    //   },
    //   {},
    // );

    const finalResultsByYearAndSemester = studentResults.finalResults.reduce(
      (acc: Record<string, any>, finalResult) => {
        const year = finalResult.subjectInstance.semester.academicYear.year;
        const semester = finalResult.subjectInstance.semester.name;
        const subjectName = finalResult.subjectInstance.subject.name;

        if (!acc.years) {
          acc.years = [];
        }

        let yearObj = acc.years.find((y: any) => y.year === year);
        if (!yearObj) {
          yearObj = { year, semesters: [] };
          acc.years.push(yearObj);
        }

        let semesterObj = yearObj.semesters.find(
          (s: any) => s.semester === semester,
        );
        if (!semesterObj) {
          semesterObj = { semester, results: {} };
          yearObj.semesters.push(semesterObj);
        }

        const picked = {
          marks: finalResult.marks,
        };

        // If the subject does not exist in the results object, add it
        semesterObj.results[subjectName] = picked;

        return acc;
      },
      { years: [] },
    );

    //-------------------------------------------------

    // TODO: Original
    // const CAResultsByYearAndSemester = studentResults.CAResults.reduce(
    //   (acc: Record<string, any>, CAResult) => {
    //     const year = CAResult.subjectInstance.semester.academicYear.year;
    //     const semester = CAResult.subjectInstance.semester.name;
    //     const subjectName = CAResult.subjectInstance.subject.name;

    //     if (!acc[year]) {
    //       acc[year] = {};
    //     }

    //     if (!acc[year][semester]) {
    //       acc[year][semester] = {
    //         results: [],
    //       };
    //     }

    //     const subjectIndex = acc[year][semester].results.findIndex(
    //       (result: any) => Object.keys(result)[0] === subjectName,
    //     );

    //     const picked = _.pick(CAResult, ["marks", "component.name"]);

    //     if (subjectIndex === -1) {
    //       // If the subject does not exist in the results array, add it
    //       acc[year][semester].results.push({ [subjectName]: [picked] });
    //     } else {
    //       // If the subject exists in the results array, push the new result into it
    //       acc[year][semester].results[subjectIndex][subjectName].push(picked);
    //     }

    //     return acc;
    //   },
    //   {},
    // );

    const CAResultsByYearAndSemester = studentResults.CAResults.reduce(
      (acc: Record<string, any>, CAResult) => {
        const year = CAResult.subjectInstance.semester.academicYear.year;
        const semester = CAResult.subjectInstance.semester.name;
        const subjectName = CAResult.subjectInstance.subject.name;

        if (!acc.years) {
          acc.years = [];
        }

        let yearObj = acc.years.find((y: any) => y.year === year);
        if (!yearObj) {
          yearObj = { year, semesters: [] };
          acc.years.push(yearObj);
        }

        let semesterObj = yearObj.semesters.find(
          (s: any) => s.semester === semester,
        );
        if (!semesterObj) {
          semesterObj = { semester, results: [] };
          yearObj.semesters.push(semesterObj);
        }

        const picked = {
          marks: CAResult.marks,
          name: CAResult.component.name,
        };

        const subjectIndex = semesterObj.results.findIndex(
          (result: any) => result.subject === subjectName,
        );

        if (subjectIndex === -1) {
          // If the subject does not exist in the results array, add it
          semesterObj.results.push({
            subject: subjectName,
            results: [picked],
          });
        } else {
          // If the subject exists in the results array, push the new result into it
          semesterObj.results[subjectIndex].results.push(picked);
        }

        return acc;
      },
      { years: [] },
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
