"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FileText, Copy, Check } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/Header"
import SnippetForm from "@/components/SnippetForm"
import SnippetCard from "@/components/SnippetCard"
import Pagination from "@/components/Pagination"

// Mock data for demonstration
const mockSnippets = Array.from({ length: 25 }, (_, i) => ({
  id: i + 1,
  originalText: `This is sample original text for snippet ${i + 1}. It contains some longer content that would typically be summarized by an AI service. The text might include various details, explanations, or descriptions that need to be condensed into a more digestible format.`,
  summary: `AI-generated summary for snippet ${i + 1}: Key points extracted and condensed into a brief, informative overview.`,
  createdAt: new Date(Date.now() - Math.random() * 10000000000).toLocaleDateString(),
}))

const ITEMS_PER_PAGE = 6

export default function AISnippetService() {
  const [inputText, setInputText] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedSnippet, setSelectedSnippet] = useState<(typeof mockSnippets)[0] | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [copiedText, setCopiedText] = useState<string | null>(null)

  const totalPages = Math.ceil(mockSnippets.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const currentSnippets = mockSnippets.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim()) return

    setIsGenerating(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsGenerating(false)
    setInputText("")
    // In real app, this would add the new snippet to the list
  }

  const goToPage = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedText(type)
      setTimeout(() => setCopiedText(null), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
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

        {/* Snippet Details Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Snippet #{selectedSnippet?.id} Details
              </DialogTitle>
            </DialogHeader>

            {selectedSnippet && (
              <div className="space-y-6">
                {/* Metadata */}
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Created:</span>
                    <Badge variant="outline">{selectedSnippet.createdAt}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Characters:</span>
                    <Badge variant="outline">{selectedSnippet.originalText.length}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Summary Length:</span>
                    <Badge variant="outline">{selectedSnippet.summary.length}</Badge>
                  </div>
                </div>

                {/* Original Text */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Original Text</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(selectedSnippet.originalText, "original")}
                    >
                      {copiedText === "original" ? (
                        <>
                          <Check className="h-4 w-4 mr-2 text-green-600" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{selectedSnippet.originalText}</p>
                  </div>
                </div>

                {/* AI Summary */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">AI Generated Summary</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(selectedSnippet.summary, "summary")}
                    >
                      {copiedText === "summary" ? (
                        <>
                          <Check className="h-4 w-4 mr-2 text-green-600" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <p className="text-blue-800 leading-relaxed">{selectedSnippet.summary}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() =>
                      copyToClipboard(
                        `Original: ${selectedSnippet.originalText}\n\nSummary: ${selectedSnippet.summary}`,
                        "both",
                      )
                    }
                    className="flex-1"
                  >
                    {copiedText === "both" ? (
                      <>
                        <Check className="h-4 w-4 mr-2 text-green-600" />
                        Copied Both!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Both
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1">
                    Close
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
