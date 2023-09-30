import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { studentSchema } from "@/types/schemas";
import _ from "lodash";
import { cookies, headers } from "next/headers";
import { verifyAuth } from "@/lib";

export async function GET(request: NextRequest) {
  try {
    const token = cookies().get("token")?.value;

    const verified =
      token && (await verifyAuth(token).catch((ex) => console.log(ex)));

    if (!verified) {
      return NextResponse.json(
        { error: "An error occurred while processing your request" },
        { status: 404 },
      );
    }

    const student = await prisma.student.findUnique({
      where: {
        id: verified.id,
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
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    const data = {
      ..._.pick(student, ["id", "firstName", "lastName"]),
      roles: student.roles.map((studentRole) => studentRole.role.name), // Get role names
    };

    return NextResponse.json(data, { status: 200 });
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
    const body = await request.json();

    const validation = studentSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid Student Data" },
        { status: 400 },
      );
    }

    const { firstName, lastName, password, yearId } = body;

    const year = await prisma.year.findUnique({
      where: { id: yearId },
    });

    if (!year) {
      return NextResponse.json(
        { error: "Year was not found" },
        { status: 404 },
      );
    }

    const newStudent = await prisma.student.create({
      data: {
        firstName,
        lastName,
        password,
        yearId: year.id,
        roles: {
          create: {
            role: {
              connect: {
                name: "STUDENT",
              },
            },
          },
        },
      },
    });

    const studentData = _.pick(newStudent, ["id", "firstName", "lastName"]);

    return NextResponse.json(studentData, { status: 201 });
  } catch (ex) {
    // TODO: Log the console.error();

    return NextResponse.json(
      { error: "An error occurred while processing your request" },
      { status: 500 },
    );
  }
}
