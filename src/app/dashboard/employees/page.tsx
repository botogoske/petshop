"use client";

import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { employeeSchema, type EmployeeFormData } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "sonner";

interface Employee {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  active: boolean;
}

function EmployeeForm({
  employee,
  onClose,
}: {
  employee?: Employee;
  onClose: () => void;
}) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(employeeSchema),
    defaultValues: employee
      ? {
          name: employee.name,
          email: employee.email,
          phone: employee.phone || "",
          role: employee.role as "ADMIN" | "EMPLOYEE",
          active: employee.active,
          password: "",
        }
      : { role: "EMPLOYEE" as const, active: true, password: "", phone: "" },
  });

  const onSubmit = async (data: EmployeeFormData) => {
    try {
      const url = employee ? `/api/employees/${employee.id}` : "/api/employees";
      const method = employee ? "PUT" : "POST";
      const payload: Record<string, unknown> = { ...data };
      if (!payload.password) delete payload.password;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      toast.success(employee ? "Funcionário atualizado!" : "Funcionário criado!");
      onClose();
    } catch {
      toast.error("Erro ao salvar funcionário.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="name">Nome *</Label>
        <Input id="name" placeholder="Nome completo" {...register("name")} />
        {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="email">Email *</Label>
        <Input id="email" type="email" placeholder="email@exemplo.com" {...register("email")} />
        {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="password">{employee ? "Nova Senha (opcional)" : "Senha *"}</Label>
        <Input id="password" type="password" placeholder="••••••••" {...register("password")} />
        {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="phone">Telefone</Label>
        <Input id="phone" placeholder="(11) 99999-9999" {...register("phone")} />
      </div>
      <div className="space-y-1.5">
        <Label>Perfil *</Label>
        <Select
          onValueChange={(v) => setValue("role", (v || "EMPLOYEE") as "ADMIN" | "EMPLOYEE")}
          defaultValue={employee?.role || "EMPLOYEE"}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="EMPLOYEE">Funcionário</SelectItem>
            <SelectItem value="ADMIN">Administrador</SelectItem>
          </SelectContent>
        </Select>
        {errors.role && <p className="text-xs text-red-500">{errors.role.message}</p>}
      </div>
      <Button
        type="submit"
        className="w-full bg-emerald-600 hover:bg-emerald-700"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Salvando..." : "Salvar"}
      </Button>
    </form>
  );
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState<Employee | undefined>();

  const fetchEmployees = useCallback(async () => {
    const res = await fetch("/api/employees");
    const data = await res.json();
    setEmployees(data);
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleDelete = async (id: string) => {
    if (!confirm("Confirmar exclusão?")) return;
    await fetch(`/api/employees/${id}`, { method: "DELETE" });
    toast.success("Funcionário removido!");
    fetchEmployees();
  };

  const handleClose = () => {
    setOpen(false);
    setEditItem(undefined);
    fetchEmployees();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Funcionários</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger
            render={
              <Button
                className="bg-emerald-600 hover:bg-emerald-700"
                onClick={() => setEditItem(undefined)}
              >
                <FaPlus className="mr-2 text-xs" /> Novo Funcionário
              </Button>
            }
          />
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editItem ? "Editar" : "Novo"} Funcionário</DialogTitle>
            </DialogHeader>
            <EmployeeForm employee={editItem} onClose={handleClose} />
          </DialogContent>
        </Dialog>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">Nome</TableHead>
              <TableHead className="font-semibold">Email</TableHead>
              <TableHead className="font-semibold">Telefone</TableHead>
              <TableHead className="font-semibold">Perfil</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-400">
                  Nenhum funcionário cadastrado
                </TableCell>
              </TableRow>
            ) : (
              employees.map((emp) => (
                <TableRow key={emp.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{emp.name}</TableCell>
                  <TableCell>{emp.email}</TableCell>
                  <TableCell>{emp.phone || "-"}</TableCell>
                  <TableCell>
                    <Badge variant={emp.role === "ADMIN" ? "default" : "secondary"}>
                      {emp.role === "ADMIN" ? "Admin" : "Funcionário"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={emp.active ? "default" : "destructive"}
                      className={emp.active ? "bg-emerald-100 text-emerald-700" : ""}
                    >
                      {emp.active ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditItem(emp);
                          setOpen(true);
                        }}
                      >
                        <FaEdit className="text-xs" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDelete(emp.id)}
                      >
                        <FaTrash className="text-xs" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
