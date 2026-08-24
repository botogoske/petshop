"use client";

import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { petSchema, type PetFormData } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

interface Tutor { id: string; name: string; }
interface Pet {
  id: string;
  name: string;
  species: string;
  breed?: string;
  birthDate?: string;
  weight?: number;
  color?: string;
  tutorId: string;
  active: boolean;
  tutor?: { name: string };
}

function PetForm({ pet, tutors, onClose }: { pet?: Pet; tutors: Tutor[]; onClose: () => void }) {
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(petSchema),
    defaultValues: pet
      ? {
          name: pet.name,
          species: pet.species,
          breed: pet.breed || "",
          birthDate: pet.birthDate ? pet.birthDate.slice(0, 10) : "",
          weight: pet.weight,
          color: pet.color || "",
          tutorId: pet.tutorId,
          active: pet.active,
        }
      : { active: true, breed: "", birthDate: "", color: "" },
  });

  const onSubmit = async (data: PetFormData) => {
    try {
      const res = await fetch(pet ? `/api/pets/${pet.id}` : "/api/pets", {
        method: pet ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      toast.success(pet ? "Pet atualizado!" : "Pet cadastrado!");
      onClose();
    } catch {
      toast.error("Erro ao salvar pet.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="name">Nome *</Label>
        <Input id="name" placeholder="Nome do pet" {...register("name")} />
        {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="species">Espécie *</Label>
          <Input id="species" placeholder="Cão, Gato..." {...register("species")} />
          {errors.species && <p className="text-xs text-red-500">{errors.species.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="breed">Raça</Label>
          <Input id="breed" placeholder="Golden Retriever..." {...register("breed")} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="birthDate">Data de Nascimento</Label>
          <Input id="birthDate" type="date" {...register("birthDate")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="weight">Peso (kg)</Label>
          <Input id="weight" type="number" step="0.1" placeholder="4.5" {...register("weight")} />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="color">Cor / Pelagem</Label>
        <Input id="color" placeholder="Caramelo, Preto e Branco..." {...register("color")} />
      </div>
      <div className="space-y-1.5">
        <Label>Tutor *</Label>
        <Select onValueChange={(v) => setValue("tutorId", v || "")} defaultValue={String(pet?.tutorId ?? "")}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tutor...">
              {(val: string) => val ? (tutors.find((t) => t.id === val)?.name ?? val) : "Selecione o tutor..."}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {tutors.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
          </SelectContent>
        </Select>
        {errors.tutorId && <p className="text-xs text-red-500">{errors.tutorId.message}</p>}
      </div>
      <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isSubmitting}>
        {isSubmitting ? "Salvando..." : "Salvar"}
      </Button>
    </form>
  );
}

export default function PetsPage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState<Pet | undefined>();

  const fetchData = useCallback(async () => {
    const [petsRes, tutorsRes] = await Promise.all([fetch("/api/pets"), fetch("/api/tutors")]);
    setPets(await petsRes.json());
    setTutors(await tutorsRes.json());
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDelete = async (id: string) => {
    if (!confirm("Confirmar exclusão?")) return;
    await fetch(`/api/pets/${id}`, { method: "DELETE" });
    toast.success("Pet removido!");
    fetchData();
  };

  const handleClose = () => { setOpen(false); setEditItem(undefined); fetchData(); };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Pets</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger
            render={
              <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => setEditItem(undefined)}>
                <FaPlus className="mr-2 text-xs" /> Novo Pet
              </Button>
            }
          />
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editItem ? "Editar" : "Novo"} Pet</DialogTitle>
            </DialogHeader>
            <PetForm pet={editItem} tutors={tutors} onClose={handleClose} />
          </DialogContent>
        </Dialog>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">Nome</TableHead>
              <TableHead className="font-semibold">Espécie / Raça</TableHead>
              <TableHead className="font-semibold">Peso</TableHead>
              <TableHead className="font-semibold">Tutor</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pets.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-gray-400">Nenhum pet cadastrado</TableCell></TableRow>
            ) : pets.map((p) => (
              <TableRow key={p.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">{p.name}</TableCell>
                <TableCell>{p.species}{p.breed ? ` / ${p.breed}` : ""}</TableCell>
                <TableCell>{p.weight ? `${p.weight} kg` : "-"}</TableCell>
                <TableCell>{p.tutor?.name || "-"}</TableCell>
                <TableCell><Badge className={p.active ? "bg-emerald-100 text-emerald-700" : ""}>{p.active ? "Ativo" : "Inativo"}</Badge></TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button size="sm" variant="outline" onClick={() => { setEditItem(p); setOpen(true); }}><FaEdit className="text-xs" /></Button>
                    <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700" onClick={() => handleDelete(p.id)}><FaTrash className="text-xs" /></Button>
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
