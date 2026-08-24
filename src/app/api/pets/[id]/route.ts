import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const pet = await prisma.pet.findUnique({ where: { id }, include: { tutor: true } });
    if (!pet) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
    return NextResponse.json(pet);
  } catch {
    return NextResponse.json({ error: "Erro ao buscar pet" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    if (body.birthDate) body.birthDate = new Date(body.birthDate);
    const pet = await prisma.pet.update({ where: { id }, data: body });
    return NextResponse.json(pet);
  } catch {
    return NextResponse.json({ error: "Erro ao atualizar pet" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.pet.update({ where: { id }, data: { active: false } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erro ao remover pet" }, { status: 500 });
  }
}
