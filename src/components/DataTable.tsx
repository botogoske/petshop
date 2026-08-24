"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "sonner";

interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (row: T) => React.ReactNode;
}

interface DataTableProps<T extends { id: string }> {
  title: string;
  data: T[];
  columns: Column<T>[];
  onDelete: (id: string) => Promise<void>;
  renderForm: (item?: T, onClose?: () => void) => React.ReactNode;
  onRefresh: () => void;
}

export function DataTable<T extends { id: string }>({
  title,
  data,
  columns,
  onDelete,
  renderForm,
  onRefresh,
}: DataTableProps<T>) {
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState<T | undefined>();

  const handleDelete = async (id: string) => {
    if (!confirm("Confirmar exclusão?")) return;
    try {
      await onDelete(id);
      toast.success("Removido com sucesso!");
      onRefresh();
    } catch {
      toast.error("Erro ao remover.");
    }
  };

  const handleClose = () => {
    setOpen(false);
    setEditItem(undefined);
    onRefresh();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger
            render={
              <Button
                className="bg-emerald-600 hover:bg-emerald-700"
                onClick={() => setEditItem(undefined)}
              >
                <FaPlus className="mr-2 text-xs" />
                Novo
              </Button>
            }
          />
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editItem ? "Editar" : "Novo"} {title.replace(/s$/, "")}</DialogTitle>
            </DialogHeader>
            {renderForm(editItem, handleClose)}
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              {columns.map((col) => (
                <TableHead key={col.key as string} className="font-semibold text-gray-700">
                  {col.label}
                </TableHead>
              ))}
              <TableHead className="font-semibold text-gray-700 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="text-center py-8 text-gray-400">
                  Nenhum registro encontrado
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow key={row.id} className="hover:bg-gray-50">
                  {columns.map((col) => (
                    <TableCell key={col.key as string}>
                      {col.render
                        ? col.render(row)
                        : String((row as Record<string, unknown>)[col.key as string] ?? "-")}
                    </TableCell>
                  ))}
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                          <Button
                                size="sm"
                                variant="outline"
                                onClick={() => { setEditItem(row); setOpen(true); }}
                              >
                                <FaEdit className="text-xs" />
                              </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700 hover:border-red-300"
                        onClick={() => handleDelete(row.id)}
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
