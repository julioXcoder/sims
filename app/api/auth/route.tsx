import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import _ from "lodash";
import z from "zod";
import { cookies } from "next/headers";
import { createToken } from "@/lib";

const schema = z.object({
  username: z.string(),
  password: z.string().min(3),
});

type Body = z.infer<typeof schema>;

export async function POST(request: NextRequest) {
  try {
    const body: Body = await request.json();

    const validation = schema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const { username, password } = body;

    const student = await prisma.student.findUnique({
      where: {
        id: parseInt(username),
      },
    });

    if (!student) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 400 },
      );
    }

    if (student.password != password) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 400 },
      );
    }

    // const data = {
    //   ..._.pick(student, ["id", "firstName", "lastName"]),
    //   roles: student.roles.map((studentRole) => studentRole.role.name), // Get role names
    // };

    const data = _.pick(student, ["id"]);

    const token = await createToken(data);

    cookies().set("token", token);

    return NextResponse.json({ redirect: "/student/dashboard" });
  } catch (ex) {
    // TODO: Log the console.error();

    return NextResponse.json(
      { error: "An error occurred while processing your request" },
      { status: 500 },
    );
  }
}
