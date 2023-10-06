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
  GetStudentsForSubjectInstanceCAResponse,
  StudentCAResults,
  GetStudentsForSubjectInstanceFinalResponse,
  StudentFinalResults,
  GetStudentDataResponse,
  StudentData,
  GetStaffDataResponse,
} from "@/types";
import _, { result } from "lodash";
import { createToken } from "@/lib";

const getUserId = () => {
  const headersList = headers();

  const userId = headersList.get("userId");

  if (!userId) return redirect("/error");

  return parseInt(userId);
};

const getStudentData = async (): Promise<GetStudentDataResponse> => {
  const userId = getUserId();

  try {
    const student = await prisma.student.findUnique({
      where: {
        id: userId,
      },
      include: {
        positions: {
          include: {
            position: true,
          },
        },
      },
    });

    if (!student) return { error: "Student not found" };

    const data: StudentData = {
      ..._.pick(student, ["id", "firstName", "lastName"]),
      positions: student.positions.map(
        (studentPosition) => studentPosition.position.name,
      ),
    };

    return { data };
  } catch (ex) {
    return { error: "An error occurred while fetching student data" };
  }
};

const getStaffData = async (): Promise<GetStaffDataResponse> => {
  const userId = getUserId();
  try {
    const staff = await prisma.staff.findUnique({
      where: { id: userId },
      include: {
        role: true,
      },
    });

    if (!staff) return { error: "Student not found" };

    const { id, firstName, lastName, role } = staff;

    const data = { id, firstName, lastName, role: role.name };

    return { data };
  } catch (ex) {
    return { error: "An error occurred while fetching staff data" };
  }
};

const getStudentCAResults = async (): Promise<GetStudentCAResultsResponse> => {
  const userId = getUserId();

  try {
    const student = await prisma.student.findUnique({
      where: {
        id: userId,
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
    const userId = getUserId();
    if (!userId) return { error: "Id Not Found" };

    try {
      const student = await prisma.student.findUnique({
        where: {
          id: getUserId(),
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

  return { redirect: "/student/application/dashboard" };
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
    return { redirect: "/staff/lecturer/dashboard" };
  } else if (role == "EXAMINATION_OFFICER") {
    return { redirect: "/staff/examination_officer/dashboard" };
  }

  return { error: "Invalid user role" };
};

// FIXME: Add return errors for getSubjects and createCAComponents and getStudentsForSubjectInstance

// without components
// TODO: lecturerId: 6,  semesterId: 2,

async function getSubjects(): Promise<GetSubjectsResponse> {
  const userId = getUserId();
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
        lecturerId: userId,
        semesterId: 1,
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
      subjectInstanceId: subjectInstance.id,
      caComponents: subjectInstance.CAs.flatMap((ca) =>
        ca.components.map((component) => ({
          id: component.id,
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

async function createCAComponents(
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
    // const caResults = await prisma.cAResult.findMany({
    //   where: {
    //     subjectInstanceId: subjectInstanceId,
    //   },
    //   include: {
    //     studentYear: {
    //       include: {
    //         student: true,
    //       },
    //     },
    //     component: true,
    //   },
    // });

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

    if (!finalResults) {
      return { error: "No Results Found for this Subject Instance" };
    }

    // Extract the students from the CAResults and FinalResults
    const students = finalResults.map((carResult) => {
      const studentFinalResults = finalResults
        .filter(
          (finalResult) =>
            finalResult.studentYearId === carResult.studentYearId,
        )
        .map((finalResult) => ({
          name: finalResult.subjectInstance.subject.name,
          marks: finalResult.marks,
        }));

      return {
        ...carResult.studentYear.student,
        caResults: [{}],
        finalResults:
          studentFinalResults.length > 0 ? studentFinalResults : null,
      };
    });

    return { data: students };
  } catch (error) {
    return { error: "" };
  }
}

async function updateLecturerForSubjectInstance(
  subjectInstanceId: number,
  newLecturerId: number,
) {
  try {
    const updatedSubjectInstance = await prisma.subjectInstance.update({
      where: {
        id: subjectInstanceId,
      },
      data: {
        lecturerId: newLecturerId,
      },
    });

    return { data: updatedSubjectInstance };
  } catch (error) {
    return { error: "" };
  }
}

// Function to get CAresults for a subject instance
async function getStudentsForSubjectInstanceCAResults(
  subjectInstanceId: number,
): Promise<GetStudentsForSubjectInstanceCAResponse> {
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

    if (!caResults) {
      return { error: "No CA Results Found for this Subject Instance" };
    }

    // Group the CA results by student
    const studentsMap: { [key: number]: StudentCAResults } = {};
    for (const carResult of caResults) {
      const studentId = carResult.studentYear.student.id;
      if (!studentsMap[studentId]) {
        studentsMap[studentId] = {
          ...carResult.studentYear.student,
          caResults: [],
        };
      }
      studentsMap[studentId].caResults.push({
        id: carResult.component.id,
        name: carResult.component.name,
        marks: carResult.marks,
      });
    }

    // Convert the students map to an array
    const students: StudentCAResults[] = Object.values(studentsMap);

    const pickedStudents = students.map(
      ({ id, firstName, lastName, caResults }) => ({
        id,
        firstName,
        lastName,
        caResults,
      }),
    );

    return { data: pickedStudents };
  } catch (error) {
    return { error: "An error occurred while processing your request" };
  }
}

// Function to get FinalResults for a subject instance
async function getStudentsForSubjectInstanceFinalResults(
  subjectInstanceId: number,
): Promise<GetStudentsForSubjectInstanceFinalResponse> {
  try {
    // Fetch all the students
    const students = await prisma.student.findMany();

    const studentsFinalResults: StudentFinalResults[] = [];

    for (const student of students) {
      let finalResult = await prisma.finalResult.findFirst({
        where: {
          subjectInstanceId: subjectInstanceId,
          studentYearId: student.id,
        },
        include: {
          subjectInstance: {
            include: {
              subject: true,
            },
          },
        },
      });

      // If the FinalResult record doesn't exist, create a new one with marks set to null
      if (!finalResult) {
        finalResult = await prisma.finalResult.create({
          data: {
            marks: null,
            studentYearId: student.id,
            subjectInstanceId: subjectInstanceId,
          },
          include: {
            subjectInstance: {
              include: {
                subject: true,
              },
            },
          },
        });
      }

      const studentFinalResults: StudentFinalResults = {
        ...student,
        finalResults: {
          name: finalResult.subjectInstance.subject.name,
          marks: finalResult.marks,
        },
      };

      studentsFinalResults.push(studentFinalResults);
    }

    return { data: studentsFinalResults };
  } catch (error) {
    return { error: "An error occurred while processing your request" };
  }
}

async function updateStudentCAResults(
  studentId: number,
  subjectInstanceId: number,
  caResults: { componentId: number; marks: number }[],
): Promise<{ response?: string; error?: string }> {
  try {
    // Start a transaction
    const prismaTransaction = prisma.$transaction(
      caResults.map((caResult) =>
        prisma.cAResult.updateMany({
          where: {
            studentYear: { studentId: studentId },
            componentId: caResult.componentId,
            subjectInstanceId: subjectInstanceId,
          },
          data: {
            marks: caResult.marks,
          },
        }),
      ),
    );

    // Execute the transaction
    await prismaTransaction;
    return { response: "ok" };
  } catch (error) {
    console.error("An error occurred while updating the CA Results:", error);
    return {
      error: `An error occurred while updating the CA Results: ${error}`,
    };
  }
}

export {
  getStudentData,
  getStudentCAResults,
  getStudentFinalResults,
  authorizeStudent,
  getSubjects,
  getStudentsForSubjectInstance,
  getStudentsForSubjectInstanceCAResults,
  getStudentsForSubjectInstanceFinalResults,
  getStaffData,
  authorizeStaff,
  updateStudentCAResults,
};
