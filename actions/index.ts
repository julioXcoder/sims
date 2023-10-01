"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/prisma/client";
import {
  Data,
  GetStudentCAResultsResponse,
  GetStudentFinalResultsResponse,
  FinalsSemester,
  CASemester,
} from "@/types";
import _ from "lodash";

const headersList = headers();
const userId = headersList.get("userId");

const getStudentData = async () => {
  if (!userId) return redirect("/auth");
  try {
    const student = await prisma.student.findUnique({
      where: {
        id: parseInt(userId),
      },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!student) throw new Error("Student not found");

    const data = {
      ..._.pick(student, ["id", "firstName", "lastName"]),
      roles: student.roles.map((studentRole) => studentRole.role.name),
    };

    return data;
  } catch (ex) {
    console.error(ex); // Log the error
    throw new Error("An error occurred while fetching student data");
  }
};

const getStudentResults = async () => {
  if (!userId) return redirect("/auth");

  try {
    const student = await prisma.student.findUnique({
      where: {
        id: parseInt(userId),
      },
    });

    if (!student) throw new Error("Student Not Found");

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

    if (!studentResults) return {};

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

    return {
      CA: CAResultsByYearAndSemester,
      finals: finalResultsByYearAndSemester,
    };
  } catch (ex) {
    console.error(ex); // Log the error
    throw new Error("An error occurred while fetching student data");
  }
};

const getStudentCAResults = async (): Promise<GetStudentCAResultsResponse> => {
  if (!userId) return { error: "Id Not Found" };

  try {
    const student = await prisma.student.findUnique({
      where: {
        id: parseInt(userId),
      },
    });

    if (!student) return { error: "Student not found" };

    const studentCAResults = await prisma.student.findUnique({
      where: {
        id: student.id,
      },
      include: {
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
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!studentCAResults) return { data: { years: [] } };

    const CAResultsByYearAndSemester = studentCAResults.CAResults.reduce(
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

    return { data: CAResultsByYearAndSemester as Data<CASemester> };
  } catch (ex) {
    console.error(ex);
    return { error: "An error occurred while fetching student CA data" };
  }
};

const getStudentFinalResults =
  async (): Promise<GetStudentFinalResultsResponse> => {
    if (!userId) return { error: "Id Not Found" };

    try {
      const student = await prisma.student.findUnique({
        where: {
          id: parseInt(userId),
        },
      });

      if (!student) return { error: "Student Not Found" };

      const studentFinalResults = await prisma.student.findUnique({
        where: {
          id: student.id,
        },
        include: {
          finalResults: {
            orderBy: [
              {
                subjectInstance: {
                  semester: { academicYear: { year: "asc" } },
                },
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
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!studentFinalResults) return { data: { years: [] } };

      const finalResultsByYearAndSemester =
        studentFinalResults.finalResults.reduce(
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
              semesterObj = { semester, result: {} };
              yearObj.semesters.push(semesterObj);
            }

            const picked = {
              name: subjectName,
              marks: finalResult.marks,
            };

            semesterObj.result = picked;

            return acc;
          },
          { years: [] },
        );

      return { data: finalResultsByYearAndSemester as Data<FinalsSemester> };
    } catch (ex) {
      console.error(ex);
      return {
        error: "An error occurred while fetching student final results data",
      };
    }
  };

export {
  getStudentData,
  getStudentResults,
  getStudentCAResults,
  getStudentFinalResults,
};
