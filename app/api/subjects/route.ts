import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import z from "zod";

const BodySchema = z.object({
  name: z.string(),
  yearId: z.number(),
});

type Body = z.infer<typeof BodySchema>;

export async function POST(request: NextRequest) {
  try {
    const body: Body = await request.json();

    const validation = BodySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const { name, yearId } = body;

    const year = await prisma.year.findUnique({
      where: {
        id: yearId,
      },
    });

    if (!year) {
      return NextResponse.json({ error: "Year Not Found" }, { status: 404 });
    }

    const newSubject = await prisma.subject.create({
      data: {
        name,
        yearId: year.id,
      },
    });

    return NextResponse.json(newSubject, { status: 201 });
  } catch (ex) {
    // TODO: Log the console.error();

    return NextResponse.json(
      { error: "An error occurred while processing your request" },
      { status: 500 },
    );
  }
}
