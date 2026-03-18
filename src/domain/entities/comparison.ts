import { z } from "zod/v4";
import { spreadsheetDataSchema } from "./spreadsheet-data";

export const comparisonSchema = z.object({
  id: z.string().uuid(),
  description: z.string().min(1, "Descrição é obrigatória"),
  createdAt: z.string().datetime(),
  spreadsheets: z.array(spreadsheetDataSchema),
  manualCpfs: z.array(z.string()),
});

export type Comparison = z.infer<typeof comparisonSchema>;
