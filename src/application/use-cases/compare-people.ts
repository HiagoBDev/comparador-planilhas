import type { Comparison } from "@/domain/entities/comparison";
import type { Person } from "@/domain/entities/person";
import { normalizeCpf } from "@/domain/entities/person";

export interface ComparisonResult {
  presentInAll: Person[];
  missingInSome: {
    person: Person;
    presentIn: string[];
    missingIn: string[];
  }[];
  duplicates: {
    spreadsheetId: string;
    fileName: string;
    cpf: string;
    count: number;
  }[];
  manualOnlyNotFound: string[];
  manualFound: {
    cpf: string;
    foundIn: string[];
  }[];
}

export function comparePeople(comparison: Comparison): ComparisonResult {
  const { spreadsheets, manualCpfs } = comparison;

  const cpfMap = new Map<string, Map<string, Person>>();
  const duplicates: ComparisonResult["duplicates"] = [];

  for (const sheet of spreadsheets) {
    const seen = new Map<string, number>();

    for (const person of sheet.people) {
      const cpf = person.cpf;

      seen.set(cpf, (seen.get(cpf) ?? 0) + 1);

      if (!cpfMap.has(cpf)) {
        cpfMap.set(cpf, new Map());
      }
      cpfMap.get(cpf)!.set(sheet.id, person);
    }

    for (const [cpf, count] of seen.entries()) {
      if (count > 1) {
        duplicates.push({
          spreadsheetId: sheet.id,
          fileName: sheet.fileName,
          cpf,
          count,
        });
      }
    }
  }

  const presentInAll: Person[] = [];
  const missingInSome: ComparisonResult["missingInSome"] = [];

  for (const [cpf, sheetMap] of cpfMap.entries()) {
    const presentIn = Array.from(sheetMap.keys());
    const missingIn = spreadsheets
      .filter((s) => !sheetMap.has(s.id))
      .map((s) => s.id);

    const person = sheetMap.values().next().value as Person;

    if (missingIn.length === 0 && spreadsheets.length > 0) {
      presentInAll.push({ cpf, nome: person.nome });
    } else if (missingIn.length > 0) {
      missingInSome.push({
        person: { cpf, nome: person.nome },
        presentIn: presentIn.map(
          (id) =>
            spreadsheets.find((s) => s.id === id)?.fileName ?? id
        ),
        missingIn: missingIn.map(
          (id) =>
            spreadsheets.find((s) => s.id === id)?.fileName ?? id
        ),
      });
    }
  }

  const normalizedManualCpfs = manualCpfs.map(normalizeCpf);
  const manualFound: ComparisonResult["manualFound"] = [];
  const manualOnlyNotFound: string[] = [];

  for (const cpf of normalizedManualCpfs) {
    if (!cpf || cpf.length !== 11) continue;

    const sheetMap = cpfMap.get(cpf);
    if (sheetMap && sheetMap.size > 0) {
      manualFound.push({
        cpf,
        foundIn: Array.from(sheetMap.keys()).map(
          (id) =>
            spreadsheets.find((s) => s.id === id)?.fileName ?? id
        ),
      });
    } else {
      manualOnlyNotFound.push(cpf);
    }
  }

  return {
    presentInAll,
    missingInSome,
    duplicates,
    manualOnlyNotFound,
    manualFound,
  };
}
