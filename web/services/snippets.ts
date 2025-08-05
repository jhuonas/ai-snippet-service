import axios from 'axios'
import { Snippet } from '@/types/snippet'

export async function getSnippets(params: {
  take: number
  skip: number
}): Promise<{
  data: Snippet[]
  total: number
  take: number
  skip: number
}> {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/snippets`,
    { params }
  )
  return response.data
}

export async function createSnippet(text: string): Promise<Snippet> {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/snippets`,
    { text }
  )
  return response.data
}
