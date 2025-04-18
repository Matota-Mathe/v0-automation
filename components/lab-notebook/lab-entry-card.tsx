"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, FileText, Edit, Trash2, Copy, BookmarkIcon } from "lucide-react"
import { type LabEntry, useLabNotebook } from "@/contexts/lab-notebook-context"
import { ViewEntryDialog } from "./view-entry-dialog"
import { EditEntryDialog } from "./edit-entry-dialog"
import { DeleteEntryDialog } from "./delete-entry-dialog"
import { NewEntryDialog } from "./new-entry-dialog"
import { useToast } from "@/components/ui/use-toast"

interface LabEntryCardProps {
  entry: LabEntry
}

export function LabEntryCard({ entry }: LabEntryCardProps) {
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [repeatDialogOpen, setRepeatDialogOpen] = useState(false)
  const { saveAsTemplate } = useLabNotebook()
  const { toast } = useToast()

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

  const handleSaveAsTemplate = () => {
    saveAsTemplate(entry.id)
    toast({
      title: "Template Saved",
      description: "This experiment has been saved as a template.",
    })
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy")
    } catch (error) {
      return dateString
    }
  }

  return (
    <>
      <Card className="h-full flex flex-col">
        <CardContent className="flex-grow pt-6">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium text-lg line-clamp-1">{entry.title}</h3>
            <Badge className={getStatusColor(entry.status)} variant="outline">
              {entry.status}
            </Badge>
          </div>

          <div className="flex items-center text-sm text-muted-foreground mb-4">
            <Calendar className="h-3.5 w-3.5 mr-1" />
            <span>{formatDate(entry.date)}</span>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Experiment Type:</p>
            <p className="text-sm">{entry.experimentType}</p>

            {entry.yield !== undefined && (
              <div className="flex items-center mt-2">
                <span className="text-sm font-medium mr-2">Yield:</span>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  {entry.yield}%
                </Badge>
              </div>
            )}

            {entry.observations && (
              <div className="mt-2">
                <p className="text-sm font-medium">Observations:</p>
                <p className="text-sm line-clamp-2">{entry.observations}</p>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-wrap gap-2 pt-2 pb-4">
          <Button variant="outline" size="sm" onClick={() => setViewDialogOpen(true)}>
            <FileText className="h-3.5 w-3.5 mr-1" />
            View
          </Button>
          <Button variant="outline" size="sm" onClick={() => setEditDialogOpen(true)}>
            <Edit className="h-3.5 w-3.5 mr-1" />
            Edit
          </Button>
          <Button variant="outline" size="sm" onClick={() => setRepeatDialogOpen(true)}>
            <Copy className="h-3.5 w-3.5 mr-1" />
            Repeat
          </Button>
          <Button variant="outline" size="sm" onClick={handleSaveAsTemplate}>
            <BookmarkIcon className="h-3.5 w-3.5 mr-1" />
            Template
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-red-600 hover:text-red-700"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash2 className="h-3.5 w-3.5 mr-1" />
            Delete
          </Button>
        </CardFooter>
      </Card>

      <ViewEntryDialog open={viewDialogOpen} onOpenChange={setViewDialogOpen} entry={entry} />

      <EditEntryDialog open={editDialogOpen} onOpenChange={setEditDialogOpen} entry={entry} />

      <DeleteEntryDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        entryId={entry.id}
        entryTitle={entry.title}
      />

      <NewEntryDialog
        open={repeatDialogOpen}
        onOpenChange={setRepeatDialogOpen}
        initialData={{
          ...entry,
          title: `Copy of ${entry.title}`,
          date: new Date().toISOString().split("T")[0],
          status: "Planned" as const,
          observations: "",
          yield: undefined,
          notes: `Repeated from experiment: ${entry.title} (${formatDate(entry.date)})`,
          files: [],
          fileUrls: [],
        }}
        isRepeat={true}
      />
    </>
  )
}
