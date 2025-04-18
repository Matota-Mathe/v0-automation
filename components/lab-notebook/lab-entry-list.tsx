import type { LabEntry } from "@/contexts/lab-notebook-context"
import { LabEntryCard } from "./lab-entry-card"

interface LabEntryListProps {
  entries: LabEntry[]
}

export function LabEntryList({ entries }: LabEntryListProps) {
  if (entries.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No entries found</p>
        <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters or create a new entry</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {entries.map((entry) => (
        <LabEntryCard key={entry.id} entry={entry} />
      ))}
    </div>
  )
}
