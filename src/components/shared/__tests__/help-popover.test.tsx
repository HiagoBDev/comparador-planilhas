import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HelpPopover } from '../help-popover'

describe('HelpPopover', () => {
  it('renders the help button', () => {
    render(<HelpPopover>Help content</HelpPopover>)
    expect(screen.getByLabelText('Ajuda')).toBeInTheDocument()
  })

  it('shows children content when clicking the button', async () => {
    const user = userEvent.setup()
    render(
      <HelpPopover>
        <p>Este é o conteúdo de ajuda</p>
      </HelpPopover>
    )

    await user.click(screen.getByLabelText('Ajuda'))

    expect(
      screen.getByText('Este é o conteúdo de ajuda')
    ).toBeInTheDocument()
  })

  it('renders as a button element', () => {
    render(<HelpPopover>Content</HelpPopover>)
    const trigger = screen.getByLabelText('Ajuda')
    expect(trigger.tagName).toBe('BUTTON')
  })
})
