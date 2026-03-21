import { useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useComparison } from "@/application/hooks/use-comparison";
import {
  comparePeople,
  type ComparisonResult,
} from "@/application/use-cases/compare-people";
import { readSpreadsheetFile } from "@/infra/spreadsheet/spreadsheet-reader";
import { toast } from "sonner";

type ResultsState = "idle" | "loading" | "success";

export function useComparisonPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { comparison, addSheet, removeSheet, setCpfs } = useComparison(
    id ?? ""
  );

  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [resultsState, setResultsState] = useState<ResultsState>("idle");
  const [results, setResults] = useState<ComparisonResult | null>(null);
  const [isStale, setIsStale] = useState(false);

  // Track whether a comparison has been done at least once
  const hasComparedRef = useRef(false);

  const handleFilesSelected = useCallback(
    async (files: File[]) => {
      setIsUploading(true);
      setUploadError(null);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      try {
        for (const file of files) {
          const data = await readSpreadsheetFile(file);
          addSheet(data);
        }
        toast.success("Planilhas adicionadas com sucesso!");

        // Mark results as stale if we already compared
        if (hasComparedRef.current) {
          setIsStale(true);
        }
      } catch (err) {
        toast.error("Erro ao ler planilha.");
        setUploadError(
          err instanceof Error ? err.message : "Erro ao ler planilha."
        );
      } finally {
        setIsUploading(false);
      }
    },
    [addSheet]
  );

  const handleSaveCpfs = useCallback(
    async (cpfs: string[]) => {
      await setCpfs(cpfs);

      // Mark results as stale if we already compared
      if (hasComparedRef.current) {
        setIsStale(true);
      }
    },
    [setCpfs]
  );

  const handleCompare = useCallback(async () => {
    if (!comparison) return;

    setResults(null);
    setResultsState("loading");

    await new Promise((resolve) => setTimeout(resolve, 2500));

    const result = comparePeople(comparison);

    setResults(result);
    setResultsState("success");
    setIsStale(false);
    hasComparedRef.current = true;

    toast.success("Comparação realizada com sucesso!");
  }, [comparison]);

  const canCompare =
    (comparison?.spreadsheets.length ?? 0) >= 1;
  const isComparing = resultsState === "loading";

  return {
    comparison,
    navigate,
    // Upload
    isUploading,
    uploadError,
    handleFilesSelected,
    // CPFs
    handleSaveCpfs,
    // Comparison
    resultsState,
    results,
    isStale,
    canCompare,
    isComparing,
    handleCompare,
    // Spreadsheet management
    removeSheet,
  };
}
