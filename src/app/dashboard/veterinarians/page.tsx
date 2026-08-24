"use client";

import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { veterinarianSchema, type VeterinarianFormData } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "sonner";

interface Veterinarian {
  id: string;
  name: string;
  email: string;
  phone: string;
  crmv: string;
  specialty?: string;
  active: boolean;
}

function VetForm({ vet, onClose }: { vet?: Veterinarian; onClose: () => void }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(veterinarianSchema),
    defaultValues: vet || { active: true, specialty: "" },
  });

  const onSubmit = async (data: VeterinarianFormData) => {
    try {
      const res = await fetch(vet ? `/api/veterinarians/${vet.id}` : "/api/veterinarians", {
        method: vet ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      toast.success(vet ? "Veterinário atualizado!" : "Veterinário criado!");
      onClose();
    } catch {
      toast.error("Erro ao salvar veterinário.");
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
          <Label htmlFor="crmv">CRMV *</Label>
          <Input id="crmv" placeholder="CRMV-SP 12345" {...register("crmv")} />
          {errors.crmv && <p className="text-xs text-red-500">{errors.crmv.message}</p>}
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="specialty">Especialidade</Label>
        <Input id="specialty" placeholder="Ex: Clínica Geral, Cirurgia..." {...register("specialty")} />
      </div>
      <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isSubmitting}>
        {isSubmitting ? "Salvando..." : "Salvar"}
      </Button>
    </form>
  );
}

export default function VeterinariansPage() {
  const [vets, setVets] = useState<Veterinarian[]>([]);
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState<Veterinarian | undefined>();

  const fetchVets = useCallback(async () => {
    const res = await fetch("/api/veterinarians");
    setVets(await res.json());
  }, []);

  useEffect(() => { fetchVets(); }, [fetchVets]);

  const handleDelete = async (id: string) => {
    if (!confirm("Confirmar exclusão?")) return;
    await fetch(`/api/veterinarians/${id}`, { method: "DELETE" });
    toast.success("Veterinário removido!");
    fetchVets();
  };

  const handleClose = () => { setOpen(false); setEditItem(undefined); fetchVets(); };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Veterinários</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger
            render={
              <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => setEditItem(undefined)}>
                <FaPlus className="mr-2 text-xs" /> Novo Veterinário
              </Button>
            }
          />
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editItem ? "Editar" : "Novo"} Veterinário</DialogTitle>
            </DialogHeader>
            <VetForm vet={editItem} onClose={handleClose} />
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
              <TableHead className="font-semibold">CRMV</TableHead>
              <TableHead className="font-semibold">Especialidade</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vets.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center py-8 text-gray-400">Nenhum veterinário cadastrado</TableCell></TableRow>
            ) : vets.map((vet) => (
              <TableRow key={vet.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">{vet.name}</TableCell>
                <TableCell>{vet.email}</TableCell>
                <TableCell>{vet.phone}</TableCell>
                <TableCell><Badge variant="outline">{vet.crmv}</Badge></TableCell>
                <TableCell>{vet.specialty || "-"}</TableCell>
                <TableCell><Badge className={vet.active ? "bg-emerald-100 text-emerald-700" : ""}>{vet.active ? "Ativo" : "Inativo"}</Badge></TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button size="sm" variant="outline" onClick={() => { setEditItem(vet); setOpen(true); }}><FaEdit className="text-xs" /></Button>
                    <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700" onClick={() => handleDelete(vet.id)}><FaTrash className="text-xs" /></Button>
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
