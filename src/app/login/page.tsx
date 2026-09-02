"use client";

import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormData } from "@/lib/validations";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaPaw } from "react-icons/fa";
import { toast } from "sonner";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Credenciais inválidas. Verifique seu email e senha.");
      } else {
        toast.success("Login realizado com sucesso!");
        router.push("/dashboard");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel — brand */}
      <div
        className="hidden lg:flex lg:w-[420px] xl:w-[480px] shrink-0 flex-col justify-between p-10"
        style={{ background: "oklch(0.21 0.04 152)" }}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[--brand-400] flex items-center justify-center">
            <FaPaw className="text-[oklch(0.145_0_0)] text-sm" />
          </div>
          <span className="font-semibold text-[oklch(0.92_0.02_152)] text-sm tracking-tight">
            PetShop Manager
          </span>
        </div>

        <div>
          <p className="text-[oklch(0.92_0.02_152)] text-2xl font-semibold leading-snug max-w-xs">
            Gestão completa para o seu petshop, em um só lugar.
          </p>
          <p className="mt-3 text-sm text-[oklch(0.92_0.02_152)/0.5] max-w-xs leading-relaxed">
            Consultas, vacinas, banho &amp; tosa, produtos e muito mais — tudo centralizado.
          </p>
        </div>

        <p className="text-[0.65rem] text-[oklch(0.92_0.02_152)/0.3] uppercase tracking-wider">
          Sistema de Gestão de Petshop
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center bg-background p-6">
        <div className="w-full max-w-sm">
          {/* Mobile brand mark */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <FaPaw className="text-primary-foreground text-xs" />
            </div>
            <span className="font-semibold text-foreground text-sm">PetShop Manager</span>
          </div>

          <div className="mb-7">
            <h1 className="text-2xl font-semibold text-foreground tracking-tight">Entrar</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Acesse sua conta para continuar
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                autoComplete="email"
                className="h-10"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-medium">
                Senha
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                className="h-10"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-10 mt-2 font-medium"
              disabled={loading}
            >
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
