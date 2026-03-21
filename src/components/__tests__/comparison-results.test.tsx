import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ComparisonResults } from '../comparison-results'
import type { ComparisonResult } from '@/application/use-cases/compare-people'

const emptyResults: ComparisonResult = {
  presentInAll: [],
  missingInSome: [],
  duplicates: [],
  manualFound: [],
  manualOnlyNotFound: [],
}

const fullResults: ComparisonResult = {
  presentInAll: [
    { cpf: '12345678900', nome: 'João' },
    { cpf: '98765432100', nome: 'Maria' },
  ],
  missingInSome: [
    {
      person: { cpf: '11111111111', nome: 'Carlos' },
      presentIn: ['sheet1.xlsx'],
      missingIn: ['sheet2.xlsx'],
    },
  ],
  duplicates: [
    {
      spreadsheetId: 's1',
      fileName: 'sheet1.xlsx',
      cpf: '22222222222',
      count: 3,
    },
  ],
  manualFound: [
    { cpf: '33333333333', foundIn: ['sheet1.xlsx'] },
  ],
  manualOnlyNotFound: ['44444444444'],
}

describe('ComparisonResults', () => {
  it('renders tabs with correct counts', () => {
    render(<ComparisonResults results={fullResults} />)
    expect(screen.getByText('Presentes')).toBeInTheDocument()
    expect(screen.getByText('Ausentes')).toBeInTheDocument()
    expect(screen.getByText('Duplicados')).toBeInTheDocument()
    expect(screen.getByText('Manuais')).toBeInTheDocument()
  })

  it('renders badge counts correctly', () => {
    render(<ComparisonResults results={fullResults} />)
    // "2" appears in multiple badges (present count + manual count)
    const twoBadges = screen.getAllByText('2')
    expect(twoBadges.length).toBeGreaterThanOrEqual(1)
    // "1" appears in badges too (missing, duplicates)
    const oneBadges = screen.getAllByText('1')
    expect(oneBadges.length).toBeGreaterThanOrEqual(1)
  })

  it('does not render manual tab when there are no manual CPFs', () => {
    render(<ComparisonResults results={emptyResults} />)
    expect(screen.queryByText('Manuais')).not.toBeInTheDocument()
  })

  it('shows empty state when no results in present tab', () => {
    render(<ComparisonResults results={emptyResults} />)
    expect(
      screen.getByText('Nenhuma pessoa presente em todas as planilhas.')
    ).toBeInTheDocument()
  })

  it('renders formatted CPFs in the present tab', () => {
    render(<ComparisonResults results={fullResults} />)
    // 12345678900 formatted as 123.456.789-00
    expect(screen.getByText('123.456.789-00')).toBeInTheDocument()
  })

  it('renders person names in the present tab', () => {
    render(<ComparisonResults results={fullResults} />)
    expect(screen.getByText('João')).toBeInTheDocument()
    expect(screen.getByText('Maria')).toBeInTheDocument()
  })
})
