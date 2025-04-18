"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Eye, File, Upload, X, Lock } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { PermissionGate } from "@/components/permission-gate"

export function UserFiles({ addLogEntry }) {
  const [files, setFiles] = useState([
    { id: 1, name: "experiment_data.csv", date: new Date(2023, 3, 15), size: "245 KB" },
    { id: 2, name: "calibration_results.xlsx", date: new Date(2023, 4, 2), size: "1.2 MB" },
    { id: 3, name: "reaction_scheme.pdf", date: new Date(2023, 4, 10), size: "3.5 MB" },
  ])

  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleChange = (e) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files)
    }
  }

  const handleFiles = (fileList) => {
    const newFiles = Array.from(fileList).map((file, index) => ({
      id: Date.now() + index,
      name: file.name,
      date: new Date(),
      size: formatFileSize(file.size),
    }))

    setFiles((prev) => [...prev, ...newFiles])
    addLogEntry(`${newFiles.length} file(s) uploaded`, "success")
  }

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B"
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
    else return (bytes / 1048576).toFixed(1) + " MB"
  }

  const removeFile = (id) => {
    setFiles((prev) => prev.filter((file) => file.id !== id))
    addLogEntry("File removed", "info")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">User Files</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Area */}
        <PermissionGate
          permission="upload_files"
          fallback={
            <Alert>
              <Lock className="h-4 w-4 mr-2" />
              <AlertDescription>You don't have permission to upload files</AlertDescription>
            </Alert>
          }
        >
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center ${
              dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/20"
            }`}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
            <p className="mb-2 text-sm text-muted-foreground">Drag and drop files here, or click to browse</p>
            <input id="file-upload" type="file" multiple className="hidden" onChange={handleChange} />
            <Button size="sm" onClick={() => document.getElementById("file-upload").click()}>
              Browse Files
            </Button>
          </div>
        </PermissionGate>

        {/* File List */}
        <div className="space-y-2">
          <h3 className="font-medium">Uploaded Files</h3>
          <div className="border rounded-lg divide-y">
            {files.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">No files uploaded</div>
            ) : (
              files.map((file) => (
                <div key={file.id} className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <File className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(file.date, { addSuffix: true })} • {file.size}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" title="View">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" title="Download">
                      <Download className="h-4 w-4" />
                    </Button>
                    <PermissionGate permission="delete_files">
                      <Button variant="ghost" size="icon" title="Delete" onClick={() => removeFile(file.id)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </PermissionGate>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
