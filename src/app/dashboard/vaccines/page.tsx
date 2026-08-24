"use client";

import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { vaccineSchema, type VaccineFormData } from "@/lib/validations";
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
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "sonner";

interface Pet { id: string; name: string; species: string; }
interface Veterinarian { id: string; name: string; }
interface Vaccine {
  id: string;
  petId: string;
  veterinarianId: string;
  name: string;
  date: string;
  nextDoseDate?: string;
  lot?: string;
  notes?: string;
  pet?: { name: string; species: string };
  veterinarian?: { name: string };
}

function VaccineForm({
  vaccine, pets, vets, onClose,
}: {
  vaccine?: Vaccine; pets: Pet[]; vets: Veterinarian[]; onClose: () => void;
}) {
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(vaccineSchema),
    defaultValues: vaccine
      ? {
          petId: vaccine.petId,
          veterinarianId: vaccine.veterinarianId,
          name: vaccine.name,
          date: vaccine.date.slice(0, 10),
          nextDoseDate: vaccine.nextDoseDate?.slice(0, 10) || "",
          lot: vaccine.lot || "",
          notes: vaccine.notes || "",
        }
      : { lot: "", notes: "", nextDoseDate: "" },
  });

  const onSubmit = async (data: VaccineFormData) => {
    try {
      const res = await fetch(vaccine ? `/api/vaccines/${vaccine.id}` : "/api/vaccines", {
        method: vaccine ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      toast.success(vaccine ? "Vacina atualizada!" : "Vacina registrada!");
      onClose();
    } catch {
      toast.error("Erro ao salvar vacina.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label>Pet *</Label>
        <Select onValueChange={(v) => setValue("petId", v || "")} defaultValue={String(vaccine?.petId ?? "")}>
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
        <Label>Veterinário Responsável *</Label>
        <Select onValueChange={(v) => setValue("veterinarianId", v || "")} defaultValue={String(vaccine?.veterinarianId ?? "")}>
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
        <Label htmlFor="name">Nome da Vacina *</Label>
        <Input id="name" placeholder="Ex: V10, Antirrábica..." {...register("name")} />
        {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="date">Data de Aplicação *</Label>
          <Input id="date" type="date" {...register("date")} />
          {errors.date && <p className="text-xs text-red-500">{errors.date.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="nextDoseDate">Próxima Dose</Label>
          <Input id="nextDoseDate" type="date" {...register("nextDoseDate")} />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="lot">Lote</Label>
        <Input id="lot" placeholder="Número do lote" {...register("lot")} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="notes">Observações</Label>
        <Textarea id="notes" placeholder="Observações..." {...register("notes")} />
      </div>
      <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isSubmitting}>
        {isSubmitting ? "Salvando..." : "Salvar"}
      </Button>
    </form>
  );
}

export default function VaccinesPage() {
  const [vaccines, setVaccines] = useState<Vaccine[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [vets, setVets] = useState<Veterinarian[]>([]);
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState<Vaccine | undefined>();

  const fetchData = useCallback(async () => {
    const [vaxRes, petsRes, vetsRes] = await Promise.all([
      fetch("/api/vaccines"),
      fetch("/api/pets"),
      fetch("/api/veterinarians"),
    ]);
    setVaccines(await vaxRes.json());
    setPets(await petsRes.json());
    setVets(await vetsRes.json());
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDelete = async (id: string) => {
    if (!confirm("Confirmar exclusão?")) return;
    await fetch(`/api/vaccines/${id}`, { method: "DELETE" });
    toast.success("Vacina removida!");
    fetchData();
  };

  const handleClose = () => { setOpen(false); setEditItem(undefined); fetchData(); };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Vacinas</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger
            render={
              <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => setEditItem(undefined)}>
                <FaPlus className="mr-2 text-xs" /> Registrar Vacina
              </Button>
            }
          />
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editItem ? "Editar" : "Registrar"} Vacina</DialogTitle>
            </DialogHeader>
            <VaccineForm vaccine={editItem} pets={pets} vets={vets} onClose={handleClose} />
          </DialogContent>
        </Dialog>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">Pet</TableHead>
              <TableHead className="font-semibold">Vacina</TableHead>
              <TableHead className="font-semibold">Veterinário</TableHead>
              <TableHead className="font-semibold">Data</TableHead>
              <TableHead className="font-semibold">Próxima Dose</TableHead>
              <TableHead className="font-semibold">Lote</TableHead>
              <TableHead className="font-semibold text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vaccines.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center py-8 text-gray-400">Nenhuma vacina registrada</TableCell></TableRow>
            ) : vaccines.map((v) => (
              <TableRow key={v.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">{v.pet?.name || "-"}</TableCell>
                <TableCell>{v.name}</TableCell>
                <TableCell>{v.veterinarian?.name || "-"}</TableCell>
                <TableCell>{new Date(v.date).toLocaleDateString("pt-BR")}</TableCell>
                <TableCell>{v.nextDoseDate ? new Date(v.nextDoseDate).toLocaleDateString("pt-BR") : "-"}</TableCell>
                <TableCell>{v.lot || "-"}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button size="sm" variant="outline" onClick={() => { setEditItem(v); setOpen(true); }}><FaEdit className="text-xs" /></Button>
                    <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700" onClick={() => handleDelete(v.id)}><FaTrash className="text-xs" /></Button>
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
