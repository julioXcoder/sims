import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import _ from "lodash";
import z from "zod";

const BodySchema = z.object({
  courseInstanceId: z.number(),
  lecturerId: z.number(),
  components: z.array(
    z.object({
      name: z.string(),
      marks: z.number(),
    }),
  ),
});

type Body = z.infer<typeof BodySchema>;

export async function POST(request: NextRequest) {
  try {
    const body: Body = await request.json();

    const validation = BodySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const { courseInstanceId, lecturerId, components } = body;

    const courseInstance = await prisma.courseInstance.findUnique({
      where: {
        id: courseInstanceId,
      },
    });

    if (!courseInstance) {
      return NextResponse.json(
        { error: "Course Instance Not Found" },
        { status: 404 },
      );
    }

    if (courseInstance.lecturerId !== lecturerId) {
      return NextResponse.json(
        { error: "You are not authorized to create a CA for this course" },
        { status: 403 },
      );
    }

    const newCA = await prisma.cA.create({
      data: {
        courseInstanceId: courseInstance.id,
      },
    });

    // Create CA components for the new CA
    const newCAComponents = await prisma.cAComponent.createMany({
      data: components.map((component) => ({
        ...component,
        CAId: newCA.id,
      })),
    });

    const caData = _.pick(newCA, ["id"]);

    return NextResponse.json(caData, { status: 201 });
  } catch (ex) {
    // TODO: Log the console.error();

    return NextResponse.json(
      { error: "An error occurred while processing your request" },
      { status: 500 },
    );
  }
}
