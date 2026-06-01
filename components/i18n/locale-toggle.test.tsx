import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LocaleToggle } from './locale-toggle'

const push = vi.fn()
vi.mock('next/navigation', () => ({
  usePathname: () => '/pt/blog/meu-post',
  useRouter: () => ({ push }),
}))

describe('LocaleToggle', () => {
  beforeEach(() => push.mockClear())

  test('mostra os dois idiomas', () => {
    render(<LocaleToggle currentLocale="pt" />)
    expect(screen.getByText('PT')).toBeInTheDocument()
    expect(screen.getByText('EN')).toBeInTheDocument()
  })

  test('clicar em EN troca o prefixo do path preservando o resto', async () => {
    const user = userEvent.setup()
    render(<LocaleToggle currentLocale="pt" />)
    await user.click(screen.getByText('EN'))
    expect(push).toHaveBeenCalledWith('/en/blog/meu-post')
  })
})
