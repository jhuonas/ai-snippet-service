'use client'

import { useState } from 'react'
import { FileText } from 'lucide-react'
import Header from '@/components/Header'
import SnippetForm from '@/components/SnippetForm'
import SnippetCard from '@/components/SnippetCard'
import Pagination from '@/components/Pagination'
import SnippetDetailsModal from '@/components/SnippetDetailsModal'
import { useSnippets } from '@/hooks/useSnippets'
import { Snippet } from '@/types/snippet'

export default function AISnippetService() {
  const [selectedSnippet, setSelectedSnippet] = useState<Snippet | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const {
    snippets,
    totalPages,
    total,
    currentPage,
    take,
    handlePageChange,
    loading,
    error,
    refresh,
  } = useSnippets()

  const openModal = (snippet: Snippet) => {
    setSelectedSnippet(snippet)
    setIsModalOpen(true)
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <Header />

      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <SnippetForm onSuccess={refresh} />

        <div className='mb-8'>
          <h2 className='text-xl font-semibold text-gray-900 mb-6'>
            Your Snippets
          </h2>

          {loading && <p>Loading snippets...</p>}
          {error && <p className='text-red-500'>Error loading snippets.</p>}

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {!loading &&
              snippets.map((snippet) => (
                <SnippetCard
                  key={snippet.id}
                  snippet={snippet}
                  onViewDetails={openModal}
                />
              ))}
          </div>

          {!loading && snippets.length === 0 && (
            <div className='text-center py-12'>
              <FileText className='h-12 w-12 text-gray-400 mx-auto mb-4' />
              <h3 className='text-lg font-medium text-gray-900 mb-2'>
                No snippets yet
              </h3>
              <p className='text-gray-600'>
                Create your first snippet by entering text above.
              </p>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalItems={total}
            itemsPerPage={take}
            onPageChange={(newPage) => handlePageChange(newPage)}
          />
        )}

        <SnippetDetailsModal
          snippet={selectedSnippet}
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </main>
    </div>
  )
}
