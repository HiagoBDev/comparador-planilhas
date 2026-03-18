import { useComparisonStore } from "@/application/store/comparison-store";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/presentation/components/layout";
import { ComparisonCard } from "@/presentation/components/comparison-card";
import { CreateComparisonDialog } from "@/presentation/components/create-comparison-dialog";
import { FileXlsIcon } from "@phosphor-icons/react";

export function HomePage() {
  const comparisons = useComparisonStore((s) => s.comparisons);
  const createComparison = useComparisonStore((s) => s.createComparison);
  const deleteComparison = useComparisonStore((s) => s.deleteComparison);
  const navigate = useNavigate();

  const handleCreate = (description: string) => {
    const id = createComparison(description);
    navigate(`/comparison/${id}`);
  };

  return (
    <Layout>
      <div className="mb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Suas Comparações
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Crie e gerencie comparações de planilhas baseadas em CPF.
            </p>
          </div>
          <CreateComparisonDialog onCreate={handleCreate} />
        </div>
      </div>

      {comparisons.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border px-6 py-16 text-center">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-muted">
            <FileXlsIcon
              className="size-8 text-muted-foreground/60"
              weight="duotone"
            />
          </div>
          <div>
            <h3 className="font-semibold">Nenhuma comparação ainda</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Crie sua primeira comparação para começar a analisar planilhas.
            </p>
          </div>
          <CreateComparisonDialog onCreate={handleCreate} />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {comparisons.map((comparison) => (
            <ComparisonCard
              key={comparison.id}
              comparison={comparison}
              onDelete={deleteComparison}
            />
          ))}
        </div>
      )}
    </Layout>
  );
}
