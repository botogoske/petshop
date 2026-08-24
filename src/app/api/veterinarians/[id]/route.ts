import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const vet = await prisma.veterinarian.findUnique({ where: { id } });
    if (!vet) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
    return NextResponse.json(vet);
  } catch {
    return NextResponse.json({ error: "Erro ao buscar veterinário" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const vet = await prisma.veterinarian.update({ where: { id }, data: body });
    return NextResponse.json(vet);
  } catch {
    return NextResponse.json({ error: "Erro ao atualizar veterinário" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.veterinarian.update({ where: { id }, data: { active: false } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erro ao remover veterinário" }, { status: 500 });
  }
}
