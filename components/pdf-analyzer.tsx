"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileText, Upload, AlertCircle, Loader2, FileSearch, Info } from "lucide-react"
import { analyzePDF } from "@/app/actions/pdf-actions"
import { useAuth } from "@/contexts/auth-context"
import { PermissionGate } from "@/components/permission-gate"

export function PDFAnalyzer({ addLogEntry }) {
  const { user } = useAuth()
  const [file, setFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<any>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]

      if (!selectedFile.name.toLowerCase().endsWith(".pdf")) {
        setError("Please select a PDF file")
        setFile(null)
        return
      }

      setFile(selectedFile)
      setError(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file) {
      setError("Please select a PDF file")
      return
    }

    setIsAnalyzing(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("pdf", file)

      const response = await analyzePDF(formData, user?.role || "")

      if (response.success) {
        setResult(response)
        addLogEntry(`PDF analyzed: ${file.name}`, "success")
      } else {
        setError(response.error || "Failed to analyze PDF")
        addLogEntry(`PDF analysis failed: ${response.error}`, "error")
      }
    } catch (err) {
      console.error(err)
      setError("An error occurred during analysis")
      addLogEntry("PDF analysis error", "error")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const resetAnalysis = () => {
    setFile(null)
    setResult(null)
    setError(null)
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <FileSearch className="h-5 w-5" />
          <CardTitle className="text-2xl">PDF AI Analyzer</CardTitle>
        </div>
        <CardDescription>Upload a PDF to get AI-powered analysis and summary</CardDescription>
      </CardHeader>
      <CardContent>
        <PermissionGate
          permission="view_analytics"
          fallback={
            <Alert>
              <AlertCircle className="h-4 w-4 mr-2" />
              <AlertDescription>You don't have permission to use the PDF analyzer</AlertDescription>
            </Alert>
          }
        >
          {!result ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Alert className="bg-blue-50 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                <Info className="h-4 w-4 mr-2" />
                <AlertDescription>
                  <strong>Demo Mode:</strong> This feature is running in demo mode without an OpenAI API key. Analysis
                  results will be simulated. In a production environment, you would connect to the OpenAI API with your
                  own key.
                </AlertDescription>
              </Alert>

              <div className="grid gap-2">
                <Label htmlFor="pdf-file">Upload PDF Document</Label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  <FileText className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                  <p className="mb-2 text-sm text-muted-foreground">
                    {file ? file.name : "Select a PDF file to analyze"}
                  </p>
                  <Input id="pdf-file" type="file" accept=".pdf" onChange={handleFileChange} className="hidden" />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("pdf-file")?.click()}
                    className="mb-2"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Browse Files
                  </Button>
                  {file && <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>}
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={!file || isAnalyzing}>
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Analyze PDF"
                )}
              </Button>
            </form>
          ) : (
            <div className="space-y-4">
              {result.isDemo && (
                <Alert className="bg-amber-50 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  <AlertTitle>Demo Mode</AlertTitle>
                  <AlertDescription>
                    This analysis is using simulated results. For actual AI-powered analysis, an OpenAI API key is
                    required.
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{result.fileName}</h3>
                  <p className="text-sm text-muted-foreground">{(result.fileSize / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <Button variant="outline" onClick={resetAnalysis}>
                  Analyze Another PDF
                </Button>
              </div>

              <Tabs defaultValue="summary" className="w-full">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="summary">Summary</TabsTrigger>
                  <TabsTrigger value="key-points">Key Points</TabsTrigger>
                  <TabsTrigger value="concepts">Chemistry Concepts</TabsTrigger>
                </TabsList>
                <TabsContent value="summary">
                  <Card>
                    <CardHeader>
                      <CardTitle>Document Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                        <div className="prose dark:prose-invert">
                          {result.summary.split("\n").map((paragraph, i) => (
                            <p key={i}>{paragraph}</p>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="key-points">
                  <Card>
                    <CardHeader>
                      <CardTitle>Key Points</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                        <div className="prose dark:prose-invert">
                          {result.keyPoints.split("\n").map((point, i) => (
                            <p key={i}>{point}</p>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="concepts">
                  <Card>
                    <CardHeader>
                      <CardTitle>Chemistry Concepts</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                        <div className="prose dark:prose-invert">
                          {result.chemistryConcepts.split("\n").map((concept, i) => (
                            <div key={i} dangerouslySetInnerHTML={{ __html: concept }} />
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </PermissionGate>
      </CardContent>
    </Card>
  )
}
