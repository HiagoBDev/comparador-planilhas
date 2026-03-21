import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeToggle } from '../theme-toggle'
import { useThemeStore } from '@/application/store/theme-store'

import { TooltipProvider } from '@/components/ui/tooltip'

function renderToggle() {
  return render(
    <TooltipProvider>
      <ThemeToggle />
    </TooltipProvider>
  )
}

describe('ThemeToggle', () => {
  beforeEach(() => {
    document.documentElement.classList.remove('dark')
    useThemeStore.setState({ theme: 'light' })
  })

  it('renders a button with light theme label when in light mode', () => {
    renderToggle()
    expect(
      screen.getByLabelText('Mudar para tema escuro')
    ).toBeInTheDocument()
  })

  it('renders a button with dark theme label when in dark mode', () => {
    useThemeStore.setState({ theme: 'dark' })
    renderToggle()
    expect(
      screen.getByLabelText('Mudar para tema claro')
    ).toBeInTheDocument()
  })

  it('toggles theme when clicked', async () => {
    const user = userEvent.setup()
    renderToggle()

    const button = screen.getByLabelText('Mudar para tema escuro')
    await user.click(button)

    expect(useThemeStore.getState().theme).toBe('dark')
  })
})
