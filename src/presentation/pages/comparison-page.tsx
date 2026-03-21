import { useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useComparison } from "@/application/hooks/use-comparison";
import {
  comparePeople,
  type ComparisonResult,
} from "@/application/use-cases/compare-people";
import { readSpreadsheetFile } from "@/infra/spreadsheet/spreadsheet-reader";
import { Layout } from "@/components/layout";
import { FileDropzone } from "@/components/file-dropzone";
import { SpreadsheetList } from "@/components/spreadsheet-list";
import { ManualCpfForm } from "@/components/manual-cpf-form";
import { ComparisonResults } from "@/components/comparison-results";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ScalesIcon,
  UploadSimpleIcon,
  ListNumbersIcon,
  ChartBarIcon,
  WarningIcon,
  CircleNotch,
} from "@phosphor-icons/react";
import { toast } from "sonner";

export function ComparisonPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { comparison, addSheet, removeSheet, setCpfs } = useComparison(
    id ?? ""
  );

  const [isUploading, setIsUploading] = useState(false);
  const [isComparing, setIsComparing] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [results, setResults] = useState<ComparisonResult | null>(null);

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

  const handleCompare = useCallback(async () => {
    if (!comparison) return;
    setIsComparing(true);
    await new Promise((resolve) => setTimeout(resolve, 2500));
    
    const result = comparePeople(comparison);
    setResults(result);
    setIsComparing(false);
    toast.success("Comparação realizada com sucesso!");
  }, [comparison]);

  if (!comparison) {
    return (
      <Layout>
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <WarningIcon className="size-12 text-muted-foreground/50" />
          <div>
            <h2 className="text-lg font-semibold">Comparação não encontrada</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Essa comparação pode ter sido excluída.
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate("/")}>
            Voltar ao início
          </Button>
        </div>
      </Layout>
    );
  }

  const canCompare = comparison.spreadsheets.length >= 1;

  return (
    <Layout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {comparison.description}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Adicione planilhas e CPFs para comparar.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <UploadSimpleIcon className="size-4" />
              Planilhas
            </CardTitle>
            <CardDescription>
              Faça upload de planilhas com colunas "cpf" e "nome".
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <FileDropzone
              onFilesSelected={handleFilesSelected}
              isLoading={isUploading}
            />
            {uploadError && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
                {uploadError}
              </div>
            )}
            <SpreadsheetList
              spreadsheets={comparison.spreadsheets}
              onRemove={removeSheet}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ListNumbersIcon className="size-4" />
              CPFs Manuais
            </CardTitle>
            <CardDescription>
              Insira CPFs para verificar se estão nas planilhas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ManualCpfForm
              initialCpfs={comparison.manualCpfs}
              onSave={setCpfs}
            />
          </CardContent>
        </Card>
      </div>

      <Separator className="my-6" />

      <div className="flex justify-center">
        <Button
          size="lg"
          disabled={!canCompare || isComparing}
          onClick={handleCompare}
          className="gap-2 px-8"
        >
          {isComparing ? (
            <CircleNotch className="size-5 animate-spin" data-icon="inline-start" />
          ) : (
            <ScalesIcon className="size-5" weight="bold" data-icon="inline-start" />
          )}
          {isComparing ? "Comparando..." : "Comparar"}
        </Button>
      </div>

      {results && (
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <ChartBarIcon className="size-4" />
                Resultados
              </CardTitle>
              <CardDescription>
                Análise da comparação entre{" "}
                {comparison.spreadsheets.length} planilha(s)
                {comparison.manualCpfs.length > 0 &&
                  ` e ${comparison.manualCpfs.length} CPF(s) manual(is)`}
                .
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isComparing ? (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-8 w-24" />
                  </div>
                  <Skeleton className="h-[300px] w-full" />
                </div>
              ) : (
                <ComparisonResults results={results} />
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </Layout>
  );
}
