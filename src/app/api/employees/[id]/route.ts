import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const employee = await prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, role: true, phone: true, active: true },
    });
    if (!employee) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
    return NextResponse.json(employee);
  } catch {
    return NextResponse.json({ error: "Erro ao buscar funcionário" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    if (body.password) {
      body.password = await bcrypt.hash(body.password, 10);
    } else {
      delete body.password;
    }
    const employee = await prisma.user.update({
      where: { id },
      data: body,
      select: { id: true, name: true, email: true, role: true, phone: true, active: true },
    });
    return NextResponse.json(employee);
  } catch {
    return NextResponse.json({ error: "Erro ao atualizar funcionário" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.user.update({ where: { id }, data: { active: false } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erro ao remover funcionário" }, { status: 500 });
  }
}
