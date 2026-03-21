import { describe, it, expect, beforeEach } from 'vitest'
import { useComparisonStore } from '../comparison-store'
import type { SpreadsheetData } from '@/domain/entities/spreadsheet-data'

function makeSpreadsheet(overrides: Partial<SpreadsheetData> = {}): SpreadsheetData {
  return {
    id: 'sheet-1',
    fileName: 'test.xlsx',
    people: [{ cpf: '12345678900', nome: 'João' }],
    uploadedAt: new Date().toISOString(),
    ...overrides,
  }
}

describe('useComparisonStore', () => {
  beforeEach(() => {
    useComparisonStore.setState({ comparisons: [] })
  })

  it('starts with empty comparisons', () => {
    expect(useComparisonStore.getState().comparisons).toEqual([])
  })

  describe('createComparison', () => {
    it('creates a comparison and returns its ID', () => {
      const id = useComparisonStore.getState().createComparison('Test comparison')
      expect(typeof id).toBe('string')
      expect(id.length).toBeGreaterThan(0)
    })

    it('adds the comparison to the list', () => {
      useComparisonStore.getState().createComparison('My comparison')
      const comparisons = useComparisonStore.getState().comparisons
      expect(comparisons).toHaveLength(1)
      expect(comparisons[0].description).toBe('My comparison')
    })
  })

  describe('deleteComparison', () => {
    it('removes a comparison by id', () => {
      const id = useComparisonStore.getState().createComparison('To delete')
      useComparisonStore.getState().deleteComparison(id)
      expect(useComparisonStore.getState().comparisons).toHaveLength(0)
    })

    it('does not affect other comparisons', () => {
      const id1 = useComparisonStore.getState().createComparison('Keep')
      const id2 = useComparisonStore.getState().createComparison('Delete')
      useComparisonStore.getState().deleteComparison(id2)
      const comparisons = useComparisonStore.getState().comparisons
      expect(comparisons).toHaveLength(1)
      expect(comparisons[0].id).toBe(id1)
    })
  })

  describe('addSpreadsheet', () => {
    it('adds a spreadsheet to the correct comparison', () => {
      const id = useComparisonStore.getState().createComparison('Test')
      const sheet = makeSpreadsheet()
      useComparisonStore.getState().addSpreadsheet(id, sheet)

      const comparison = useComparisonStore.getState().getComparison(id)
      expect(comparison?.spreadsheets).toHaveLength(1)
      expect(comparison?.spreadsheets[0].fileName).toBe('test.xlsx')
    })
  })

  describe('removeSpreadsheet', () => {
    it('removes a spreadsheet from the correct comparison', () => {
      const id = useComparisonStore.getState().createComparison('Test')
      const sheet = makeSpreadsheet({ id: 'to-remove' })
      useComparisonStore.getState().addSpreadsheet(id, sheet)
      useComparisonStore.getState().removeSpreadsheet(id, 'to-remove')

      const comparison = useComparisonStore.getState().getComparison(id)
      expect(comparison?.spreadsheets).toHaveLength(0)
    })
  })

  describe('setManualCpfs', () => {
    it('sets manual CPFs for a comparison', () => {
      const id = useComparisonStore.getState().createComparison('Test')
      useComparisonStore.getState().setManualCpfs(id, ['12345678900', '99999999999'])

      const comparison = useComparisonStore.getState().getComparison(id)
      expect(comparison?.manualCpfs).toEqual(['12345678900', '99999999999'])
    })

    it('replaces existing manual CPFs', () => {
      const id = useComparisonStore.getState().createComparison('Test')
      useComparisonStore.getState().setManualCpfs(id, ['11111111111'])
      useComparisonStore.getState().setManualCpfs(id, ['22222222222'])

      const comparison = useComparisonStore.getState().getComparison(id)
      expect(comparison?.manualCpfs).toEqual(['22222222222'])
    })
  })

  describe('getComparison', () => {
    it('returns undefined for non-existent id', () => {
      expect(useComparisonStore.getState().getComparison('non-existent')).toBeUndefined()
    })

    it('returns the correct comparison', () => {
      const id = useComparisonStore.getState().createComparison('Find me')
      const comparison = useComparisonStore.getState().getComparison(id)
      expect(comparison?.description).toBe('Find me')
    })
  })
})
