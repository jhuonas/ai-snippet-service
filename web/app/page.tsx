"use client"

import type React from "react"

import { useState } from "react"
import { FileText } from "lucide-react"
import Header from "@/components/Header"
import SnippetForm from "@/components/SnippetForm"
import SnippetCard from "@/components/SnippetCard"
import Pagination from "@/components/Pagination"
import SnippetDetailsModal from "@/components/SnippetDetailsModal"

// Mock data for demonstration
const mockSnippets = Array.from({ length: 25 }, (_, i) => ({
  id: i + 1,
  originalText: `This is sample original text for snippet ${i + 1}. It contains some longer content that would typically be summarized by an AI service. The text might include various details, explanations, or descriptions that need to be condensed into a more digestible format.`,
  summary: `AI-generated summary for snippet ${i + 1}: Key points extracted and condensed into a brief, informative overview.`,
  createdAt: new Date(Date.now() - Math.random() * 10000000000).toLocaleDateString(),
}))

const ITEMS_PER_PAGE = 6

export default function AISnippetService() {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedSnippet, setSelectedSnippet] = useState<(typeof mockSnippets)[0] | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const totalPages = Math.ceil(mockSnippets.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const currentSnippets = mockSnippets.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const goToPage = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const openModal = (snippet: (typeof mockSnippets)[0]) => {
    setSelectedSnippet(snippet)
    setIsModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SnippetForm onSuccess={() => {
          // Update the snippets list in the future
          window.location.reload()
        }} />

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Snippets</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentSnippets.map((snippet) => (
              <SnippetCard key={snippet.id} snippet={snippet} onViewDetails={openModal} />
            ))}
          </div>

          {currentSnippets.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No snippets yet</h3>
              <p className="text-gray-600">Create your first snippet by entering text above.</p>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalItems={mockSnippets.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={goToPage}
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
