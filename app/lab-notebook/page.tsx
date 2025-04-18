"use client"

import { CardContent } from "@/components/ui/card"

import { Card } from "@/components/ui/card"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Plus, FileDown, FileJson, FileSpreadsheet } from "lucide-react"
import { LabNotebookHeader } from "@/components/lab-notebook/lab-notebook-header"
import { FilterBar } from "@/components/lab-notebook/filter-bar"
import { LabEntryList } from "@/components/lab-notebook/lab-entry-list"
import { LabEntryTable } from "@/components/lab-notebook/lab-entry-table"
import { NewEntryDialog } from "@/components/lab-notebook/new-entry-dialog"
import { useLabNotebook } from "@/contexts/lab-notebook-context"
import { exportToPdf, exportToCsv, exportToJson } from "@/utils/export-utils"
import { ProtectedRoute } from "@/components/protected-route"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function LabNotebookPage() {
  const [view, setView] = useState<"cards" | "table">("cards")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  })
  const [sortField, setSortField] = useState<string>("date")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [isNewEntryOpen, setIsNewEntryOpen] = useState(false)

  const { entries } = useLabNotebook()

  // Filter entries based on search query, tag, and date range
  const filteredEntries = entries.filter((entry) => {
    // Filter by search query
    if (
      searchQuery &&
      !entry.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !entry.notes.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }

    // Filter by tag
    if (selectedTag && (!entry.tags || !entry.tags.includes(selectedTag))) {
      return false
    }

    // Filter by date range
    if (dateRange.from || dateRange.to) {
      const entryDate = new Date(entry.date)
      if (dateRange.from && entryDate < dateRange.from) return false
      if (dateRange.to) {
        const endDate = new Date(dateRange.to)
        endDate.setHours(23, 59, 59, 999) // End of the day
        if (entryDate > endDate) return false
      }
    }

    return true
  })

  // Sort entries
  const sortedEntries = [...filteredEntries].sort((a, b) => {
    let valueA: any = a[sortField as keyof typeof a]
    let valueB: any = b[sortField as keyof typeof b]

    // Handle date comparison
    if (sortField === "date") {
      valueA = new Date(valueA).getTime()
      valueB = new Date(valueB).getTime()
    }

    // Handle string comparison
    if (typeof valueA === "string" && typeof valueB === "string") {
      return sortDirection === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA)
    }

    // Handle number comparison
    return sortDirection === "asc" ? valueA - valueB : valueB - valueA
  })

  const handleExport = (format: "pdf" | "csv" | "json") => {
    switch (format) {
      case "pdf":
        exportToPdf(sortedEntries)
        break
      case "csv":
        exportToCsv(sortedEntries)
        break
      case "json":
        exportToJson(sortedEntries)
        break
    }
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <LabNotebookHeader
            onNewEntry={() => setIsNewEntryOpen(true)}
            viewMode={view}
            onViewModeChange={(mode) => setView(mode)}
          />

          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <Button onClick={() => setIsNewEntryOpen(true)} className="shadow-sm">
              <Plus className="mr-2 h-4 w-4" />
              New Entry
            </Button>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => handleExport("pdf")}>
                <FileDown className="mr-2 h-4 w-4" />
                PDF
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleExport("csv")}>
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                CSV
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleExport("json")}>
                <FileJson className="mr-2 h-4 w-4" />
                JSON
              </Button>
            </div>
          </div>

          <FilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedTag={selectedTag}
            onTagChange={setSelectedTag}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            sortField={sortField}
            onSortFieldChange={setSortField}
            sortDirection={sortDirection}
            onSortDirectionChange={setSortDirection}
          />

          <Card className="shadow-sm">
            <CardContent className="p-0">
              <Tabs value={view} onValueChange={(v) => setView(v as "cards" | "table")} className="w-full">
                <TabsList className="grid w-[200px] grid-cols-2 m-4">
                  <TabsTrigger value="cards">Cards</TabsTrigger>
                  <TabsTrigger value="table">Table</TabsTrigger>
                </TabsList>
                <TabsContent value="cards" className="p-4">
                  <LabEntryList entries={sortedEntries} />
                </TabsContent>
                <TabsContent value="table" className="p-4">
                  <LabEntryTable
                    entries={sortedEntries}
                    sortField={sortField}
                    sortDirection={sortDirection}
                    onSort={(field) => {
                      if (sortField === field) {
                        setSortDirection(sortDirection === "asc" ? "desc" : "asc")
                      } else {
                        setSortField(field)
                        setSortDirection("asc")
                      }
                    }}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <NewEntryDialog open={isNewEntryOpen} onOpenChange={setIsNewEntryOpen} />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
