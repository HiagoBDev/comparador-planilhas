import { useMemo, useCallback } from "react";
import { useComparisonStore } from "@/application/store/comparison-store";
import type { SpreadsheetData } from "@/domain/entities/spreadsheet-data";
import { toast } from "sonner";

export function useComparison(id: string) {
  const comparisons = useComparisonStore((s) => s.comparisons);
  const addSpreadsheet = useComparisonStore((s) => s.addSpreadsheet);
  const removeSpreadsheet = useComparisonStore((s) => s.removeSpreadsheet);
  const setManualCpfs = useComparisonStore((s) => s.setManualCpfs);
  const deleteComparison = useComparisonStore((s) => s.deleteComparison);

  const comparison = useMemo(
    () => comparisons.find((c) => c.id === id),
    [comparisons, id]
  );

  const addSheet = useCallback(
    async (data: SpreadsheetData) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      addSpreadsheet(id, data);
      toast.success("Planilha adicionada com sucesso!");
    },
    [id, addSpreadsheet]
  );

  const removeSheet = useCallback(
    async (spreadsheetId: string) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      removeSpreadsheet(id, spreadsheetId);
      toast.success("Planilha removida com sucesso!");
    },
    [id, removeSpreadsheet]
  );

  const setCpfs = useCallback(
    async (cpfs: string[]) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setManualCpfs(id, cpfs);
      toast.success("CPFs adicionados com sucesso!");
    },
    [id, setManualCpfs]
  );

  const remove = useCallback(
    async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      deleteComparison(id);
      toast.success("Comparação removida com sucesso!");
    },
    [id, deleteComparison]
  );

  return {
    comparison,
    addSheet,
    removeSheet,
    setCpfs,
    remove,
  };
}
