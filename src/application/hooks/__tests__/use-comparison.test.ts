import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useComparison } from '../use-comparison'
import { useComparisonStore } from '@/application/store/comparison-store'

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

describe('useComparison', () => {
  let comparisonId: string

  beforeEach(() => {
    vi.useFakeTimers()
    useComparisonStore.setState({ comparisons: [] })
    comparisonId = useComparisonStore.getState().createComparison('Test')
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns the comparison by id', () => {
    const { result } = renderHook(() => useComparison(comparisonId))
    expect(result.current.comparison).toBeDefined()
    expect(result.current.comparison?.description).toBe('Test')
  })

  it('returns undefined for non-existent id', () => {
    const { result } = renderHook(() => useComparison('non-existent'))
    expect(result.current.comparison).toBeUndefined()
  })

  it('addSheet adds a spreadsheet to the comparison', async () => {
    const { result } = renderHook(() => useComparison(comparisonId))

    await act(async () => {
      const promise = result.current.addSheet({
        id: 'sheet-1',
        fileName: 'test.xlsx',
        people: [{ cpf: '12345678900', nome: 'João' }],
        uploadedAt: new Date().toISOString(),
      })
      await vi.advanceTimersByTimeAsync(1000)
      await promise
    })

    expect(result.current.comparison?.spreadsheets).toHaveLength(1)
  })

  it('removeSheet removes a spreadsheet', async () => {
    const { result } = renderHook(() => useComparison(comparisonId))

    await act(async () => {
      const promise = result.current.addSheet({
        id: 'sheet-1',
        fileName: 'test.xlsx',
        people: [],
        uploadedAt: new Date().toISOString(),
      })
      await vi.advanceTimersByTimeAsync(1000)
      await promise
    })

    await act(async () => {
      const promise = result.current.removeSheet('sheet-1')
      await vi.advanceTimersByTimeAsync(1000)
      await promise
    })

    expect(result.current.comparison?.spreadsheets).toHaveLength(0)
  })

  it('setCpfs sets manual CPFs', async () => {
    const { result } = renderHook(() => useComparison(comparisonId))

    await act(async () => {
      const promise = result.current.setCpfs(['12345678900'])
      await vi.advanceTimersByTimeAsync(1000)
      await promise
    })

    expect(result.current.comparison?.manualCpfs).toEqual(['12345678900'])
  })

  it('remove deletes the comparison', async () => {
    const { result } = renderHook(() => useComparison(comparisonId))

    await act(async () => {
      const promise = result.current.remove()
      await vi.advanceTimersByTimeAsync(1000)
      await promise
    })

    expect(result.current.comparison).toBeUndefined()
  })
})
