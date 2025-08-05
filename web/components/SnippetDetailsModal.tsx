"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Copy, Check } from "lucide-react"
import { useState } from "react"

interface Snippet {
  id: number
  originalText: string
  summary: string
  createdAt: string
}

interface SnippetDetailsModalProps {
  snippet: Snippet | null
  open: boolean
  onClose: () => void
}

export default function SnippetDetailsModal({ snippet, open, onClose }: SnippetDetailsModalProps) {
  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(type)
      setTimeout(() => setCopied(null), 2000)
    } catch (err) {
      console.error("Copy failed:", err)
    }
  }

  if (!snippet) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Snippet #{snippet.id} Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Metadata */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span className="font-medium">Created:</span>
              <Badge variant="outline">{snippet.createdAt}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Characters:</span>
              <Badge variant="outline">{snippet.originalText.length}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Summary Length:</span>
              <Badge variant="outline">{snippet.summary.length}</Badge>
            </div>
          </div>

          {/* Original Text */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Original Text</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(snippet.originalText, "original")}
              >
                {copied === "original" ? (
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
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{snippet.originalText}</p>
            </div>
          </div>

          {/* AI Summary */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">AI Generated Summary</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(snippet.summary, "summary")}
              >
                {copied === "summary" ? (
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
              <p className="text-blue-800 leading-relaxed">{snippet.summary}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() =>
                copyToClipboard(
                  `Original: ${snippet.originalText}\n\nSummary: ${snippet.summary}`,
                  "both"
                )
              }
              className="flex-1"
            >
              {copied === "both" ? (
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
            <Button variant="outline" onClick={onClose} className="flex-1">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}