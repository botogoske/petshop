"use client";

import { signOut } from "next-auth/react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FaSignOutAlt } from "react-icons/fa";

interface HeaderProps {
  user?: {
    name?: string | null;
    email?: string | null;
  };
}

export default function Header({ user }: HeaderProps) {
  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="h-14 bg-card border-b border-border flex items-center justify-end px-6 shrink-0">
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="ghost" className="flex items-center gap-2.5 h-auto py-1.5 px-2 rounded-lg hover:bg-muted" />}>
          <Avatar className="w-7 h-7">
            <AvatarFallback className="bg-primary/10 text-primary text-[0.65rem] font-bold">
              {initials || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="text-left leading-tight">
            <p className="text-sm font-medium text-foreground">{user?.name}</p>
            <p className="text-[0.7rem] text-muted-foreground">{user?.email}</p>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/login" })}>
            <FaSignOutAlt className="mr-2 text-sm" />
            Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
