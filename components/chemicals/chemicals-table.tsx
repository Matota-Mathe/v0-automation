"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useChemicals } from "@/contexts/chemicals-context"
import { EditChemicalDialog } from "./edit-chemical-dialog"
import type { Chemical } from "@/types/chemicals"
import { Edit, Trash2, FileText, Download, Search } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export function ChemicalsTable() {
  const { chemicals, deleteChemical, searchChemicals } = useChemicals()
  const [searchQuery, setSearchQuery] = useState("")
  const [editingChemical, setEditingChemical] = useState<Chemical | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [chemicalToDelete, setChemicalToDelete] = useState<Chemical | null>(null)

  const filteredChemicals = searchQuery ? searchChemicals(searchQuery) : chemicals

  const handleEditClick = (chemical: Chemical) => {
    setEditingChemical(chemical)
    setIsEditDialogOpen(true)
  }

  const handleDeleteClick = (chemical: Chemical) => {
    setChemicalToDelete(chemical)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (chemicalToDelete) {
      deleteChemical(chemicalToDelete.id)
      setChemicalToDelete(null)
      setIsDeleteDialogOpen(false)
    }
  }

  const exportToCSV = () => {
    // Create CSV content
    const headers = ["Chemical Name", "CAS Number", "Bottle Size", "Approx. Remaining (%)", "SDS Link", "Notes"]
    const rows = filteredChemicals.map((chem) => [
      chem.name,
      chem.casNumber,
      chem.bottleSize,
      chem.remaining.toString(),
      chem.sdsLink,
      chem.notes,
    ])

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")),
    ].join("\n")

    // Create and download the file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "chemicals_inventory.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or CAS number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button variant="outline" onClick={exportToCSV}>
          <Download className="mr-2 h-4 w-4" />
          Export to CSV
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Chemical Name</TableHead>
              <TableHead>CAS Number</TableHead>
              <TableHead>Bottle Size</TableHead>
              <TableHead>Approx. Remaining</TableHead>
              <TableHead>SDS</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredChemicals.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No chemicals found.
                </TableCell>
              </TableRow>
            ) : (
              filteredChemicals.map((chemical) => (
                <TableRow key={chemical.id} className={chemical.remaining < 20 ? "bg-red-50 dark:bg-red-900/20" : ""}>
                  <TableCell className="font-medium">{chemical.name}</TableCell>
                  <TableCell>{chemical.casNumber}</TableCell>
                  <TableCell>{chemical.bottleSize}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={chemical.remaining} className="w-[60px]" />
                      <span>{chemical.remaining}%</span>
                      {chemical.remaining < 20 && (
                        <Badge variant="destructive" className="ml-2">
                          Low
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {chemical.sdsLink ? (
                      <a
                        href={chemical.sdsLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-600 hover:underline"
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        SDS
                      </a>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate" title={chemical.notes}>
                    {chemical.notes || "-"}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleEditClick(chemical)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(chemical)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <EditChemicalDialog chemical={editingChemical} open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {chemicalToDelete?.name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
