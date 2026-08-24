import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const pets = await prisma.pet.findMany({
      where: { active: true },
      include: { tutor: { select: { name: true } } },
      orderBy: { name: "asc" },
    });
    return NextResponse.json(pets);
  } catch {
    return NextResponse.json({ error: "Erro ao buscar pets" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (body.birthDate) body.birthDate = new Date(body.birthDate);
    const pet = await prisma.pet.create({ data: body, include: { tutor: true } });
    return NextResponse.json(pet, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erro ao criar pet" }, { status: 500 });
  }
}
