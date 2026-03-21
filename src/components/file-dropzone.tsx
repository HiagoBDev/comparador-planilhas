import { useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { UploadSimpleIcon, FileXlsIcon } from "@phosphor-icons/react";

interface FileDropzoneProps {
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  isLoading?: boolean;
}

export function FileDropzone({
  onFilesSelected,
  accept = ".xlsx,.xls,.csv",
  isLoading = false,
}: FileDropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!isLoading) setIsDragOver(true);
    },
    [isLoading]
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);

      if (isLoading) return;

      const files = Array.from(e.dataTransfer.files).filter((f) =>
        /\.(xlsx|xls|csv)$/i.test(f.name)
      );

      if (files.length > 0) {
        onFilesSelected(files);
      }
    },
    [isLoading, onFilesSelected]
  );

  const handleClick = () => {
    if (!isLoading) inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length > 0) {
      onFilesSelected(files);
    }
    e.target.value = "";
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleClick();
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "relative flex min-h-[160px] cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-8 text-center transition-all",
        isDragOver
          ? "border-primary bg-primary/5 scale-[1.01]"
          : "border-border hover:border-primary/50 hover:bg-muted/50",
        isLoading && "pointer-events-none opacity-60"
      )}
    >
      <div
        className={cn(
          "flex size-12 items-center justify-center rounded-xl transition-colors",
          isDragOver
            ? "bg-primary/10 text-primary"
            : "bg-muted text-muted-foreground"
        )}
      >
        {isDragOver ? (
          <FileXlsIcon className="size-6" weight="duotone" />
        ) : (
          <UploadSimpleIcon className="size-6" />
        )}
      </div>

      <div>
        <p className="text-sm font-medium">
          {isDragOver ? "Solte os arquivos aqui" : "Arraste planilhas ou clique para selecionar"}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Formatos aceitos: .xlsx, .xls, .csv
        </p>
      </div>

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-background/60 backdrop-blur-sm">
          <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple
        onChange={handleChange}
        className="hidden"
        aria-label="Selecionar planilhas"
      />
    </div>
  );
}
