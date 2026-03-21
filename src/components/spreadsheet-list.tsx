import type { SpreadsheetData } from "@/domain/entities/spreadsheet-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileXlsIcon,
  TrashIcon,
  UsersIcon,
} from "@phosphor-icons/react";

interface SpreadsheetListProps {
  spreadsheets: SpreadsheetData[];
  onRemove: (id: string) => void;
}

export function SpreadsheetList({
  spreadsheets,
  onRemove,
}: SpreadsheetListProps) {
  if (spreadsheets.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-border p-6 text-center">
        <FileXlsIcon className="size-8 text-muted-foreground/50" />
        <p className="text-sm text-muted-foreground">
          Nenhuma planilha carregada
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-2">
      {spreadsheets.map((sheet) => (
        <div
          key={sheet.id}
          className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 transition-colors hover:bg-muted/50"
        >
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <FileXlsIcon className="size-4" weight="duotone" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{sheet.fileName}</p>
            <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
              <UsersIcon className="size-3" />
              {sheet.people.length} pessoas
            </div>
          </div>
          <Badge variant="secondary" className="shrink-0 text-xs">
            {sheet.people.length}
          </Badge>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onRemove(sheet.id)}
            aria-label={`Remover ${sheet.fileName}`}
          >
            <TrashIcon className="size-3.5 text-muted-foreground hover:text-destructive" />
          </Button>
        </div>
      ))}
    </div>
  );
}
