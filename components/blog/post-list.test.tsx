import { describe, test, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PostList } from './post-list'
import type { PostMeta } from '@/lib/blog/types'

vi.mock('next/link', () => ({ default: ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a> }))

const posts: PostMeta[] = [
  { slug: 'a', title: 'Post AWS', date: '2026-05-01', description: '', tags: ['AWS'], readingMinutes: 3 },
  { slug: 'b', title: 'Post React', date: '2026-04-01', description: '', tags: ['React'], readingMinutes: 2 },
]

describe('PostList', () => {
  test('lista todos os posts', () => {
    render(<PostList locale="pt" posts={posts} />)
    expect(screen.getByText('Post AWS')).toBeInTheDocument()
    expect(screen.getByText('Post React')).toBeInTheDocument()
  })
  test('filtra por tag', async () => {
    const user = userEvent.setup()
    render(<PostList locale="pt" posts={posts} />)
    await user.click(screen.getByRole('button', { name: 'AWS' }))
    expect(screen.getByText('Post AWS')).toBeInTheDocument()
    expect(screen.queryByText('Post React')).not.toBeInTheDocument()
  })
})
