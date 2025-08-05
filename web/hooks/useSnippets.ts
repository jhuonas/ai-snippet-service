import { useEffect, useState } from 'react'
import { Snippet } from '@/types/snippet'
import {
  createSnippet as createSnippetRequest,
  getSnippets,
} from '@/services/snippets'

export function useSnippets() {
  const [snippets, setSnippets] = useState<Snippet[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [take] = useState(6)
  const [skip, setSkip] = useState(0)
  const [total, setTotal] = useState(0)

  const fetchSnippets = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await getSnippets({ take, skip })
      setSnippets(response.data)
      setTotal(response.total)
    } catch (err: any) {
      setError('Failed to fetch snippets')
    } finally {
      setLoading(false)
    }
  }

  const refresh = fetchSnippets

  const createSnippet = async (text: string) => {
    const newSnippet = await createSnippetRequest(text)
    await fetchSnippets()
    return newSnippet
  }

  useEffect(() => {
    fetchSnippets()
  }, [skip, take])

  const handlePageChange = (page: number) => {
    setSkip((page - 1) * take)
  }

  return {
    snippets,
    loading,
    error,
    take,
    total,
    refresh,
    createSnippet,
    handlePageChange,
    currentPage: skip / take + 1,
    totalPages: Math.ceil(total / take),
  }
}
