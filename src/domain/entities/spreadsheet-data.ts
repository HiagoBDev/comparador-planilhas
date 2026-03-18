import { z } from "zod/v4";
import { personSchema } from "./person";

export const spreadsheetDataSchema = z.object({
  id: z.string().uuid(),
  fileName: z.string().min(1),
  people: z.array(personSchema),
  uploadedAt: z.string().datetime(),
});

export type SpreadsheetData = z.infer<typeof spreadsheetDataSchema>;
