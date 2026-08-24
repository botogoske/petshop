"use client";

import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, type ProductFormData } from "@/lib/validations";
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

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  category: string;
  brand?: string;
  active: boolean;
}

function ProductForm({ product, onClose }: { product?: Product; onClose: () => void }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: product || { active: true, stock: 0, description: "", brand: "" },
  });

  const onSubmit = async (data: ProductFormData) => {
    try {
      const res = await fetch(product ? `/api/products/${product.id}` : "/api/products", {
        method: product ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      toast.success(product ? "Produto atualizado!" : "Produto criado!");
      onClose();
    } catch {
      toast.error("Erro ao salvar produto.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="name">Nome *</Label>
        <Input id="name" placeholder="Nome do produto" {...register("name")} />
        {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="description">Descrição</Label>
        <Textarea id="description" placeholder="Descrição do produto..." {...register("description")} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="price">Preço (R$) *</Label>
          <Input id="price" type="number" step="0.01" placeholder="0.00" {...register("price")} />
          {errors.price && <p className="text-xs text-red-500">{errors.price.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="stock">Estoque *</Label>
          <Input id="stock" type="number" placeholder="0" {...register("stock")} />
          {errors.stock && <p className="text-xs text-red-500">{errors.stock.message}</p>}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="category">Categoria *</Label>
          <Input id="category" placeholder="Ração, Brinquedo..." {...register("category")} />
          {errors.category && <p className="text-xs text-red-500">{errors.category.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="brand">Marca</Label>
          <Input id="brand" placeholder="Marca do produto" {...register("brand")} />
        </div>
      </div>
      <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isSubmitting}>
        {isSubmitting ? "Salvando..." : "Salvar"}
      </Button>
    </form>
  );
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState<Product | undefined>();

  const fetchProducts = useCallback(async () => {
    const res = await fetch("/api/products");
    setProducts(await res.json());
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleDelete = async (id: string) => {
    if (!confirm("Confirmar exclusão?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    toast.success("Produto removido!");
    fetchProducts();
  };

  const handleClose = () => { setOpen(false); setEditItem(undefined); fetchProducts(); };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Produtos</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger
            render={
              <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => setEditItem(undefined)}>
                <FaPlus className="mr-2 text-xs" /> Novo Produto
              </Button>
            }
          />
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editItem ? "Editar" : "Novo"} Produto</DialogTitle>
            </DialogHeader>
            <ProductForm product={editItem} onClose={handleClose} />
          </DialogContent>
        </Dialog>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">Nome</TableHead>
              <TableHead className="font-semibold">Categoria</TableHead>
              <TableHead className="font-semibold">Marca</TableHead>
              <TableHead className="font-semibold">Preço</TableHead>
              <TableHead className="font-semibold">Estoque</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center py-8 text-gray-400">Nenhum produto cadastrado</TableCell></TableRow>
            ) : products.map((p) => (
              <TableRow key={p.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">{p.name}</TableCell>
                <TableCell>{p.category}</TableCell>
                <TableCell>{p.brand || "-"}</TableCell>
                <TableCell>R$ {p.price.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge variant={p.stock > 0 ? "default" : "destructive"} className={p.stock > 0 ? "bg-emerald-100 text-emerald-700" : ""}>
                    {p.stock} un
                  </Badge>
                </TableCell>
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
