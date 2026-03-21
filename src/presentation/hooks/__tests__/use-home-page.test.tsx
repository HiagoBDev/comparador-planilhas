import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import type { ReactNode } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { useHomePage } from '../use-home-page'
import { useComparisonStore } from '@/application/store/comparison-store'

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

function wrapper({ children }: { children: ReactNode }) {
  return <MemoryRouter>{children}</MemoryRouter>
}

describe('useHomePage', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.clearAllMocks()
    useComparisonStore.setState({ comparisons: [] })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns comparisons from the store', () => {
    const { result } = renderHook(() => useHomePage(), { wrapper })
    expect(result.current.comparisons).toEqual([])
  })

  it('handleCreate creates a comparison and navigates', async () => {
    const { result } = renderHook(() => useHomePage(), { wrapper })

    await act(async () => {
      const promise = result.current.handleCreate('Nova comparação')
      await vi.advanceTimersByTimeAsync(1000)
      await promise
    })

    expect(useComparisonStore.getState().comparisons).toHaveLength(1)
    expect(mockNavigate).toHaveBeenCalledWith(
      expect.stringMatching(/^\/comparison\//)
    )
  })

  it('handleDelete removes a comparison', async () => {
    const id = useComparisonStore.getState().createComparison('To delete')
    const { result } = renderHook(() => useHomePage(), { wrapper })

    await act(async () => {
      const promise = result.current.handleDelete(id)
      await vi.advanceTimersByTimeAsync(1000)
      await promise
    })

    expect(useComparisonStore.getState().comparisons).toHaveLength(0)
  })
})
