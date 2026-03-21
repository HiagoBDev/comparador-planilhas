import { describe, it, expect } from 'vitest'
import { normalizeCpf, formatCpf, personSchema } from '../person'

describe('normalizeCpf', () => {
  it('removes non-digit characters', () => {
    expect(normalizeCpf('123.456.789-00')).toBe('12345678900')
  })

  it('pads short CPFs with leading zeros', () => {
    expect(normalizeCpf('123')).toBe('00000000123')
  })

  it('handles already clean CPFs', () => {
    expect(normalizeCpf('12345678900')).toBe('12345678900')
  })

  it('handles empty string', () => {
    expect(normalizeCpf('')).toBe('00000000000')
  })
})

describe('formatCpf', () => {
  it('formats a clean CPF with dots and dash', () => {
    expect(formatCpf('12345678900')).toBe('123.456.789-00')
  })

  it('formats a CPF with existing punctuation', () => {
    expect(formatCpf('123.456.789-00')).toBe('123.456.789-00')
  })

  it('formats a short CPF with padded zeros', () => {
    expect(formatCpf('123')).toBe('000.000.001-23')
  })
})

describe('personSchema', () => {
  it('validates and normalizes a valid person', () => {
    const result = personSchema.safeParse({ cpf: '123.456.789-00', nome: 'João' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.cpf).toBe('12345678900')
      expect(result.data.nome).toBe('João')
    }
  })

  it('rejects CPF with wrong length after normalization', () => {
    const result = personSchema.safeParse({ cpf: '123456789001234', nome: 'João' })
    expect(result.success).toBe(false)
  })

  it('rejects empty name', () => {
    const result = personSchema.safeParse({ cpf: '12345678900', nome: '' })
    expect(result.success).toBe(false)
  })

  it('pads short CPF to 11 digits', () => {
    const result = personSchema.safeParse({ cpf: '12345', nome: 'Maria' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.cpf).toBe('00000012345')
    }
  })
})
