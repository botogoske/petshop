import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { FaCalendarAlt, FaSyringe, FaBath, FaDog, FaUsers, FaBoxOpen } from "react-icons/fa";

export default async function DashboardPage() {
  const session = await auth();

  const [appointments, vaccines, groomings, pets, tutors, products] = await Promise.all([
    prisma.appointment.count({ where: { status: "SCHEDULED" } }),
    prisma.vaccine.count(),
    prisma.grooming.count({ where: { status: "SCHEDULED" } }),
    prisma.pet.count({ where: { active: true } }),
    prisma.tutor.count({ where: { active: true } }),
    prisma.product.count({ where: { active: true } }),
  ]);

  const stats = [
    {
      title: "Consultas Agendadas",
      value: appointments,
      icon: FaCalendarAlt,
      accent: "text-blue-500",
      bg: "bg-blue-50",
      desc: "pendentes de atendimento",
    },
    {
      title: "Vacinas Registradas",
      value: vaccines,
      icon: FaSyringe,
      accent: "text-violet-500",
      bg: "bg-violet-50",
      desc: "no histórico",
    },
    {
      title: "Banho e Tosa",
      value: groomings,
      icon: FaBath,
      accent: "text-teal-500",
      bg: "bg-teal-50",
      desc: "agendados",
    },
    {
      title: "Pets Cadastrados",
      value: pets,
      icon: FaDog,
      accent: "text-emerald-600",
      bg: "bg-emerald-50",
      desc: "ativos",
    },
    {
      title: "Tutores",
      value: tutors,
      icon: FaUsers,
      accent: "text-orange-500",
      bg: "bg-orange-50",
      desc: "ativos",
    },
    {
      title: "Produtos",
      value: products,
      icon: FaBoxOpen,
      accent: "text-pink-500",
      bg: "bg-pink-50",
      desc: "em catálogo",
    },
  ];

  const firstName = session?.user?.name?.split(" ")[0] ?? "usuário";
  const now = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="max-w-6xl">
      {/* Page header */}
      <div className="mb-8">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-1 capitalize">
          {now}
        </p>
        <h1 className="text-2xl font-semibold text-foreground tracking-tight">
          Bom dia, {firstName}
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Aqui está o resumo de hoje.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-card rounded-xl border border-border p-5 flex items-start gap-4 hover:shadow-sm transition-shadow duration-200"
          >
            <div className={`${stat.bg} ${stat.accent} w-10 h-10 rounded-lg flex items-center justify-center shrink-0 mt-0.5`}>
              <stat.icon className="text-base" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider truncate">
                {stat.title}
              </p>
              <p className="text-3xl font-bold text-foreground tabular-nums leading-none mt-1.5">
                {stat.value}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{stat.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
