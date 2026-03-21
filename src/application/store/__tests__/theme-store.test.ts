import { describe, it, expect, beforeEach } from 'vitest'
import { useThemeStore } from '../theme-store'

describe('useThemeStore', () => {
  beforeEach(() => {
    // Reset to known state
    document.documentElement.classList.remove('dark')
    useThemeStore.setState({ theme: 'light' })
  })

  it('has a default theme', () => {
    const theme = useThemeStore.getState().theme
    expect(['light', 'dark']).toContain(theme)
  })

  describe('setTheme', () => {
    it('sets theme to dark and applies class', () => {
      useThemeStore.getState().setTheme('dark')
      expect(useThemeStore.getState().theme).toBe('dark')
      expect(document.documentElement.classList.contains('dark')).toBe(true)
    })

    it('sets theme to light and removes class', () => {
      useThemeStore.getState().setTheme('dark')
      useThemeStore.getState().setTheme('light')
      expect(useThemeStore.getState().theme).toBe('light')
      expect(document.documentElement.classList.contains('dark')).toBe(false)
    })
  })

  describe('toggleTheme', () => {
    it('toggles from light to dark', () => {
      useThemeStore.setState({ theme: 'light' })
      useThemeStore.getState().toggleTheme()
      expect(useThemeStore.getState().theme).toBe('dark')
      expect(document.documentElement.classList.contains('dark')).toBe(true)
    })

    it('toggles from dark to light', () => {
      useThemeStore.setState({ theme: 'dark' })
      useThemeStore.getState().toggleTheme()
      expect(useThemeStore.getState().theme).toBe('light')
      expect(document.documentElement.classList.contains('dark')).toBe(false)
    })
  })
})
