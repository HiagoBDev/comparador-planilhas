import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusIcon, CircleNotch } from "@phosphor-icons/react";

const formSchema = z.object({
  description: z.string().min(1, "Descrição é obrigatória"),
});

type FormData = z.infer<typeof formSchema>;

interface CreateComparisonDialogProps {
  onCreate: (description: string) => Promise<void> | void;
}

export function CreateComparisonDialog({
  onCreate,
}: CreateComparisonDialogProps) {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { description: "" },
    mode: "onChange",
  });

  const onSubmit = async (data: FormData) => {
    await onCreate(data.description);
    reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="gap-2">
          <PlusIcon className="size-4" weight="bold" data-icon="inline-start" />
          Nova Comparação
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova Comparação</DialogTitle>
          <DialogDescription>
            Crie uma nova comparação de planilhas.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              placeholder="Ex: Comparação de beneficiários Março 2026"
              {...register("description")}
            />
            {errors.description && (
              <p className="text-xs text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={isSubmitting || !isDirty || !isValid}
              className="gap-2"
            >
              {isSubmitting ? (
                <CircleNotch className="size-4 animate-spin" weight="bold" />
              ) : null}
              {isSubmitting ? "Criando..." : "Criar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
