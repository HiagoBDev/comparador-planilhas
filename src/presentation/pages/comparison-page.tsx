import { useComparisonPage } from "@/presentation/hooks/use-comparison-page";
import { Layout } from "@/components/layout";
import { FileDropzone } from "@/components/file-dropzone";
import { SpreadsheetList } from "@/components/spreadsheet-list";
import { ManualCpfForm } from "@/components/manual-cpf-form";
import { ComparisonResults } from "@/components/comparison-results";
import { HelpPopover } from "@/components/shared/help-popover";
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
  CircleNotchIcon,
  ArrowsClockwiseIcon,
} from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";

export function ComparisonPage() {
  const {
    comparison,
    navigate,
    isUploading,
    uploadError,
    handleFilesSelected,
    handleSaveCpfs,
    resultsState,
    results,
    isStale,
    canCompare,
    isComparing,
    handleCompare,
    removeSheet,
  } = useComparisonPage();

  function renderResultsContent() {
    if (resultsState === "loading") {
      return (
        <div className="space-y-4">
          <div className="flex gap-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24" />
          </div>
          <Skeleton className="h-[300px] w-full" />
        </div>
      );
    }

    if (resultsState === "success" && results) {
      return <ComparisonResults results={results} />;
    }

    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <ChartBarIcon className="mb-3 size-10 text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground">
          Nenhuma comparação realizada ainda.
        </p>
        <p className="mt-1 text-xs text-muted-foreground/70">
          Clique em "Comparar" para gerar os resultados.
        </p>
      </div>
    );
  }

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
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <UploadSimpleIcon className="size-4" />
                Planilhas
              </CardTitle>
              <HelpPopover>
                <div>
                  Oi, <strong className="text-primary whitespace-nowrap">bonitinha</strong>! Aqui você coloca suas planilhas (.xlsx, .xls,
                  .csv). Só precisa que elas tenham uma coluna chamada{" "}
                  <strong>cpf</strong> e outra <strong>nome</strong>. Pode
                  adicionar quantas quiser, tá?
                </div>
              </HelpPopover>
            </div>
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
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <ListNumbersIcon className="size-4" />
                CPFs Manuais
              </CardTitle>
              <HelpPopover>
                <div>
                  Quer procurar alguém em específico, <strong className="text-primary whitespace-nowrap">bonitinha</strong>? Digita os CPFs
                  aqui, um por linha. A gente vai verificar em quais planilhas
                  cada um aparece!
                </div>
              </HelpPopover>
            </div>
            <CardDescription>
              Insira CPFs para verificar se estão nas planilhas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ManualCpfForm
              initialCpfs={comparison.manualCpfs}
              onSave={handleSaveCpfs}
            />
          </CardContent>
        </Card>
      </div>

      <Separator className="my-6" />

      {/* Stale data warning */}
      {isStale && (
        <div className="mb-4 flex items-center gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-400">
          <ArrowsClockwiseIcon className="size-5 shrink-0" weight="bold" />
          <p>
            Os dados foram alterados desde a última comparação, <strong className="text-primary whitespace-nowrap">bonitinha</strong>.
            Clique em <strong>Comparar</strong> para atualizar os resultados!
          </p>
        </div>
      )}

      <div className="flex justify-center">
        <Button
          size="lg"
          disabled={!canCompare || isComparing}
          onClick={handleCompare}
          className={` cursor-pointer ${
            isStale ? "animate-pulse" : ""
          }`}
        >
          {isComparing ? (
            <CircleNotchIcon
              className="size-5 animate-spin"
              data-icon="inline-start"
            />
          ) : (
            <ScalesIcon
              className="size-5"
              weight="bold"
              data-icon="inline-start"
            />
          )}
          {isComparing
            ? "Comparando..."
            : isStale
              ? "Comparar novamente"
              : "Comparar"}
        </Button>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <ChartBarIcon className="size-4" />
                Resultados
              </CardTitle>
              <HelpPopover>
                <div className="space-y-4 text-sm">
                  <p>
                    Aqui ficam os resultados da comparação,{" "}
                    <strong className="text-primary whitespace-nowrap">
                      bonitinha
                    </strong>
                    !
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Badge className="min-w-[90px] justify-center bg-green-500/10 text-green-600">
                        Presentes
                      </Badge>
                      <p className="text-muted-foreground">
                        Pessoas encontradas em todas as planilhas.
                      </p>
                    </div>

                    <div className="flex items-start gap-3">
                      <Badge className="min-w-[90px] justify-center bg-red-500/10 text-red-600">
                        Ausentes
                      </Badge>
                      <p className="text-muted-foreground">
                        Pessoas que faltam em alguma planilha.
                      </p>
                    </div>

                    <div className="flex items-start gap-3">
                      <Badge className="min-w-[90px] justify-center bg-yellow-500/10 text-yellow-600">
                        Duplicados
                      </Badge>
                      <p className="text-muted-foreground">
                        CPFs repetidos dentro da mesma planilha.
                      </p>
                    </div>

                    <div className="flex items-start gap-3">
                      <Badge className="min-w-[90px] justify-center bg-blue-500/10 text-blue-600">
                        Manuais
                      </Badge>
                      <p className="text-muted-foreground">
                        Status dos CPFs que você digitou.
                      </p>
                    </div>
                  </div>
                </div>
              </HelpPopover>
            </div>
            <CardDescription>
              Análise da comparação entre{" "}
              {comparison.spreadsheets.length} planilha(s)
              {comparison.manualCpfs.length > 0 &&
                ` e ${comparison.manualCpfs.length} CPF(s) manual(is)`}
              .
            </CardDescription>
          </CardHeader>

          <CardContent>{renderResultsContent()}</CardContent>
        </Card>
      </div>
    </Layout>
  );
}