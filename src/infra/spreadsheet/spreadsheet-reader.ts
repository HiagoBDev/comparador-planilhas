import * as XLSX from "xlsx";
import { v4 as uuidv4 } from "uuid";
import type { SpreadsheetData } from "@/domain/entities/spreadsheet-data";
import { normalizeCpf } from "@/domain/entities/person";
import type { Person } from "@/domain/entities/person";

function findColumnKey(
  headers: string[],
  candidates: string[]
): string | undefined {
  const normalized = headers.map((h) => h.trim().toLowerCase());
  for (const candidate of candidates) {
    const idx = normalized.indexOf(candidate.toLowerCase());
    if (idx !== -1) return headers[idx];
  }
  return undefined;
}

export async function readSpreadsheetFile(
  file: File
): Promise<SpreadsheetData> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });

  const sheetName = workbook.SheetNames[0];
  if (!sheetName) {
    throw new Error("A planilha está vazia.");
  }

  const sheet = workbook.Sheets[sheetName];
  if (!sheet) {
    throw new Error("Não foi possível ler a aba da planilha.");
  }

  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
    defval: "",
  });

  if (rows.length === 0) {
    throw new Error("A planilha não contém dados.");
  }

  const headers = Object.keys(rows[0] as object);

  const cpfKey = findColumnKey(headers, ["cpf", "CPF", "Cpf", "cpf_numero"]);
  const nomeKey = findColumnKey(headers, [
    "nome",
    "Nome",
    "NOME",
    "nome_completo",
    "name",
  ]);

  if (!cpfKey) {
    throw new Error(
      'Coluna "CPF" não encontrada. Certifique-se de que a planilha tenha uma coluna chamada "cpf".'
    );
  }

  if (!nomeKey) {
    throw new Error(
      'Coluna "Nome" não encontrada. Certifique-se de que a planilha tenha uma coluna chamada "nome".'
    );
  }

  const people: Person[] = [];

  for (const row of rows) {
    const rawCpf = String((row as Record<string, unknown>)[cpfKey] ?? "").trim();
    const rawNome = String(
      (row as Record<string, unknown>)[nomeKey] ?? ""
    ).trim();

    if (!rawCpf) continue;

    people.push({
      cpf: normalizeCpf(rawCpf),
      nome: rawNome || "Sem nome",
    });
  }

  if (people.length === 0) {
    throw new Error("Nenhum CPF válido encontrado na planilha.");
  }

  return {
    id: uuidv4(),
    fileName: file.name,
    people,
    uploadedAt: new Date().toISOString(),
  };
}
