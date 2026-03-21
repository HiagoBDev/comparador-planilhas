import { useHomePage } from "@/presentation/hooks/use-home-page";
import { Layout } from "@/components/layout";
import { ComparisonCard } from "@/components/comparison-card";
import { CreateComparisonDialog } from "@/components/create-comparison-dialog";
import { HelpPopover } from "@/components/shared/help-popover";
import { FileXlsIcon } from "@phosphor-icons/react";

export function HomePage() {
  const { comparisons, handleCreate, handleDelete } = useHomePage();

  return (
    <Layout>
      <div className="mb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Suas Comparações
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Crie e gerencie comparações de planilhas baseadas em CPF.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <HelpPopover>
              <div>
                Vamos lá, <strong className="text-primary whitespace-nowrap">bonitinha</strong>! Crie uma comparação e dê um nome descritivo
                (ex: "trote solidário 2026.1") para ficar tudo organizadinho.
              </div>
            </HelpPopover>
            <CreateComparisonDialog onCreate={handleCreate} />
          </div>  
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
          <div className="flex items-center gap-2">
            <HelpPopover>
              <div>
                Vamos lá, <strong className="text-primary whitespace-nowrap">bonitinha</strong>! Crie uma comparação e dê um nome descritivo
                (ex: "trote solidário 2026.1") para ficar tudo organizadinho.
              </div>
            </HelpPopover>
            <CreateComparisonDialog onCreate={handleCreate} />
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {comparisons.map((comparison) => (
            <ComparisonCard
              key={comparison.id}
              comparison={comparison}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </Layout>
  );
}
