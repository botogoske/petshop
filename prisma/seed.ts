import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@petshop.com" },
    update: {},
    create: {
      name: "Administrador",
      email: "admin@petshop.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  const employee = await prisma.user.upsert({
    where: { email: "funcionario@petshop.com" },
    update: {},
    create: {
      name: "Funcionário Padrão",
      email: "funcionario@petshop.com",
      password: await bcrypt.hash("func123", 10),
      role: "EMPLOYEE",
    },
  });

  const vet = await prisma.veterinarian.upsert({
    where: { crmv: "CRMV-SP 12345" },
    update: {},
    create: {
      name: "Dra. Ana Paula",
      email: "ana@petshop.com",
      phone: "(11) 99999-0001",
      crmv: "CRMV-SP 12345",
      specialty: "Clínica Geral",
    },
  });

  const tutor = await prisma.tutor.upsert({
    where: { cpf: "123.456.789-00" },
    update: {},
    create: {
      name: "João Silva",
      email: "joao@exemplo.com",
      phone: "(11) 98765-4321",
      cpf: "123.456.789-00",
      address: "Rua das Flores, 123 - São Paulo",
    },
  });

  const pet = await prisma.pet.upsert({
    where: { id: "seed-pet-1" },
    update: {},
    create: {
      id: "seed-pet-1",
      name: "Rex",
      species: "Cão",
      breed: "Golden Retriever",
      weight: 28.5,
      color: "Caramelo",
      tutorId: tutor.id,
    },
  });

  console.log("✅ Seed concluído!");
  console.log("📧 Admin:", admin.email, "| Senha: admin123");
  console.log("📧 Funcionário:", employee.email, "| Senha: func123");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
