import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const tutor = await prisma.tutor.findUnique({ where: { id }, include: { pets: true } });
    if (!tutor) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
    return NextResponse.json(tutor);
  } catch {
    return NextResponse.json({ error: "Erro ao buscar tutor" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const tutor = await prisma.tutor.update({ where: { id }, data: body });
    return NextResponse.json(tutor);
  } catch {
    return NextResponse.json({ error: "Erro ao atualizar tutor" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.tutor.update({ where: { id }, data: { active: false } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erro ao remover tutor" }, { status: 500 });
  }
}
