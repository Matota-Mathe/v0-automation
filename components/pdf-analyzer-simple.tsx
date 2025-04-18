"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FileSearch, Upload, Info } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { PermissionGate } from "@/components/permission-gate"

export function PDFAnalyzerSimple({ addLogEntry }) {
  const { user } = useAuth()
  const [file, setFile] = useState<File | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]

      if (!selectedFile.name.toLowerCase().endsWith(".pdf")) {
        addLogEntry("Please select a PDF file", "error")
        setFile(null)
        return
      }

      setFile(selectedFile)
      addLogEntry(`PDF selected: ${selectedFile.name}`, "info")
    }
  }

  const handleSubmit = () => {
    if (!file) {
      addLogEntry("Please select a PDF file", "error")
      return
    }

    addLogEntry(`Analyzing PDF: ${file.name}`, "info")

    // Redirect to full PDF analyzer tool
    window.location.href = "/tools/pdf-analyzer"
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <FileSearch className="h-5 w-5" />
          <CardTitle>PDF AI Analyzer</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <PermissionGate
          permission="view_analytics"
          fallback={
            <Alert>
              <Info className="h-4 w-4 mr-2" />
              <AlertDescription>You don't have permission to use the PDF analyzer</AlertDescription>
            </Alert>
          }
        >
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="pdf-file">Upload PDF Document</Label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <Upload className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
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

            <Button onClick={handleSubmit} className="w-full" disabled={!file}>
              Analyze PDF
            </Button>
          </div>
        </PermissionGate>
      </CardContent>
    </Card>
  )
}
