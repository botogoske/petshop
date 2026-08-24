"use client";

import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { tutorSchema, type TutorFormData } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "sonner";

interface Tutor {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  address?: string;
  active: boolean;
}

function TutorForm({ tutor, onClose }: { tutor?: Tutor; onClose: () => void }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(tutorSchema),
    defaultValues: tutor || { active: true, address: "" },
  });

  const onSubmit = async (data: TutorFormData) => {
    try {
      const res = await fetch(tutor ? `/api/tutors/${tutor.id}` : "/api/tutors", {
        method: tutor ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      toast.success(tutor ? "Tutor atualizado!" : "Tutor criado!");
      onClose();
    } catch {
      toast.error("Erro ao salvar tutor.");
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
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="phone">Telefone *</Label>
          <Input id="phone" placeholder="(11) 99999-9999" {...register("phone")} />
          {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="cpf">CPF *</Label>
          <Input id="cpf" placeholder="000.000.000-00" {...register("cpf")} />
          {errors.cpf && <p className="text-xs text-red-500">{errors.cpf.message}</p>}
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="address">Endereço</Label>
        <Textarea id="address" placeholder="Rua, número, bairro, cidade..." {...register("address")} />
      </div>
      <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isSubmitting}>
        {isSubmitting ? "Salvando..." : "Salvar"}
      </Button>
    </form>
  );
}

export default function TutorsPage() {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState<Tutor | undefined>();

  const fetchTutors = useCallback(async () => {
    const res = await fetch("/api/tutors");
    setTutors(await res.json());
  }, []);

  useEffect(() => { fetchTutors(); }, [fetchTutors]);

  const handleDelete = async (id: string) => {
    if (!confirm("Confirmar exclusão?")) return;
    await fetch(`/api/tutors/${id}`, { method: "DELETE" });
    toast.success("Tutor removido!");
    fetchTutors();
  };

  const handleClose = () => { setOpen(false); setEditItem(undefined); fetchTutors(); };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Tutores</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger
            render={
              <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => setEditItem(undefined)}>
                <FaPlus className="mr-2 text-xs" /> Novo Tutor
              </Button>
            }
          />
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editItem ? "Editar" : "Novo"} Tutor</DialogTitle>
            </DialogHeader>
            <TutorForm tutor={editItem} onClose={handleClose} />
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
              <TableHead className="font-semibold">CPF</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tutors.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-gray-400">Nenhum tutor cadastrado</TableCell></TableRow>
            ) : tutors.map((t) => (
              <TableRow key={t.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">{t.name}</TableCell>
                <TableCell>{t.email}</TableCell>
                <TableCell>{t.phone}</TableCell>
                <TableCell>{t.cpf}</TableCell>
                <TableCell><Badge className={t.active ? "bg-emerald-100 text-emerald-700" : ""}>{t.active ? "Ativo" : "Inativo"}</Badge></TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button size="sm" variant="outline" onClick={() => { setEditItem(t); setOpen(true); }}><FaEdit className="text-xs" /></Button>
                    <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700" onClick={() => handleDelete(t.id)}><FaTrash className="text-xs" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
