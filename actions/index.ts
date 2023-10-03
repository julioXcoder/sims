"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/prisma/client";
import {
  Data,
  GetStudentCAResultsResponse,
  GetStudentFinalResultsResponse,
  FinalsSemester,
  CASemester,
  AuthorizeUserResponse,
  GetSubjectsResponse,
  SubjectInfo,
  CreateCAComponentsResponse,
  CAComponentInput,
} from "@/types";
import _ from "lodash";
import { createToken } from "@/lib";

const getStudentData = async () => {
  const headersList = headers();
  const userId = headersList.get("userId");
  if (!userId) return redirect("/auth");
  try {
    const student = await prisma.student.findUnique({
      where: {
        id: parseInt(userId),
      },
      include: {
        positions: {
          include: {
            position: true,
          },
        },
      },
    });

    if (!student) throw new Error("Student not found");

    const data = {
      ..._.pick(student, ["id", "firstName", "lastName"]),
      roles: student.positions.map(
        (studentPosition) => studentPosition.position.name,
      ),
    };

    return data;
  } catch (ex) {
    console.error(ex); // Log the error
    throw new Error("An error occurred while fetching student data");
  }
};

const getStudentCAResults = async (): Promise<GetStudentCAResultsResponse> => {
  const headersList = headers();
  const userId = headersList.get("userId");
  if (!userId) return { error: "Id Not Found" };

  try {
    const student = await prisma.student.findUnique({
      where: {
        id: parseInt(userId),
      },
    });

    if (!student) return { error: "Student not found" };

    const studentYears = await prisma.studentYear.findMany({
      where: {
        studentId: student.id,
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
        year: true,
      },
    });

    if (!studentYears.length) return { data: { years: [] } };

    const CAResultsByAcademicYearAndStudentYear = studentYears.reduce(
      (acc: Record<string, any>, studentYear) => {
        // Check if CAResults exist and is not empty
        if (studentYear.CAResults && studentYear.CAResults.length > 0) {
          const CAResults = studentYear.CAResults;

          CAResults.forEach((CAResult) => {
            // Check if subjectInstance exists
            if (CAResult.subjectInstance) {
              const academicYear =
                CAResult?.subjectInstance?.semester?.academicYear?.year;

              const studentYearName = studentYear.year.name;

              if (!acc.years) {
                acc.years = [];
              }

              let academicYearObj = acc.years.find(
                (y: any) => y.year === academicYear,
              );
              if (!academicYearObj) {
                academicYearObj = { year: academicYear, studentYears: [] };
                acc.years.push(academicYearObj);
              }

              let studentYearObj = academicYearObj.studentYears.find(
                (sy: any) => sy.year === studentYearName,
              );
              if (!studentYearObj) {
                studentYearObj = { year: studentYearName, semesters: [] };
                academicYearObj.studentYears.push(studentYearObj);
              }

              const semester = CAResult.subjectInstance.semester.name;
              const subjectName = CAResult.subjectInstance.subject.name;

              let semesterObj = studentYearObj.semesters.find(
                (s: any) => s.semester === semester,
              );
              if (!semesterObj) {
                semesterObj = { semester, results: [] };
                studentYearObj.semesters.push(semesterObj);
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
            }
          });
        }

        return acc;
      },
      { years: [] },
    );

    return { data: CAResultsByAcademicYearAndStudentYear as Data<CASemester> };
  } catch (ex) {
    console.error(ex);
    return { error: "An error occurred while fetching student CA data" };
  }
};

const getStudentFinalResults =
  async (): Promise<GetStudentFinalResultsResponse> => {
    const headersList = headers();
    const userId = headersList.get("userId");
    if (!userId) return { error: "Id Not Found" };

    try {
      const student = await prisma.student.findUnique({
        where: {
          id: parseInt(userId),
        },
      });

      if (!student) return { error: "Student Not Found" };

      const studentYears = await prisma.studentYear.findMany({
        where: {
          studentId: student.id,
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
          year: true,
        },
      });

      if (!studentYears.length) return { data: { years: [] } };

      const finalResultsByAcademicYearAndStudentYear = studentYears.reduce(
        (acc: Record<string, any>, studentYear) => {
          // Check if finalResults exist and is not empty
          if (studentYear.finalResults && studentYear.finalResults.length > 0) {
            const finalResults = studentYear.finalResults;

            finalResults.forEach((finalResult) => {
              // Check if subjectInstance exists
              if (finalResult.subjectInstance) {
                const academicYear =
                  finalResult?.subjectInstance?.semester?.academicYear?.year;

                const studentYearName = studentYear.year.name;

                if (!acc.years) {
                  acc.years = [];
                }

                let academicYearObj = acc.years.find(
                  (y: any) => y.year === academicYear,
                );
                if (!academicYearObj) {
                  academicYearObj = { year: academicYear, studentYears: [] };
                  acc.years.push(academicYearObj);
                }

                let studentYearObj = academicYearObj.studentYears.find(
                  (sy: any) => sy.year === studentYearName,
                );
                if (!studentYearObj) {
                  studentYearObj = { year: studentYearName, semesters: [] };
                  academicYearObj.studentYears.push(studentYearObj);
                }

                const semester = finalResult.subjectInstance.semester.name;
                const subjectName = finalResult.subjectInstance.subject.name;

                let semesterObj = studentYearObj.semesters.find(
                  (s: any) => s.semester === semester,
                );
                if (!semesterObj) {
                  semesterObj = { semester, results: [] };
                  studentYearObj.semesters.push(semesterObj);
                }

                const picked = {
                  name: subjectName,
                  marks: finalResult.marks,
                };

                semesterObj.results.push(picked);
              }
            });
          }

          return acc;
        },
        { years: [] },
      );

      return {
        data: finalResultsByAcademicYearAndStudentYear as Data<FinalsSemester>,
      };
    } catch (ex) {
      console.error(ex);
      return {
        error: "An error occurred while fetching student final results data",
      };
    }
  };

const authorizeStudent = async ({
  username,
  password,
}: {
  username: string;
  password: string;
}): Promise<AuthorizeUserResponse> => {
  const student = await prisma.student.findUnique({
    where: {
      id: parseInt(username),
    },
  });

  if (!student || student.password != password) {
    return { error: "Invalid username or password" };
  }

  const data = _.pick(student, ["id", "role"]);

  const token = await createToken(data);

  cookies().set("token", token);

  return { redirect: "/student/dashboard" };
};

const authorizeStaff = async ({
  username,
  password,
}: {
  username: string;
  password: string;
}): Promise<AuthorizeUserResponse> => {
  const staff = await prisma.staff.findUnique({
    where: {
      id: parseInt(username),
    },
    include: { role: true },
  });

  if (!staff || staff.password != password) {
    return { error: "Invalid username or password" };
  }

  const role = staff.role.name;

  const data = { id: staff.id, role };

  const token = await createToken(data);

  cookies().set("token", token);

  if (role == "LECTURE") {
    return { redirect: "/lecture/dashboard" };
  } else if (role == "EXAMINATION_OFFICER") {
    return { redirect: "/examination_officer/dashboard" };
  }

  return { error: "Invalid user role" };
};

// FIXME: Add return errors for getSubjects and createCAComponents and getStudentsForSubjectInstance

// without components
// TODO: lecturerId: 6,  semesterId: 2,

async function getSubjects(): Promise<GetSubjectsResponse> {
  try {
    const currentSemester = await prisma.semester.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 1,
    });

    if (!currentSemester) {
      return { error: "No Semester found" };
    }

    const semester = currentSemester[0];

    const subjects = await prisma.subjectInstance.findMany({
      where: {
        lecturerId: 6,
        semesterId: 2,
      },
      include: {
        subject: {
          include: {
            year: {
              include: {
                level: {
                  include: {
                    course: {
                      include: {
                        department: {
                          include: {
                            college: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        CAs: {
          include: {
            components: true,
          },
        },
      },
    });

    const subjectInfos: SubjectInfo[] = subjects.map((subjectInstance) => ({
      college:
        subjectInstance.subject.year.level.course.department.college.name,
      department: subjectInstance.subject.year.level.course.department.name,
      course: subjectInstance.subject.year.level.course.name,
      level: subjectInstance.subject.year.level.name,
      year: subjectInstance.subject.year.name,
      name: subjectInstance.subject.name,
      id: subjectInstance.id,
      caComponents: subjectInstance.CAs.flatMap((ca) =>
        ca.components.map((component) => ({
          name: component.name,
          marks: component.marks,
        })),
      ),
    }));

    return { data: subjectInfos };
  } catch (error) {
    return { error: "" };
  }
}

// async function createCAComponents(
//   caId: number,
//   lecturerId: number,
//   subjectInstanceId: number,
//   components: CAComponentInput[],
// ): Promise<CreateCAComponentsResponse> {
//   try {
//     const subjectInstance = await prisma.subjectInstance.findUnique({
//       where: {
//         id: subjectInstanceId,
//       },
//       include: {
//         studentYears: {
//           include: {
//             student: true,
//           },
//         },
//       },
//     });

//     if (!subjectInstance) {
//       return { error: "Subject Instance Not Found" };
//     }

//     if (subjectInstance.lecturerId !== lecturerId) {
//       return {
//         error: "You are not authorized to create a CA for this subject",
//       };
//     }

//     const newCA = await prisma.cA.create({
//       data: {
//         subjectInstanceId: subjectInstance.id,
//       },
//     });

//     const createdComponentsCount = await prisma.cAComponent.createMany({
//       data: components.map((component) => ({
//         ...component,
//         CAId: newCA.id,
//       })),
//     });

//     const createdComponents = await prisma.cAComponent.findMany({
//       where: {
//         CAId: newCA.id,
//       },
//     });

//     for (const component of createdComponents) {
//       for (const student of subjectInstance.students) {
//         await prisma.cAResult.create({
//           data: {
//             marks: null,
//             studentYearId: student.id, // Replace with the actual student year ID
//             componentId: component.id,
//             subjectInstanceId: subjectInstance.id,
//           },
//         });
//       }
//     }

//     return { data: createdComponents };
//   } catch (error) {
//     return { error: "" };
//   }
// }

async function createCAComponents(
  caId: number,
  lecturerId: number,
  subjectInstanceId: number,
  components: CAComponentInput[],
): Promise<CreateCAComponentsResponse> {
  try {
    const carResults = await prisma.cAResult.findMany({
      where: {
        subjectInstanceId: subjectInstanceId,
      },
      include: {
        studentYear: {
          include: {
            student: true,
          },
        },
      },
    });

    if (!carResults) {
      return { error: "No CAResults Found for this Subject Instance" };
    }

    const newCA = await prisma.cA.create({
      data: {
        subjectInstanceId: subjectInstanceId,
      },
    });

    const createdComponentsCount = await prisma.cAComponent.createMany({
      data: components.map((component) => ({
        ...component,
        CAId: newCA.id,
      })),
    });

    const createdComponents = await prisma.cAComponent.findMany({
      where: {
        CAId: newCA.id,
      },
    });

    for (const component of createdComponents) {
      for (const carResult of carResults) {
        await prisma.cAResult.create({
          data: {
            marks: null,
            studentYearId: carResult.studentYearId,
            componentId: component.id,
            subjectInstanceId: subjectInstanceId,
          },
        });
      }
    }

    return { data: createdComponents };
  } catch (error) {
    return { error: "" };
  }
}

async function getStudentsForSubjectInstance(subjectInstanceId: number) {
  try {
    const caResults = await prisma.cAResult.findMany({
      where: {
        subjectInstanceId: subjectInstanceId,
      },
      include: {
        studentYear: {
          include: {
            student: true,
          },
        },
        component: true,
      },
    });

    const finalResults = await prisma.finalResult.findMany({
      where: {
        subjectInstanceId: subjectInstanceId,
      },
      include: {
        studentYear: {
          include: {
            student: true,
          },
        },
        subjectInstance: {
          include: {
            subject: true,
          },
        },
      },
    });

    if (!caResults || !finalResults) {
      return { error: "No Results Found for this Subject Instance" };
    }

    // Extract the students from the CAResults and FinalResults
    const students = caResults.map((carResult) => ({
      ...carResult.studentYear.student,
      caResults: [
        {
          name: carResult.component.name,
          marks: carResult.marks,
        },
      ],
      finalResults: finalResults
        .filter(
          (finalResult) =>
            finalResult.studentYearId === carResult.studentYearId,
        )
        .map((finalResult) => ({
          name: finalResult.subjectInstance.subject.name,
          marks: finalResult.marks,
        })),
    }));

    return { data: students };
  } catch (error) {
    return { error: "" };
  }
}

export {
  getStudentData,
  getStudentCAResults,
  getStudentFinalResults,
  authorizeStudent,
  getSubjects,
  getStudentsForSubjectInstance,
};
