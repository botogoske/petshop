import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaCalendarAlt, FaSyringe, FaBath, FaDog, FaUsers, FaBoxOpen } from "react-icons/fa";

export default async function DashboardPage() {
  const [appointments, vaccines, groomings, pets, tutors, products] = await Promise.all([
    prisma.appointment.count({ where: { status: "SCHEDULED" } }),
    prisma.vaccine.count(),
    prisma.grooming.count({ where: { status: "SCHEDULED" } }),
    prisma.pet.count({ where: { active: true } }),
    prisma.tutor.count({ where: { active: true } }),
    prisma.product.count({ where: { active: true } }),
  ]);

  const stats = [
    { title: "Consultas Agendadas", value: appointments, icon: FaCalendarAlt, color: "bg-blue-500" },
    { title: "Vacinas Registradas", value: vaccines, icon: FaSyringe, color: "bg-purple-500" },
    { title: "Banho e Tosa", value: groomings, icon: FaBath, color: "bg-teal-500" },
    { title: "Pets Cadastrados", value: pets, icon: FaDog, color: "bg-emerald-500" },
    { title: "Tutores", value: tutors, icon: FaUsers, color: "bg-orange-500" },
    { title: "Produtos", value: products, icon: FaBoxOpen, color: "bg-pink-500" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-xl`}>
                  <stat.icon className="text-white text-xl" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
