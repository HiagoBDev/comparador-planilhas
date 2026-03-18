import { useMemo, useCallback } from "react";
import { useComparisonStore } from "@/application/store/comparison-store";
import type { SpreadsheetData } from "@/domain/entities/spreadsheet-data";

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
    (data: SpreadsheetData) => addSpreadsheet(id, data),
    [id, addSpreadsheet]
  );

  const removeSheet = useCallback(
    (spreadsheetId: string) => removeSpreadsheet(id, spreadsheetId),
    [id, removeSpreadsheet]
  );

  const setCpfs = useCallback(
    (cpfs: string[]) => setManualCpfs(id, cpfs),
    [id, setManualCpfs]
  );

  const remove = useCallback(
    () => deleteComparison(id),
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
