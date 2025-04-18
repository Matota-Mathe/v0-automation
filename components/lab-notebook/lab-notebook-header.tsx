"use client"

import { Button } from "@/components/ui/button"
import { DownloadIcon, FilePlus, Grid, List, FileJson, Beaker } from "lucide-react"
import { useLabNotebook } from "@/contexts/lab-notebook-context"
import { exportToPdf, exportToCsv, exportToJson } from "@/utils/export-utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"

interface LabNotebookHeaderProps {
  onNewEntry?: () => void
  viewMode?: "table" | "card"
  onViewModeChange?: (mode: "table" | "card") => void
}

export function LabNotebookHeader({
  onNewEntry = () => {},
  viewMode = "card",
  onViewModeChange = () => {},
}: LabNotebookHeaderProps) {
  const { entries } = useLabNotebook()
  const { toast } = useToast()

  const handleExport = (format: "pdf" | "csv" | "json") => {
    if (entries.length === 0) {
      toast({
        title: "No entries to export",
        description: "Add some entries to your lab notebook first.",
        variant: "destructive",
      })
      return
    }

    try {
      switch (format) {
        case "pdf":
          exportToPdf(entries)
          break
        case "csv":
          exportToCsv(entries)
          break
        case "json":
          exportToJson(entries)
          break
      }

      toast({
        title: "Export successful",
        description: `Lab notebook exported as ${format.toUpperCase()}.`,
      })
    } catch (error) {
      console.error("Export error:", error)
      toast({
        title: "Export failed",
        description: "There was an error exporting your lab notebook.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:gap-2">
        <div className="flex items-center gap-2">
          <Beaker className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Lab Notebook</h1>
        </div>
        <p className="text-muted-foreground">Record, track, and analyze your flow chemistry experiments</p>
      </div>
      <div className="flex items-center gap-2">
        <Button onClick={onNewEntry} className="flex items-center gap-2">
          <FilePlus className="h-4 w-4" />
          New Entry
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <DownloadIcon className="h-4 w-4" />
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleExport("pdf")}>
              <DownloadIcon className="h-4 w-4 mr-2" />
              Export as PDF
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport("csv")}>
              <DownloadIcon className="h-4 w-4 mr-2" />
              Export as CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport("json")}>
              <FileJson className="h-4 w-4 mr-2" />
              Export as JSON
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant={viewMode === "card" ? "default" : "outline"}
          size="icon"
          onClick={() => onViewModeChange("card")}
          title="Card View"
        >
          <Grid className="h-4 w-4" />
        </Button>
        <Button
          variant={viewMode === "table" ? "default" : "outline"}
          size="icon"
          onClick={() => onViewModeChange("table")}
          title="Table View"
        >
          <List className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
