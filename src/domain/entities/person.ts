import { z } from "zod/v4";

export const personSchema = z.object({
  cpf: z
    .string()
    .transform((val) => val.replace(/\D/g, "").padStart(11, "0"))
    .pipe(z.string().length(11, "CPF deve ter 11 dígitos")),
  nome: z.string().min(1, "Nome é obrigatório"),
});

export type Person = z.infer<typeof personSchema>;

export function normalizeCpf(cpf: string): string {
  return cpf.replace(/\D/g, "").padStart(11, "0");
}

export function formatCpf(cpf: string): string {
  const digits = normalizeCpf(cpf);
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}
