"use client"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Book, ExternalLink } from "lucide-react"
import { useLabNotebook } from "@/contexts/lab-notebook-context"
import { formatDate } from "@/utils/date-utils"

export function LabNotebookSimple() {
  const router = useRouter()
  const { entries } = useLabNotebook()

  // Show only the most recent entries
  const recentEntries = entries.slice(0, 5)

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

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <Book className="h-5 w-5" />
          <CardTitle>Lab Notebook</CardTitle>
        </div>
        <Button size="sm" onClick={() => router.push("/lab-notebook")}>
          <Plus className="h-4 w-4 mr-2" />
          New Entry
        </Button>
      </CardHeader>
      <CardContent>
        {recentEntries.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <p>No entries found</p>
            <p className="text-sm mt-1">Create your first lab notebook entry</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentEntries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium">{formatDate(entry.date)}</TableCell>
                    <TableCell>{entry.title}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(entry.status)} variant="outline">
                        {entry.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <div className="mt-4 flex justify-center">
          <Button variant="outline" onClick={() => router.push("/lab-notebook")} className="w-full">
            <ExternalLink className="h-4 w-4 mr-2" />
            Open Full Lab Notebook
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
