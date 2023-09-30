"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/prisma/client";
import _ from "lodash";

const headersList = headers();
const userId = headersList.get("userDd");

const getStudentData = async () => {
  try {
    if (!userId) return redirect("/auth");

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

    if (!student) {
      throw new Error("Student not found");
    }

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

export { getStudentData };
