"use client"
import type { LabEntry } from "@/contexts/lab-notebook-context"
import { NewEntryDialog } from "./new-entry-dialog"

interface EditEntryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  entry: LabEntry
}

export function EditEntryDialog({ open, onOpenChange, entry }: EditEntryDialogProps) {
  return (
    <NewEntryDialog
      open={open}
      onOpenChange={onOpenChange}
      initialData={entry}
      isEdit={true} // Add this prop to indicate it's an edit operation
    />
  )
}
