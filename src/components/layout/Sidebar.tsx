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
    <aside className="w-60 bg-[--sidebar] border-r border-[--sidebar-border] flex flex-col shrink-0">
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-[--sidebar-border]">
        <div className="w-8 h-8 bg-[--sidebar-primary] rounded-lg flex items-center justify-center shrink-0 shadow-sm">
          <FaPaw className="text-[--sidebar-primary-foreground] text-sm" />
        </div>
        <div className="leading-tight">
          <p className="font-semibold text-[--sidebar-foreground] text-sm tracking-tight">PetShop</p>
          <p className="text-[0.68rem] text-[--sidebar-foreground]/50 uppercase tracking-wider">Manager</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2.5 py-3 space-y-0.5 overflow-y-auto">
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
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-[--sidebar-accent] text-[--sidebar-accent-foreground]"
                  : "text-[--sidebar-foreground]/60 hover:bg-[--sidebar-accent]/60 hover:text-[--sidebar-foreground]"
              )}
            >
              <item.icon
                className={cn(
                  "text-sm shrink-0 transition-colors duration-150",
                  isActive ? "text-[--sidebar-primary]" : "text-[--sidebar-foreground]/40"
                )}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer rule */}
      <div className="px-4 py-3 border-t border-[--sidebar-border]">
        <p className="text-[0.65rem] text-[--sidebar-foreground]/30 text-center tracking-wide uppercase">
          v1.0
        </p>
      </div>
    </aside>
  );
}
