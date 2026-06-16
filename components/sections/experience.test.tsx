import { describe, test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Experience } from './experience'

describe('Experience', () => {
  test('mostra os cargos da primeira empresa empilhados por padrão', () => {
    render(<Experience locale="pt" />)
    expect(screen.getByText('Desenvolvedor de Software Sênior')).toBeInTheDocument()
    expect(screen.getByText('Desenvolvedor de Software Pleno')).toBeInTheDocument()
  })

  test('clicar em outra empresa troca o conteúdo', async () => {
    const user = userEvent.setup()
    render(<Experience locale="pt" />)
    await user.click(screen.getByRole('tab', { name: /Casa Magalhães/ }))
    expect(screen.getByText('Desenvolvedor de Software Júnior')).toBeInTheDocument()
    expect(screen.getByText('Estágio em Desenvolvimento de Software')).toBeInTheDocument()
  })
})
