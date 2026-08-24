import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const groomings = await prisma.grooming.findMany({
      include: { pet: { select: { name: true, species: true } } },
      orderBy: { date: "desc" },
    });
    return NextResponse.json(groomings);
  } catch {
    return NextResponse.json({ error: "Erro ao buscar banho e tosa" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    body.date = new Date(body.date);
    const grooming = await prisma.grooming.create({
      data: body,
      include: { pet: { select: { name: true } } },
    });
    return NextResponse.json(grooming, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erro ao criar agendamento" }, { status: 500 });
  }
}
