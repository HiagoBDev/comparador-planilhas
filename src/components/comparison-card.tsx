import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Comparison } from "@/domain/entities/comparison";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TrashIcon,
  ArrowRightIcon,
  FileXlsIcon,
  CalendarIcon,
  CircleNotchIcon,
} from "@phosphor-icons/react";

interface ComparisonCardProps {
  comparison: Comparison;
  onDelete: (id: string) => Promise<void> | void;
}

export function ComparisonCard({ comparison, onDelete }: ComparisonCardProps) {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    await onDelete(comparison.id);
  };

  const formattedDate = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(comparison.createdAt));

  return (
    <Card className="group relative transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <CardTitle className="truncate text-base">
              {comparison.description}
            </CardTitle>
            <CardDescription className="mt-1 flex items-center gap-1.5 text-xs">
              <CalendarIcon className="size-3.5" />
              {formattedDate}
            </CardDescription>
          </div>
          <Badge variant="secondary" className="shrink-0 gap-1 text-xs">
            <FileXlsIcon className="size-3" />
            {comparison.spreadsheets.length}
          </Badge>
        </div>
      </CardHeader>
      <CardFooter className="gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 gap-1.5 cursor-pointer"
          onClick={() => navigate(`/comparison/${comparison.id}`)}
        >
          Abrir
          <ArrowRightIcon className="size-3.5" data-icon="inline-end" />
        </Button>
        <Button
          variant="destructive"
          size="icon-sm"
          onClick={handleDelete}
          disabled={isDeleting}
          aria-label="Excluir comparação"
          className="cursor-pointer"
        >
          {isDeleting ? (
            <CircleNotchIcon className="size-3.5 animate-spin" />
          ) : (
            <TrashIcon className="size-3.5" />
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
