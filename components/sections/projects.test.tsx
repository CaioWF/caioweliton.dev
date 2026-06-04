import { describe, test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Projects } from './projects'

describe('Projects', () => {
  test('mostra todos os projetos por padrão', () => {
    render(<Projects locale="pt" />)
    expect(screen.getByText('iBolão')).toBeInTheDocument()
    expect(screen.getByText('Plataforma de EAD')).toBeInTheDocument()
  })

  test('filtrar por "profissional" esconde os pessoais', async () => {
    const user = userEvent.setup()
    render(<Projects locale="pt" />)
    await user.click(screen.getByRole('button', { name: /profissionais/i }))
    expect(screen.queryByText('iBolão')).not.toBeInTheDocument()
    expect(screen.getByText('Plataforma de EAD')).toBeInTheDocument()
  })
})
