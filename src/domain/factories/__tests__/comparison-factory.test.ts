import { describe, it, expect } from 'vitest'
import { createComparisonEntity } from '../comparison-factory'

describe('createComparisonEntity', () => {
  it('creates a comparison with the given description', () => {
    const comparison = createComparisonEntity('Teste 2026')
    expect(comparison.description).toBe('Teste 2026')
  })

  it('generates a valid UUID id', () => {
    const comparison = createComparisonEntity('Test')
    expect(comparison.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    )
  })

  it('generates a valid ISO date string', () => {
    const comparison = createComparisonEntity('Test')
    expect(() => new Date(comparison.createdAt)).not.toThrow()
    expect(new Date(comparison.createdAt).toISOString()).toBe(comparison.createdAt)
  })

  it('starts with empty spreadsheets and manualCpfs', () => {
    const comparison = createComparisonEntity('Test')
    expect(comparison.spreadsheets).toEqual([])
    expect(comparison.manualCpfs).toEqual([])
  })

  it('generates unique IDs for each call', () => {
    const a = createComparisonEntity('A')
    const b = createComparisonEntity('B')
    expect(a.id).not.toBe(b.id)
  })
})
