"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronUp, Eye, Edit, Trash2 } from "lucide-react"
import type { LabEntry } from "@/contexts/lab-notebook-context"
import { ViewEntryDialog } from "./view-entry-dialog"
import { EditEntryDialog } from "./edit-entry-dialog"
import { DeleteEntryDialog } from "./delete-entry-dialog"

interface LabEntryTableProps {
  entries: LabEntry[]
  sortField: string
  sortDirection: "asc" | "desc"
  onSort: (field: string) => void
}

export function LabEntryTable({ entries, sortField, sortDirection, onSort }: LabEntryTableProps) {
  const [viewEntry, setViewEntry] = useState<LabEntry | null>(null)
  const [editEntry, setEditEntry] = useState<LabEntry | null>(null)
  const [deleteEntry, setDeleteEntry] = useState<{ id: string; title: string } | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Planned":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "In Progress":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "Failed":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy")
    } catch (error) {
      return dateString
    }
  }

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return null
    return sortDirection === "asc" ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No entries found</p>
        <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters or create a new entry</p>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer" onClick={() => onSort("date")}>
                <div className="flex items-center">
                  Date
                  <SortIcon field="date" />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => onSort("title")}>
                <div className="flex items-center">
                  Title
                  <SortIcon field="title" />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => onSort("experimentType")}>
                <div className="flex items-center">
                  Type
                  <SortIcon field="experimentType" />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => onSort("status")}>
                <div className="flex items-center">
                  Status
                  <SortIcon field="status" />
                </div>
              </TableHead>
              <TableHead>Yield</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell className="font-medium">{formatDate(entry.date)}</TableCell>
                <TableCell>{entry.title}</TableCell>
                <TableCell>{entry.experimentType}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(entry.status)} variant="outline">
                    {entry.status}
                  </Badge>
                </TableCell>
                <TableCell>{entry.yield !== undefined ? `${entry.yield}%` : "-"}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => setViewEntry(entry)} title="View Details">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setEditEntry(entry)} title="Edit Entry">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteEntry({ id: entry.id, title: entry.title })}
                      title="Delete Entry"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {viewEntry && <ViewEntryDialog open={!!viewEntry} onOpenChange={() => setViewEntry(null)} entry={viewEntry} />}

      {editEntry && <EditEntryDialog open={!!editEntry} onOpenChange={() => setEditEntry(null)} entry={editEntry} />}

      {deleteEntry && (
        <DeleteEntryDialog
          open={!!deleteEntry}
          onOpenChange={() => setDeleteEntry(null)}
          entryId={deleteEntry.id}
          entryTitle={deleteEntry.title}
        />
      )}
    </>
  )
}
