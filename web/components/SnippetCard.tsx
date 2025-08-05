"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"

interface Snippet {
  id: number
  originalText: string
  summary: string
  createdAt: string
}

interface SnippetCardProps {
  snippet: Snippet
  onViewDetails: (snippet: Snippet) => void
}

export default function SnippetCard({ snippet, onViewDetails }: SnippetCardProps) {
  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-gray-600">Snippet #{snippet.id}</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {snippet.createdAt}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Original Text</h4>
          <p className="text-sm text-gray-600 line-clamp-3 bg-gray-50 p-3 rounded-md">
            {snippet.originalText}
          </p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">AI Summary</h4>
          <p className="text-sm text-blue-700 bg-blue-50 p-3 rounded-md line-clamp-2">{snippet.summary}</p>
        </div>
        <div className="pt-2">
          <Button variant="outline" size="sm" onClick={() => onViewDetails(snippet)} className="w-full">
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}