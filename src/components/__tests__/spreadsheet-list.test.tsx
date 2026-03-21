import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SpreadsheetList } from '../spreadsheet-list'
import type { SpreadsheetData } from '@/domain/entities/spreadsheet-data'

const mockSpreadsheets: SpreadsheetData[] = [
  {
    id: 's1',
    fileName: 'planilha1.xlsx',
    people: [
      { cpf: '12345678900', nome: 'João' },
      { cpf: '98765432100', nome: 'Maria' },
    ],
    uploadedAt: new Date().toISOString(),
  },
  {
    id: 's2',
    fileName: 'planilha2.csv',
    people: [{ cpf: '11111111111', nome: 'Ana' }],
    uploadedAt: new Date().toISOString(),
  },
]

describe('SpreadsheetList', () => {
  it('shows empty state when there are no spreadsheets', () => {
    render(<SpreadsheetList spreadsheets={[]} onRemove={vi.fn()} />)
    expect(screen.getByText('Nenhuma planilha carregada')).toBeInTheDocument()
  })

  it('renders spreadsheet file names', () => {
    render(
      <SpreadsheetList spreadsheets={mockSpreadsheets} onRemove={vi.fn()} />
    )
    expect(screen.getByText('planilha1.xlsx')).toBeInTheDocument()
    expect(screen.getByText('planilha2.csv')).toBeInTheDocument()
  })

  it('renders people count for each spreadsheet', () => {
    render(
      <SpreadsheetList spreadsheets={mockSpreadsheets} onRemove={vi.fn()} />
    )
    expect(screen.getByText('2 pessoas')).toBeInTheDocument()
    expect(screen.getByText('1 pessoas')).toBeInTheDocument()
  })

  it('calls onRemove with the correct id when clicking remove', async () => {
    const user = userEvent.setup()
    const onRemove = vi.fn()
    render(
      <SpreadsheetList spreadsheets={mockSpreadsheets} onRemove={onRemove} />
    )

    const removeButtons = screen.getAllByLabelText(/Remover/)
    await user.click(removeButtons[0])
    expect(onRemove).toHaveBeenCalledWith('s1')
  })

  it('renders remove button with correct aria-label', () => {
    render(
      <SpreadsheetList spreadsheets={mockSpreadsheets} onRemove={vi.fn()} />
    )
    expect(
      screen.getByLabelText('Remover planilha1.xlsx')
    ).toBeInTheDocument()
  })
})
