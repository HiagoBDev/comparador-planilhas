import { useMemo } from "react";
import type { ComparisonResult } from "@/application/use-cases/compare-people";
import { formatCpf } from "@/domain/entities/person";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  CheckCircleIcon,
  WarningCircleIcon,
  CopySimpleIcon,
  MagnifyingGlassIcon,
} from "@phosphor-icons/react";

interface ComparisonResultsProps {
  results: ComparisonResult;
}

export function ComparisonResults({ results }: ComparisonResultsProps) {
  const counts = useMemo(
    () => ({
      present: results.presentInAll.length,
      missing: results.missingInSome.length,
      duplicates: results.duplicates.length,
      manual:
        results.manualFound.length + results.manualOnlyNotFound.length,
    }),
    [results]
  );

  return (
    <Tabs defaultValue="present" className="w-full">
      <TabsList className="w-full justify-start overflow-x-auto">
        <TabsTrigger value="present" className="gap-1.5">
          <CheckCircleIcon className="size-3.5" />
          Presentes
          <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0">
            {counts.present}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="missing" className="gap-1.5">
          <WarningCircleIcon className="size-3.5" />
          Ausentes
          <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0">
            {counts.missing}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="duplicates" className="gap-1.5">
          <CopySimpleIcon className="size-3.5" />
          Duplicados
          <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0">
            {counts.duplicates}
          </Badge>
        </TabsTrigger>
        {counts.manual > 0 && (
          <TabsTrigger value="manual" className="gap-1.5">
            <MagnifyingGlassIcon className="size-3.5" />
            Manuais
            <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0">
              {counts.manual}
            </Badge>
          </TabsTrigger>
        )}
      </TabsList>

      <TabsContent value="present">
        <ScrollArea className="max-h-[400px]">
          {counts.present === 0 ? (
            <EmptyState message="Nenhuma pessoa presente em todas as planilhas." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>CPF</TableHead>
                  <TableHead>Nome</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.presentInAll.map((person) => (
                  <TableRow key={person.cpf}>
                    <TableCell className="font-mono text-xs">
                      {formatCpf(person.cpf)}
                    </TableCell>
                    <TableCell>{person.nome}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </ScrollArea>
      </TabsContent>

      <TabsContent value="missing">
        <ScrollArea className="max-h-[400px]">
          {counts.missing === 0 ? (
            <EmptyState message="Todas as pessoas estão presentes em todas as planilhas." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>CPF</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Presente em</TableHead>
                  <TableHead>Ausente em</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.missingInSome.map((item) => (
                  <TableRow key={item.person.cpf}>
                    <TableCell className="font-mono text-xs">
                      {formatCpf(item.person.cpf)}
                    </TableCell>
                    <TableCell>{item.person.nome}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {item.presentIn.map((name) => (
                          <Badge
                            key={name}
                            variant="secondary"
                            className="text-[10px]"
                          >
                            {name}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {item.missingIn.map((name) => (
                          <Badge
                            key={name}
                            variant="destructive"
                            className="text-[10px]"
                          >
                            {name}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </ScrollArea>
      </TabsContent>

      <TabsContent value="duplicates">
        <ScrollArea className="max-h-[400px]">
          {counts.duplicates === 0 ? (
            <EmptyState message="Nenhum CPF duplicado encontrado." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>CPF</TableHead>
                  <TableHead>Planilha</TableHead>
                  <TableHead>Ocorrências</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.duplicates.map((dup) => (
                  <TableRow key={`${dup.spreadsheetId}-${dup.cpf}`}>
                    <TableCell className="font-mono text-xs">
                      {formatCpf(dup.cpf)}
                    </TableCell>
                    <TableCell>{dup.fileName}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{dup.count}x</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </ScrollArea>
      </TabsContent>

      {counts.manual > 0 && (
        <TabsContent value="manual">
          <ScrollArea className="max-h-[400px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>CPF</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Encontrado em</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.manualFound.map((item) => (
                  <TableRow key={item.cpf}>
                    <TableCell className="font-mono text-xs">
                      {formatCpf(item.cpf)}
                    </TableCell>
                    <TableCell>
                      <Badge className="gap-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px]">
                        <CheckCircleIcon className="size-3" />
                        Encontrado
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {item.foundIn.map((name) => (
                          <Badge
                            key={name}
                            variant="secondary"
                            className="text-[10px]"
                          >
                            {name}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {results.manualOnlyNotFound.map((cpf) => (
                  <TableRow key={cpf}>
                    <TableCell className="font-mono text-xs">
                      {formatCpf(cpf)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="destructive" className="gap-1 text-[10px]">
                        <WarningCircleIcon className="size-3" />
                        Não encontrado
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">—</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </TabsContent>
      )}
    </Tabs>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center gap-2 py-8 text-center">
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
