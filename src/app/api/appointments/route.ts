import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const appointments = await prisma.appointment.findMany({
      include: {
        pet: { select: { name: true, species: true } },
        veterinarian: { select: { name: true } },
      },
      orderBy: { date: "desc" },
    });
    return NextResponse.json(appointments);
  } catch {
    return NextResponse.json({ error: "Erro ao buscar consultas" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    body.date = new Date(body.date);
    const appointment = await prisma.appointment.create({
      data: body,
      include: {
        pet: { select: { name: true } },
        veterinarian: { select: { name: true } },
      },
    });
    return NextResponse.json(appointment, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erro ao criar consulta" }, { status: 500 });
  }
}
