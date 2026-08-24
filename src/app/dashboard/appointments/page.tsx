"use client";

import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { appointmentSchema, type AppointmentFormData } from "@/lib/validations";
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
interface Veterinarian { id: string; name: string; }
interface Appointment {
  id: string;
  petId: string;
  veterinarianId: string;
  date: string;
  reason: string;
  notes?: string;
  status: string;
  pet?: { name: string; species: string };
  veterinarian?: { name: string };
}

const statusMap: Record<string, { label: string; color: string }> = {
  SCHEDULED: { label: "Agendada", color: "bg-blue-100 text-blue-700" },
  CONFIRMED: { label: "Confirmada", color: "bg-emerald-100 text-emerald-700" },
  COMPLETED: { label: "Concluída", color: "bg-gray-100 text-gray-700" },
  CANCELLED: { label: "Cancelada", color: "bg-red-100 text-red-700" },
};

function AppointmentForm({
  appointment, pets, vets, onClose,
}: {
  appointment?: Appointment; pets: Pet[]; vets: Veterinarian[]; onClose: () => void;
}) {
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(appointmentSchema),
    defaultValues: appointment
      ? {
          petId: appointment.petId,
          veterinarianId: appointment.veterinarianId,
          date: appointment.date.slice(0, 16),
          reason: appointment.reason,
          notes: appointment.notes || "",
          status: appointment.status as AppointmentFormData["status"],
        }
      : { status: "SCHEDULED" as const, notes: "" },
  });

  const onSubmit = async (data: AppointmentFormData) => {
    try {
      const res = await fetch(appointment ? `/api/appointments/${appointment.id}` : "/api/appointments", {
        method: appointment ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      toast.success(appointment ? "Consulta atualizada!" : "Consulta agendada!");
      onClose();
    } catch {
      toast.error("Erro ao salvar consulta.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label>Pet *</Label>
        <Select onValueChange={(v) => setValue("petId", v || "")} defaultValue={String(appointment?.petId ?? "")}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o pet...">
              {(val: string) => val ? (pets.find((p) => p.id === val)?.name ?? val) + ` (${pets.find((p) => p.id === val)?.species ?? ""})` : "Selecione o pet..."}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {pets.map((p) => <SelectItem key={p.id} value={p.id}>{p.name} ({p.species})</SelectItem>)}
          </SelectContent>
        </Select>
        {errors.petId && <p className="text-xs text-red-500">{errors.petId.message}</p>}
      </div>
      <div className="space-y-1.5">
        <Label>Veterinário *</Label>
        <Select onValueChange={(v) => setValue("veterinarianId", v || "")} defaultValue={String(appointment?.veterinarianId ?? "")}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o veterinário...">
              {(val: string) => val ? (vets.find((v) => v.id === val)?.name ?? val) : "Selecione o veterinário..."}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {vets.map((v) => <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>)}
          </SelectContent>
        </Select>
        {errors.veterinarianId && <p className="text-xs text-red-500">{errors.veterinarianId.message}</p>}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="date">Data e Hora *</Label>
        <Input id="date" type="datetime-local" {...register("date")} />
        {errors.date && <p className="text-xs text-red-500">{errors.date.message}</p>}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="reason">Motivo *</Label>
        <Input id="reason" placeholder="Motivo da consulta..." {...register("reason")} />
        {errors.reason && <p className="text-xs text-red-500">{errors.reason.message}</p>}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="notes">Observações</Label>
        <Textarea id="notes" placeholder="Observações adicionais..." {...register("notes")} />
      </div>
      <div className="space-y-1.5">
        <Label>Status</Label>
        <Select
          onValueChange={(v) => setValue("status", (v || "SCHEDULED") as AppointmentFormData["status"])}
          defaultValue={appointment?.status || "SCHEDULED"}
        >
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {Object.entries(statusMap).map(([val, { label }]) => (
              <SelectItem key={val} value={val}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isSubmitting}>
        {isSubmitting ? "Salvando..." : "Salvar"}
      </Button>
    </form>
  );
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [vets, setVets] = useState<Veterinarian[]>([]);
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState<Appointment | undefined>();

  const fetchData = useCallback(async () => {
    const [apptRes, petsRes, vetsRes] = await Promise.all([
      fetch("/api/appointments"),
      fetch("/api/pets"),
      fetch("/api/veterinarians"),
    ]);
    setAppointments(await apptRes.json());
    setPets(await petsRes.json());
    setVets(await vetsRes.json());
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDelete = async (id: string) => {
    if (!confirm("Cancelar esta consulta?")) return;
    await fetch(`/api/appointments/${id}`, { method: "DELETE" });
    toast.success("Consulta cancelada!");
    fetchData();
  };

  const handleClose = () => { setOpen(false); setEditItem(undefined); fetchData(); };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Consultas</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger
            render={
              <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => setEditItem(undefined)}>
                <FaPlus className="mr-2 text-xs" /> Nova Consulta
              </Button>
            }
          />
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editItem ? "Editar" : "Nova"} Consulta</DialogTitle>
            </DialogHeader>
            <AppointmentForm appointment={editItem} pets={pets} vets={vets} onClose={handleClose} />
          </DialogContent>
        </Dialog>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">Pet</TableHead>
              <TableHead className="font-semibold">Veterinário</TableHead>
              <TableHead className="font-semibold">Data</TableHead>
              <TableHead className="font-semibold">Motivo</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointments.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-gray-400">Nenhuma consulta agendada</TableCell></TableRow>
            ) : appointments.map((a) => {
              const st = statusMap[a.status] || { label: a.status, color: "" };
              return (
                <TableRow key={a.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{a.pet?.name || "-"}</TableCell>
                  <TableCell>{a.veterinarian?.name || "-"}</TableCell>
                  <TableCell>{new Date(a.date).toLocaleString("pt-BR")}</TableCell>
                  <TableCell>{a.reason}</TableCell>
                  <TableCell><Badge className={st.color}>{st.label}</Badge></TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button size="sm" variant="outline" onClick={() => { setEditItem(a); setOpen(true); }}><FaEdit className="text-xs" /></Button>
                      <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700" onClick={() => handleDelete(a.id)}><FaTrash className="text-xs" /></Button>
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
