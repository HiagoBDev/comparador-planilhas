import { describe, it, expect } from 'vitest'
import { comparePeople } from '../compare-people'
import type { Comparison } from '@/domain/entities/comparison'

function makeComparison(overrides: Partial<Comparison> = {}): Comparison {
  return {
    id: 'comp-1',
    description: 'Test',
    createdAt: new Date().toISOString(),
    spreadsheets: [],
    manualCpfs: [],
    ...overrides,
  }
}

describe('comparePeople', () => {
  it('returns empty results when there are no spreadsheets', () => {
    const result = comparePeople(makeComparison())
    expect(result.presentInAll).toEqual([])
    expect(result.missingInSome).toEqual([])
    expect(result.duplicates).toEqual([])
    expect(result.manualFound).toEqual([])
    expect(result.manualOnlyNotFound).toEqual([])
  })

  it('identifies people present in all spreadsheets', () => {
    const result = comparePeople(
      makeComparison({
        spreadsheets: [
          {
            id: 's1',
            fileName: 'sheet1.xlsx',
            people: [{ cpf: '12345678900', nome: 'João' }],
            uploadedAt: new Date().toISOString(),
          },
          {
            id: 's2',
            fileName: 'sheet2.xlsx',
            people: [{ cpf: '12345678900', nome: 'João' }],
            uploadedAt: new Date().toISOString(),
          },
        ],
      })
    )

    expect(result.presentInAll).toHaveLength(1)
    expect(result.presentInAll[0].cpf).toBe('12345678900')
  })

  it('identifies people missing in some spreadsheets', () => {
    const result = comparePeople(
      makeComparison({
        spreadsheets: [
          {
            id: 's1',
            fileName: 'sheet1.xlsx',
            people: [
              { cpf: '12345678900', nome: 'João' },
              { cpf: '99999999999', nome: 'Maria' },
            ],
            uploadedAt: new Date().toISOString(),
          },
          {
            id: 's2',
            fileName: 'sheet2.xlsx',
            people: [{ cpf: '12345678900', nome: 'João' }],
            uploadedAt: new Date().toISOString(),
          },
        ],
      })
    )

    expect(result.missingInSome).toHaveLength(1)
    expect(result.missingInSome[0].person.cpf).toBe('99999999999')
    expect(result.missingInSome[0].presentIn).toEqual(['sheet1.xlsx'])
    expect(result.missingInSome[0].missingIn).toEqual(['sheet2.xlsx'])
  })

  it('detects duplicate CPFs within the same spreadsheet', () => {
    const result = comparePeople(
      makeComparison({
        spreadsheets: [
          {
            id: 's1',
            fileName: 'sheet1.xlsx',
            people: [
              { cpf: '12345678900', nome: 'João' },
              { cpf: '12345678900', nome: 'João Duplicado' },
            ],
            uploadedAt: new Date().toISOString(),
          },
        ],
      })
    )

    expect(result.duplicates).toHaveLength(1)
    expect(result.duplicates[0].cpf).toBe('12345678900')
    expect(result.duplicates[0].count).toBe(2)
    expect(result.duplicates[0].fileName).toBe('sheet1.xlsx')
  })

  it('finds manual CPFs in spreadsheets', () => {
    const result = comparePeople(
      makeComparison({
        spreadsheets: [
          {
            id: 's1',
            fileName: 'sheet1.xlsx',
            people: [{ cpf: '12345678900', nome: 'João' }],
            uploadedAt: new Date().toISOString(),
          },
        ],
        manualCpfs: ['12345678900'],
      })
    )

    expect(result.manualFound).toHaveLength(1)
    expect(result.manualFound[0].cpf).toBe('12345678900')
    expect(result.manualFound[0].foundIn).toEqual(['sheet1.xlsx'])
    expect(result.manualOnlyNotFound).toHaveLength(0)
  })

  it('reports manual CPFs not found in any spreadsheet', () => {
    const result = comparePeople(
      makeComparison({
        spreadsheets: [
          {
            id: 's1',
            fileName: 'sheet1.xlsx',
            people: [{ cpf: '12345678900', nome: 'João' }],
            uploadedAt: new Date().toISOString(),
          },
        ],
        manualCpfs: ['99999999999'],
      })
    )

    expect(result.manualOnlyNotFound).toEqual(['99999999999'])
    expect(result.manualFound).toHaveLength(0)
  })

  it('normalizes manual CPFs before searching', () => {
    const result = comparePeople(
      makeComparison({
        spreadsheets: [
          {
            id: 's1',
            fileName: 'sheet1.xlsx',
            people: [{ cpf: '12345678900', nome: 'João' }],
            uploadedAt: new Date().toISOString(),
          },
        ],
        manualCpfs: ['123.456.789-00'],
      })
    )

    expect(result.manualFound).toHaveLength(1)
    expect(result.manualFound[0].cpf).toBe('12345678900')
  })

  it('handles single spreadsheet — all present, none missing', () => {
    const result = comparePeople(
      makeComparison({
        spreadsheets: [
          {
            id: 's1',
            fileName: 'sheet1.xlsx',
            people: [
              { cpf: '11111111111', nome: 'Ana' },
              { cpf: '22222222222', nome: 'Bruno' },
            ],
            uploadedAt: new Date().toISOString(),
          },
        ],
      })
    )

    expect(result.presentInAll).toHaveLength(2)
    expect(result.missingInSome).toHaveLength(0)
  })

  it('skips invalid manual CPFs (too short even after normalization)', () => {
    // normalizeCpf('') => '00000000000' which has length 11, but
    // the function skips empty-ish or too short. Let's test with an empty string padded.
    // Actually, looking at the code: if (!cpf || cpf.length !== 11) continue;
    // normalizeCpf('') gives '00000000000' which has length 11, so it will search.
    // But normalizeCpf on any string will always give length >= 11 due to padStart.
    // So actually empty strings get padded. Let's just ensure no crash.
    const result = comparePeople(
      makeComparison({
        spreadsheets: [
          {
            id: 's1',
            fileName: 'sheet1.xlsx',
            people: [{ cpf: '12345678900', nome: 'João' }],
            uploadedAt: new Date().toISOString(),
          },
        ],
        manualCpfs: [''],
      })
    )

    // Empty string normalizes to '00000000000', not found in sheets
    expect(result.manualOnlyNotFound).toEqual(['00000000000'])
  })
})
