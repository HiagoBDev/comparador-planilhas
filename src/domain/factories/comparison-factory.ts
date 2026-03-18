import { v4 as uuidv4 } from "uuid";
import type { Comparison } from "../entities/comparison";

export function createComparisonEntity(description: string): Comparison {
  return {
    id: uuidv4(),
    description,
    createdAt: new Date().toISOString(),
    spreadsheets: [],
    manualCpfs: [],
  };
}
