import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const vaccine = await prisma.vaccine.findUnique({ where: { id }, include: { pet: true, veterinarian: true } });
    if (!vaccine) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
    return NextResponse.json(vaccine);
  } catch {
    return NextResponse.json({ error: "Erro ao buscar vacina" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    if (body.date) body.date = new Date(body.date);
    if (body.nextDoseDate) body.nextDoseDate = new Date(body.nextDoseDate);
    const vaccine = await prisma.vaccine.update({ where: { id }, data: body });
    return NextResponse.json(vaccine);
  } catch {
    return NextResponse.json({ error: "Erro ao atualizar vacina" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.vaccine.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erro ao remover vacina" }, { status: 500 });
  }
}
