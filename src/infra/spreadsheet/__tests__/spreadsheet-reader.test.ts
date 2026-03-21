import { describe, it, expect } from 'vitest'
import * as XLSX from 'xlsx'
import { readSpreadsheetFile } from '../spreadsheet-reader'

function createFakeFile(
  rows: Record<string, unknown>[],
  fileName = 'test.xlsx'
): File {
  const ws = XLSX.utils.json_to_sheet(rows)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
  const buffer = XLSX.write(wb, { type: 'array', bookType: 'xlsx' })
  return new File([buffer], fileName, {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
}

function createEmptyFile(fileName = 'empty.xlsx'): File {
  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.aoa_to_sheet([])
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
  const buffer = XLSX.write(wb, { type: 'array', bookType: 'xlsx' })
  return new File([buffer], fileName, {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
}

describe('readSpreadsheetFile', () => {
  it('reads a valid spreadsheet with CPF and nome columns', async () => {
    const file = createFakeFile([
      { cpf: '123.456.789-00', nome: 'João Silva' },
      { cpf: '987.654.321-00', nome: 'Maria Santos' },
    ])

    const result = await readSpreadsheetFile(file)

    expect(result.fileName).toBe('test.xlsx')
    expect(result.people).toHaveLength(2)
    expect(result.people[0].cpf).toBe('12345678900')
    expect(result.people[0].nome).toBe('João Silva')
    expect(result.people[1].cpf).toBe('98765432100')
    expect(result.id).toBeTruthy()
    expect(result.uploadedAt).toBeTruthy()
  })

  it('handles CPF column name case-insensitively', async () => {
    const file = createFakeFile([
      { CPF: '12345678900', Nome: 'Test' },
    ])

    const result = await readSpreadsheetFile(file)
    expect(result.people).toHaveLength(1)
  })

  it('uses "Sem nome" when nome is empty', async () => {
    const file = createFakeFile([
      { cpf: '12345678900', nome: '' },
    ])

    const result = await readSpreadsheetFile(file)
    expect(result.people[0].nome).toBe('Sem nome')
  })

  it('skips rows with empty CPF', async () => {
    const file = createFakeFile([
      { cpf: '', nome: 'Ghost' },
      { cpf: '12345678900', nome: 'Real' },
    ])

    const result = await readSpreadsheetFile(file)
    expect(result.people).toHaveLength(1)
    expect(result.people[0].nome).toBe('Real')
  })

  it('throws when spreadsheet has no data', async () => {
    const file = createEmptyFile()
    await expect(readSpreadsheetFile(file)).rejects.toThrow()
  })

  it('throws when CPF column is missing', async () => {
    const file = createFakeFile([{ nome: 'João', idade: 30 }])
    await expect(readSpreadsheetFile(file)).rejects.toThrow(/CPF/)
  })

  it('throws when nome column is missing', async () => {
    const file = createFakeFile([{ cpf: '12345678900', idade: 30 }])
    await expect(readSpreadsheetFile(file)).rejects.toThrow(/Nome/)
  })
})
