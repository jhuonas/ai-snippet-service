"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Sparkles } from "lucide-react"

interface SnippetFormProps {
  onSuccess: () => void
}

export default function SnippetForm({ onSuccess }: SnippetFormProps) {
  const [inputText, setInputText] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim()) return

    try {
      setIsGenerating(true)

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/snippets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: inputText }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate summary")
      }

      setInputText("")
      onSuccess()
    } catch (err) {
      console.error("Error generating summary:", err)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          Generate Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="input-text">Enter your text to summarize</Label>
            <Textarea
              id="input-text"
              placeholder="Paste your text here and we'll generate an AI-powered summary..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="min-h-[120px] mt-2"
              disabled={isGenerating}
            />
          </div>
          <Button type="submit" disabled={!inputText.trim() || isGenerating} className="w-full sm:w-auto">
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Generating Summary...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Summary
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}