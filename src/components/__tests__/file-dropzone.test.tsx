import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FileDropzone } from '../file-dropzone'

describe('FileDropzone', () => {
  it('renders the upload text', () => {
    render(<FileDropzone onFilesSelected={vi.fn()} />)
    expect(
      screen.getByText('Arraste planilhas ou clique para selecionar')
    ).toBeInTheDocument()
  })

  it('renders accepted formats info', () => {
    render(<FileDropzone onFilesSelected={vi.fn()} />)
    expect(
      screen.getByText('Formatos aceitos: .xlsx, .xls, .csv')
    ).toBeInTheDocument()
  })

  it('has a hidden file input', () => {
    render(<FileDropzone onFilesSelected={vi.fn()} />)
    const input = screen.getByLabelText('Selecionar planilhas')
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('type', 'file')
  })

  it('calls onFilesSelected when files are chosen via input', async () => {
    const user = userEvent.setup()
    const onFilesSelected = vi.fn()
    render(<FileDropzone onFilesSelected={onFilesSelected} />)

    const input = screen.getByLabelText('Selecionar planilhas')
    const file = new File(['content'], 'test.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })

    await user.upload(input, file)
    expect(onFilesSelected).toHaveBeenCalledWith([file])
  })

  it('shows loading state when isLoading is true', () => {
    render(<FileDropzone onFilesSelected={vi.fn()} isLoading />)
    // The loading overlay has a spinner div
    const dropzone = screen.getByRole('button')
    expect(dropzone.className).toContain('pointer-events-none')
  })

  it('has proper role and accessibility', () => {
    render(<FileDropzone onFilesSelected={vi.fn()} />)
    const dropzone = screen.getByRole('button')
    expect(dropzone).toHaveAttribute('tabIndex', '0')
  })
})
