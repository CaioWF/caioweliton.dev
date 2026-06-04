import { describe, test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Experience } from './experience'

describe('Experience', () => {
  test('mostra o primeiro cargo por padrão', () => {
    render(<Experience locale="pt" />)
    expect(screen.getByText(/Desenvolvedor de Software \(Pleno → Sênior\)/)).toBeInTheDocument()
  })

  test('clicar em outra empresa troca o conteúdo', async () => {
    const user = userEvent.setup()
    render(<Experience locale="pt" />)
    await user.click(screen.getByRole('tab', { name: /Casa Magalhães/ }))
    expect(screen.getByText(/Desenvolvedor de Software \(Estágio → Júnior\)/)).toBeInTheDocument()
  })
})
