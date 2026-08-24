"use client";

import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { groomingSchema, type GroomingFormData } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "sonner";

interface Pet { id: string; name: string; species: string; }
interface Grooming {
  id: string;
  petId: string;
  date: string;
  serviceType: string;
  price?: number;
  notes?: string;
  status: string;
  pet?: { name: string; species: string };
}

const serviceTypeMap: Record<string, string> = {
  BATH: "Banho",
  GROOMING: "Tosa",
  BATH_AND_GROOMING: "Banho e Tosa",
};

const statusMap: Record<string, { label: string; color: string }> = {
  SCHEDULED: { label: "Agendado", color: "bg-blue-100 text-blue-700" },
  IN_PROGRESS: { label: "Em Andamento", color: "bg-yellow-100 text-yellow-700" },
  COMPLETED: { label: "Concluído", color: "bg-emerald-100 text-emerald-700" },
  CANCELLED: { label: "Cancelado", color: "bg-red-100 text-red-700" },
};

function GroomingForm({
  grooming, pets, onClose,
}: {
  grooming?: Grooming; pets: Pet[]; onClose: () => void;
}) {
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(groomingSchema),
    defaultValues: grooming
      ? {
          petId: grooming.petId,
          date: grooming.date.slice(0, 16),
          serviceType: grooming.serviceType as GroomingFormData["serviceType"],
          status: grooming.status as GroomingFormData["status"],
          price: grooming.price,
          notes: grooming.notes || "",
        }
      : { status: "SCHEDULED" as const, serviceType: "BATH_AND_GROOMING" as const, notes: "" },
  });

  const onSubmit = async (data: GroomingFormData) => {
    try {
      const res = await fetch(grooming ? `/api/groomings/${grooming.id}` : "/api/groomings", {
        method: grooming ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      toast.success(grooming ? "Agendamento atualizado!" : "Agendamento criado!");
      onClose();
    } catch {
      toast.error("Erro ao salvar agendamento.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label>Pet *</Label>
        <Select onValueChange={(v) => setValue("petId", v || "")} defaultValue={String(grooming?.petId || "")}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o pet...">
              {(val: string) => val ? `${pets.find((p) => p.id === val)?.name ?? val} (${pets.find((p) => p.id === val)?.species ?? ""})` : "Selecione o pet..."}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {pets.map((p) => <SelectItem key={p.id} value={p.id}>{p.name} ({p.species})</SelectItem>)}
          </SelectContent>
        </Select>
        {errors.petId && <p className="text-xs text-red-500">{errors.petId.message}</p>}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="date">Data e Hora *</Label>
        <Input id="date" type="datetime-local" {...register("date")} />
        {errors.date && <p className="text-xs text-red-500">{errors.date.message}</p>}
      </div>
      <div className="space-y-1.5">
        <Label>Tipo de Serviço *</Label>
        <Select
          onValueChange={(v) => setValue("serviceType", v as GroomingFormData["serviceType"])}
          defaultValue={grooming?.serviceType || "BATH_AND_GROOMING"}
        >
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="BATH">Banho</SelectItem>
            <SelectItem value="GROOMING">Tosa</SelectItem>
            <SelectItem value="BATH_AND_GROOMING">Banho e Tosa</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="price">Preço (R$)</Label>
        <Input id="price" type="number" step="0.01" placeholder="0.00" {...register("price")} />
      </div>
      <div className="space-y-1.5">
        <Label>Status</Label>
        <Select
          onValueChange={(v) => setValue("status", (v || "SCHEDULED") as GroomingFormData["status"])}
          defaultValue={grooming?.status || "SCHEDULED"}
        >
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {Object.entries(statusMap).map(([val, { label }]) => (
              <SelectItem key={val} value={val}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="notes">Observações</Label>
        <Textarea id="notes" placeholder="Observações adicionais..." {...register("notes")} />
      </div>
      <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isSubmitting}>
        {isSubmitting ? "Salvando..." : "Salvar"}
      </Button>
    </form>
  );
}

export default function GroomingsPage() {
  const [groomings, setGroomings] = useState<Grooming[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState<Grooming | undefined>();

  const fetchData = useCallback(async () => {
    const [groomRes, petsRes] = await Promise.all([fetch("/api/groomings"), fetch("/api/pets")]);
    setGroomings(await groomRes.json());
    setPets(await petsRes.json());
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDelete = async (id: string) => {
    if (!confirm("Cancelar este agendamento?")) return;
    await fetch(`/api/groomings/${id}`, { method: "DELETE" });
    toast.success("Agendamento cancelado!");
    fetchData();
  };

  const handleClose = () => { setOpen(false); setEditItem(undefined); fetchData(); };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Banho e Tosa</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger
            render={
              <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => setEditItem(undefined)}>
                <FaPlus className="mr-2 text-xs" /> Novo Agendamento
              </Button>
            }
          />
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editItem ? "Editar" : "Novo"} Agendamento</DialogTitle>
            </DialogHeader>
            <GroomingForm grooming={editItem} pets={pets} onClose={handleClose} />
          </DialogContent>
        </Dialog>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">Pet</TableHead>
              <TableHead className="font-semibold">Serviço</TableHead>
              <TableHead className="font-semibold">Data</TableHead>
              <TableHead className="font-semibold">Preço</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {groomings.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-gray-400">Nenhum agendamento registrado</TableCell></TableRow>
            ) : groomings.map((g) => {
              const st = statusMap[g.status] || { label: g.status, color: "" };
              return (
                <TableRow key={g.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{g.pet?.name || "-"}</TableCell>
                  <TableCell>{serviceTypeMap[g.serviceType] || g.serviceType}</TableCell>
                  <TableCell>{new Date(g.date).toLocaleString("pt-BR")}</TableCell>
                  <TableCell>{g.price ? `R$ ${g.price.toFixed(2)}` : "-"}</TableCell>
                  <TableCell><Badge className={st.color}>{st.label}</Badge></TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button size="sm" variant="outline" onClick={() => { setEditItem(g); setOpen(true); }}><FaEdit className="text-xs" /></Button>
                      <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700" onClick={() => handleDelete(g.id)}><FaTrash className="text-xs" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
