"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaPaw,
  FaTachometerAlt,
  FaCalendarAlt,
  FaSyringe,
  FaBath,
  FaUsers,
  FaUserMd,
  FaDog,
  FaUserFriends,
  FaBoxOpen,
} from "react-icons/fa";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: FaTachometerAlt },
  { href: "/dashboard/appointments", label: "Consultas", icon: FaCalendarAlt },
  { href: "/dashboard/vaccines", label: "Vacinas", icon: FaSyringe },
  { href: "/dashboard/groomings", label: "Banho e Tosa", icon: FaBath },
  { href: "/dashboard/employees", label: "Funcionários", icon: FaUsers },
  { href: "/dashboard/veterinarians", label: "Veterinários", icon: FaUserMd },
  { href: "/dashboard/tutors", label: "Tutores", icon: FaUserFriends },
  { href: "/dashboard/pets", label: "Pets", icon: FaDog },
  { href: "/dashboard/products", label: "Produtos", icon: FaBoxOpen },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-200">
        <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center">
          <FaPaw className="text-white text-sm" />
        </div>
        <div>
          <p className="font-bold text-gray-900 text-sm">PetShop</p>
          <p className="text-xs text-gray-500">Manager</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-emerald-50 text-emerald-700"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <item.icon
                className={cn("text-base", isActive ? "text-emerald-600" : "text-gray-400")}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
