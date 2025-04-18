"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { ProtectedRoute } from "@/components/protected-route"
import { ThemeToggle } from "@/components/theme-toggle"
import { PDFAnalyzer } from "@/components/pdf-analyzer"
import { FileSearch } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function PDFAnalyzerPage() {
  const [logs, setLogs] = useState([])

  // Function to add log entry
  const addLogEntry = (message, type = "info") => {
    setLogs((prev) => [
      { timestamp: new Date().toISOString(), message, type },
      ...prev.slice(0, 99), // Keep only the last 100 logs
    ])
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto p-4">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <FileSearch className="h-6 w-6" />
              <h1 className="text-2xl font-bold">PDF AI Analyzer</h1>
            </div>
            <ThemeToggle />
          </div>

          <div className="grid grid-cols-1 gap-6">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>About PDF AI Analyzer</CardTitle>
                <CardDescription>How this tool works and what it can do</CardDescription>
              </CardHeader>
              <CardContent>
                <Alert className="bg-blue-50 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                  <Info className="h-4 w-4 mr-2" />
                  <AlertTitle>Demo Mode</AlertTitle>
                  <AlertDescription>
                    This tool is currently running in demo mode without an OpenAI API key. In a production environment,
                    you would need to:
                    <ol className="list-decimal ml-5 mt-2">
                      <li>Set up an OpenAI API key</li>
                      <li>Add it as an environment variable (OPENAI_API_KEY)</li>
                      <li>Deploy the application with this environment variable</li>
                    </ol>
                    The demo will show simulated results to demonstrate the functionality.
                  </AlertDescription>
                </Alert>

                <div className="mt-4">
                  <h3 className="text-lg font-medium mb-2">Features</h3>
                  <ul className="list-disc ml-5 space-y-1">
                    <li>Upload scientific PDF documents</li>
                    <li>Extract and analyze text content</li>
                    <li>Generate concise summaries of complex documents</li>
                    <li>Identify key points and findings</li>
                    <li>Extract relevant chemistry concepts and explanations</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <PDFAnalyzer addLogEntry={addLogEntry} />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
