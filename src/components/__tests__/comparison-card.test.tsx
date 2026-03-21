import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { ComparisonCard } from '../comparison-card'
import type { Comparison } from '@/domain/entities/comparison'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

const mockComparison: Comparison = {
  id: 'test-id-123',
  description: 'Trote Solidário 2026',
  createdAt: new Date('2026-03-15T10:00:00Z').toISOString(),
  spreadsheets: [
    {
      id: 's1',
      fileName: 'test.xlsx',
      people: [{ cpf: '12345678900', nome: 'João' }],
      uploadedAt: new Date().toISOString(),
    },
  ],
  manualCpfs: [],
}

function renderCard(onDelete = vi.fn()) {
  return render(
    <MemoryRouter>
      <ComparisonCard comparison={mockComparison} onDelete={onDelete} />
    </MemoryRouter>
  )
}

describe('ComparisonCard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the comparison description', () => {
    renderCard()
    expect(screen.getByText('Trote Solidário 2026')).toBeInTheDocument()
  })

  it('renders the spreadsheet count', () => {
    renderCard()
    expect(screen.getByText('1')).toBeInTheDocument()
  })

  it('renders "Abrir" button', () => {
    renderCard()
    expect(screen.getByText('Abrir')).toBeInTheDocument()
  })

  it('navigates when clicking "Abrir"', async () => {
    const user = userEvent.setup()
    renderCard()
    await user.click(screen.getByText('Abrir'))
    expect(mockNavigate).toHaveBeenCalledWith('/comparison/test-id-123')
  })

  it('calls onDelete when clicking the delete button', async () => {
    const user = userEvent.setup()
    const onDelete = vi.fn().mockResolvedValue(undefined)
    renderCard(onDelete)
    await user.click(screen.getByLabelText('Excluir comparação'))
    expect(onDelete).toHaveBeenCalledWith('test-id-123')
  })
})
