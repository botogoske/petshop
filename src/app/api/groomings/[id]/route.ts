import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const grooming = await prisma.grooming.findUnique({ where: { id }, include: { pet: true } });
    if (!grooming) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
    return NextResponse.json(grooming);
  } catch {
    return NextResponse.json({ error: "Erro ao buscar agendamento" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    if (body.date) body.date = new Date(body.date);
    const grooming = await prisma.grooming.update({ where: { id }, data: body });
    return NextResponse.json(grooming);
  } catch {
    return NextResponse.json({ error: "Erro ao atualizar agendamento" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.grooming.update({ where: { id }, data: { status: "CANCELLED" } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erro ao cancelar agendamento" }, { status: 500 });
  }
}
