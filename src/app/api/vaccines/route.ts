import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const vaccines = await prisma.vaccine.findMany({
      include: {
        pet: { select: { name: true, species: true } },
        veterinarian: { select: { name: true } },
      },
      orderBy: { date: "desc" },
    });
    return NextResponse.json(vaccines);
  } catch {
    return NextResponse.json({ error: "Erro ao buscar vacinas" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    body.date = new Date(body.date);
    if (body.nextDoseDate) body.nextDoseDate = new Date(body.nextDoseDate);
    const vaccine = await prisma.vaccine.create({
      data: body,
      include: {
        pet: { select: { name: true } },
        veterinarian: { select: { name: true } },
      },
    });
    return NextResponse.json(vaccine, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erro ao registrar vacina" }, { status: 500 });
  }
}
