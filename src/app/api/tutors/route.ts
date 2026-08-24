import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const tutors = await prisma.tutor.findMany({
      where: { active: true },
      orderBy: { name: "asc" },
    });
    return NextResponse.json(tutors);
  } catch {
    return NextResponse.json({ error: "Erro ao buscar tutores" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const tutor = await prisma.tutor.create({ data: body });
    return NextResponse.json(tutor, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erro ao criar tutor" }, { status: 500 });
  }
}
