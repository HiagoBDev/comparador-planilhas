import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { normalizeCpf } from "@/domain/entities/person";
import { FloppyDiskIcon } from "@phosphor-icons/react";

const formSchema = z.object({
  cpfs: z.string().min(1, "Insira pelo menos um CPF"),
});

type FormData = z.infer<typeof formSchema>;

interface ManualCpfFormProps {
  initialCpfs: string[];
  onSave: (cpfs: string[]) => void;
}

export function ManualCpfForm({ initialCpfs, onSave }: ManualCpfFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cpfs: initialCpfs.join("\n"),
    },
  });

  const onSubmit = (data: FormData) => {
    const cpfs = data.cpfs
      .split(/[\n,;]+/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map(normalizeCpf);

    onSave(cpfs);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3">
      <div className="grid gap-2">
        <Label htmlFor="manual-cpfs">CPFs manuais</Label>
        <textarea
          id="manual-cpfs"
          rows={5}
          placeholder={"123.456.789-00\n987.654.321-00\nUm CPF por linha"}
          className="flex w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
          {...register("cpfs")}
        />
        {errors.cpfs && (
          <p className="text-xs text-destructive">{errors.cpfs.message}</p>
        )}
        <p className="text-xs text-muted-foreground">
          Insira um CPF por linha. Pode usar formatação com pontos e traço ou só
          números.
        </p>
      </div>
      <Button type="submit" variant="outline" size="sm" className="w-fit gap-1.5">
        <FloppyDiskIcon className="size-3.5" data-icon="inline-start" />
        Salvar CPFs
      </Button>
    </form>
  );
}
