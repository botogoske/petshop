import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const employees = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, phone: true, active: true, createdAt: true },
      orderBy: { name: "asc" },
    });
    return NextResponse.json(employees);
  } catch {
    return NextResponse.json({ error: "Erro ao buscar funcionários" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (body.password) {
      body.password = await bcrypt.hash(body.password, 10);
    }
    const employee = await prisma.user.create({
      data: body,
      select: { id: true, name: true, email: true, role: true, phone: true, active: true, createdAt: true },
    });
    return NextResponse.json(employee, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erro ao criar funcionário" }, { status: 500 });
  }
}
