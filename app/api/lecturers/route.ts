import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { lecturerSchema } from "@/types/schemas";
import z from "zod";
import _ from "lodash";

// const BodySchema = z.object({
//   firstName: z.string(),
//   lastName: z.string(),
//   password: z.string(),
// });

type Body = z.infer<typeof lecturerSchema>;

export async function POST(request: NextRequest) {
  try {
    const body: Body = await request.json();

    const validation = lecturerSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid lecture data" },
        { status: 400 },
      );
    }

    const { firstName, lastName, password } = body;

    const newLecturer = await prisma.staff.create({
      data: {
        firstName,
        lastName,
        password,
        roleId: 2,
      },
      include: { role: true },
    });

    const lecturerData = _.pick(newLecturer, ["id", "firstName", "lastName"]);

    const data = { ...lecturerData, role: newLecturer.role.name };

    return NextResponse.json(data, { status: 201 });
  } catch (ex) {
    // TODO: Log the console.error();

    console.log(ex);

    return NextResponse.json(
      { error: "An error occurred while processing your request" },
      { status: 500 },
    );
  }
}
