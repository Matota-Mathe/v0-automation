"use client"

import { format } from "date-fns"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { LabEntry } from "@/contexts/lab-notebook-context"
import { FileText, ImageIcon, FileSpreadsheet } from "lucide-react"

interface ViewEntryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  entry: LabEntry
}

export function ViewEntryDialog({ open, onOpenChange, entry }: ViewEntryDialogProps) {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMMM d, yyyy")
    } catch (error) {
      return dateString
    }
  }

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

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase()
    if (["jpg", "jpeg", "png", "gif", "svg"].includes(extension || "")) {
      return <ImageIcon className="h-4 w-4" />
    } else if (["pdf"].includes(extension || "")) {
      return <FileText className="h-4 w-4" />
    } else if (["csv", "xlsx", "xls"].includes(extension || "")) {
      return <FileSpreadsheet className="h-4 w-4" />
    }
    return <FileText className="h-4 w-4" />
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">{entry.title}</DialogTitle>
            <Badge className={getStatusColor(entry.status)} variant="outline">
              {entry.status}
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground">
            {formatDate(entry.date)} • {entry.experimentType}
          </div>
        </DialogHeader>

        <ScrollArea className="h-[60vh] pr-4">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="reagents">Reagents</TabsTrigger>
              <TabsTrigger value="files">Files</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4 pt-4">
              <div>
                <h3 className="text-sm font-medium">Reaction Conditions</h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2">
                  <div>
                    <span className="text-sm text-muted-foreground">Temperature:</span>{" "}
                    <span className="text-sm">{entry.reactionConditions.temperature} °C</span>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Pressure:</span>{" "}
                    <span className="text-sm">{entry.reactionConditions.pressure} bar</span>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Flow Rate:</span>{" "}
                    <span className="text-sm">{entry.reactionConditions.flowRate} mL/min</span>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Residence Time:</span>{" "}
                    <span className="text-sm">{entry.reactionConditions.residenceTime} min</span>
                  </div>
                </div>
              </div>

              <Separator />

              {entry.observations && (
                <div>
                  <h3 className="text-sm font-medium">Observations</h3>
                  <p className="text-sm mt-2 whitespace-pre-line">{entry.observations}</p>
                </div>
              )}

              {entry.yield !== undefined && (
                <div>
                  <h3 className="text-sm font-medium">Yield</h3>
                  <Badge variant="outline" className="mt-2 bg-green-50 text-green-700 border-green-200">
                    {entry.yield}%
                  </Badge>
                </div>
              )}

              {entry.notes && (
                <div>
                  <h3 className="text-sm font-medium">Notes</h3>
                  <p className="text-sm mt-2 whitespace-pre-line">{entry.notes}</p>
                </div>
              )}

              {entry.tags && entry.tags.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium">Tags</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {entry.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="reagents" className="space-y-4 pt-4">
              {entry.reagents.map((reagent, index) => (
                <div key={index} className="p-3 border rounded-md">
                  <h3 className="font-medium">
                    {reagent.name}
                    {reagent.equivalents === 1 && (
                      <Badge variant="outline" className="ml-2">
                        Limiting
                      </Badge>
                    )}
                    {reagent.equivalents !== 1 && reagent.equivalents && (
                      <Badge variant="outline" className="ml-2">
                        {reagent.equivalents.toFixed(2)} eq.
                      </Badge>
                    )}
                  </h3>
                  <div className="grid grid-cols-3 gap-2 mt-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Concentration:</span>{" "}
                      <span>{reagent.concentration} mol/L</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Volume:</span> <span>{reagent.volume} mL</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Moles:</span>{" "}
                      <span>{reagent.moles?.toExponential(3) || "-"} mol</span>
                    </div>
                  </div>
                </div>
              ))}

              {entry.catalyst && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium">Catalyst</h3>
                  <p className="text-sm mt-1">{entry.catalyst}</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="files" className="pt-4">
              {entry.fileUrls && entry.fileUrls.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {entry.fileUrls.map((url, index) => {
                    const fileName = url.split("/").pop() || `File ${index + 1}`
                    return (
                      <div key={index} className="flex items-center p-3 border rounded-md">
                        {getFileIcon(fileName)}
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 text-sm text-blue-600 hover:underline truncate"
                        >
                          {fileName}
                        </a>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">No files attached to this entry</div>
              )}
            </TabsContent>
          </Tabs>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
