import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const veterinarians = await prisma.veterinarian.findMany({
      where: { active: true },
      orderBy: { name: "asc" },
    });
    return NextResponse.json(veterinarians);
  } catch {
    return NextResponse.json({ error: "Erro ao buscar veterinários" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const vet = await prisma.veterinarian.create({ data: body });
    return NextResponse.json(vet, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erro ao criar veterinário" }, { status: 500 });
  }
}
