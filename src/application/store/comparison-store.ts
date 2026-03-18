import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Comparison } from "@/domain/entities/comparison";
import type { SpreadsheetData } from "@/domain/entities/spreadsheet-data";
import { createComparisonEntity } from "@/domain/factories/comparison-factory";

interface ComparisonStore {
  comparisons: Comparison[];

  createComparison: (description: string) => string;
  deleteComparison: (id: string) => void;
  addSpreadsheet: (comparisonId: string, data: SpreadsheetData) => void;
  removeSpreadsheet: (comparisonId: string, spreadsheetId: string) => void;
  setManualCpfs: (comparisonId: string, cpfs: string[]) => void;
  getComparison: (id: string) => Comparison | undefined;
}

export const useComparisonStore = create<ComparisonStore>()(
  persist(
    (set, get) => ({
      comparisons: [],

      createComparison: (description: string) => {
        const comparison = createComparisonEntity(description);
        set((state) => ({
          comparisons: [...state.comparisons, comparison],
        }));
        return comparison.id;
      },

      deleteComparison: (id: string) => {
        set((state) => ({
          comparisons: state.comparisons.filter((c) => c.id !== id),
        }));
      },

      addSpreadsheet: (comparisonId: string, data: SpreadsheetData) => {
        set((state) => ({
          comparisons: state.comparisons.map((c) =>
            c.id === comparisonId
              ? { ...c, spreadsheets: [...c.spreadsheets, data] }
              : c
          ),
        }));
      },

      removeSpreadsheet: (comparisonId: string, spreadsheetId: string) => {
        set((state) => ({
          comparisons: state.comparisons.map((c) =>
            c.id === comparisonId
              ? {
                  ...c,
                  spreadsheets: c.spreadsheets.filter(
                    (s) => s.id !== spreadsheetId
                  ),
                }
              : c
          ),
        }));
      },

      setManualCpfs: (comparisonId: string, cpfs: string[]) => {
        set((state) => ({
          comparisons: state.comparisons.map((c) =>
            c.id === comparisonId ? { ...c, manualCpfs: cpfs } : c
          ),
        }));
      },

      getComparison: (id: string) => {
        return get().comparisons.find((c) => c.id === id);
      },
    }),
    {
      name: "comparador-planilhas-storage",
    }
  )
);
