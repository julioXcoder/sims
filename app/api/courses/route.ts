import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import z from "zod";
import _ from "lodash";

const LevelSchema = z.object({
  name: z.string(),
  years: z.array(z.string()),
});

const BodySchema = z.object({
  name: z.string().min(3).max(40),
  departmentId: z.number(),
  levels: z.array(LevelSchema),
});

type Body = z.infer<typeof BodySchema>;

export async function POST(request: NextRequest) {
  try {
    const body: Body = await request.json();

    const validation = BodySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid course data" },
        { status: 400 },
      );
    }

    const { name, departmentId, levels } = body;

    // Check if the department exists
    const department = await prisma.department.findUnique({
      where: {
        id: departmentId,
      },
    });

    if (!department) {
      return NextResponse.json(
        { error: "Department Not Found" },
        { status: 404 },
      );
    }

    const newCourse = await prisma.course.create({
      data: {
        name,
        departmentId: department.id,
      },
    });

    // Create levels for the new course
    for (const level of levels) {
      const newLevel = await prisma.level.create({
        data: {
          name: level.name,
          courseId: newCourse.id,
        },
      });

      // Create years for the new level
      await prisma.year.createMany({
        data: level.years.map((yearName) => ({
          name: yearName,
          levelId: newLevel.id,
        })),
      });
    }

    const courseData = _.pick(newCourse, ["id", "name"]);

    return NextResponse.json(courseData, { status: 201 });
  } catch (ex) {
    // TODO: Log the console.error();

    return NextResponse.json(
      { error: "An error occurred while processing your request" },
      { status: 500 },
    );
  }
}
