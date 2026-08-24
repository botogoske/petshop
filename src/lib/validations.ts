import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

export const employeeSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres").optional().or(z.literal("")),
  phone: z.string().optional(),
  role: z.enum(["ADMIN", "EMPLOYEE"]),
  active: z.boolean().default(true),
});

export const veterinarianSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(10, "Telefone inválido"),
  crmv: z.string().min(4, "CRMV inválido"),
  specialty: z.string().optional(),
  active: z.boolean().default(true),
});

export const tutorSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(10, "Telefone inválido"),
  cpf: z.string().min(11, "CPF inválido"),
  address: z.string().optional(),
  active: z.boolean().default(true),
});

export const petSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  species: z.string().min(2, "Espécie é obrigatória"),
  breed: z.string().optional(),
  birthDate: z.string().optional(),
  weight: z.coerce.number().optional(),
  color: z.string().optional(),
  tutorId: z.string().min(1, "Tutor é obrigatório"),
  active: z.boolean().default(true),
});

export const productSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  description: z.string().optional(),
  price: z.coerce.number().min(0, "Preço deve ser maior que 0"),
  stock: z.coerce.number().min(0, "Estoque não pode ser negativo"),
  category: z.string().min(2, "Categoria é obrigatória"),
  brand: z.string().optional(),
  active: z.boolean().default(true),
});

export const appointmentSchema = z.object({
  petId: z.string().min(1, "Pet é obrigatório"),
  veterinarianId: z.string().min(1, "Veterinário é obrigatório"),
  date: z.string().min(1, "Data é obrigatória"),
  reason: z.string().min(5, "Motivo deve ter pelo menos 5 caracteres"),
  notes: z.string().optional(),
  status: z.enum(["SCHEDULED", "CONFIRMED", "COMPLETED", "CANCELLED"]).default("SCHEDULED"),
});

export const vaccineSchema = z.object({
  petId: z.string().min(1, "Pet é obrigatório"),
  veterinarianId: z.string().min(1, "Veterinário é obrigatório"),
  name: z.string().min(2, "Nome da vacina é obrigatório"),
  date: z.string().min(1, "Data é obrigatória"),
  nextDoseDate: z.string().optional(),
  lot: z.string().optional(),
  notes: z.string().optional(),
});

export const groomingSchema = z.object({
  petId: z.string().min(1, "Pet é obrigatório"),
  date: z.string().min(1, "Data é obrigatória"),
  serviceType: z.enum(["BATH", "GROOMING", "BATH_AND_GROOMING"]),
  price: z.coerce.number().optional(),
  notes: z.string().optional(),
  status: z.enum(["SCHEDULED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]).default("SCHEDULED"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type EmployeeFormData = z.infer<typeof employeeSchema>;
export type VeterinarianFormData = z.infer<typeof veterinarianSchema>;
export type TutorFormData = z.infer<typeof tutorSchema>;
export type PetFormData = z.infer<typeof petSchema>;
export type ProductFormData = z.infer<typeof productSchema>;
export type AppointmentFormData = z.infer<typeof appointmentSchema>;
export type VaccineFormData = z.infer<typeof vaccineSchema>;
export type GroomingFormData = z.infer<typeof groomingSchema>;
