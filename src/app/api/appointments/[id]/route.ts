import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: { pet: true, veterinarian: true },
    });
    if (!appointment) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
    return NextResponse.json(appointment);
  } catch {
    return NextResponse.json({ error: "Erro ao buscar consulta" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    if (body.date) body.date = new Date(body.date);
    const appointment = await prisma.appointment.update({ where: { id }, data: body });
    return NextResponse.json(appointment);
  } catch {
    return NextResponse.json({ error: "Erro ao atualizar consulta" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.appointment.update({ where: { id }, data: { status: "CANCELLED" } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erro ao cancelar consulta" }, { status: 500 });
  }
}
