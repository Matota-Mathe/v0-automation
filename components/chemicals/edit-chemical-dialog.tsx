"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useChemicals } from "@/contexts/chemicals-context"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Chemical } from "@/types/chemicals"

interface EditChemicalDialogProps {
  chemical: Chemical | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditChemicalDialog({ chemical, open, onOpenChange }: EditChemicalDialogProps) {
  const { updateChemical } = useChemicals()
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Omit<Chemical, "id">>({
    name: "",
    casNumber: "",
    bottleSize: "",
    remaining: 100,
    sdsLink: "",
    notes: "",
  })

  useEffect(() => {
    if (chemical) {
      setFormData({
        name: chemical.name,
        casNumber: chemical.casNumber,
        bottleSize: chemical.bottleSize,
        remaining: chemical.remaining,
        sdsLink: chemical.sdsLink,
        notes: chemical.notes,
      })
    }
  }, [chemical])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "remaining" ? Number(value) : value,
    }))
  }

  const handleSubmit = () => {
    if (!chemical) return

    if (!formData.name || !formData.casNumber || !formData.bottleSize) {
      setError("Name, CAS Number, and Bottle Size are required")
      return
    }

    updateChemical(chemical.id, formData)
    setError(null)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Chemical</DialogTitle>
          <DialogDescription>Update the details for this chemical.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Chemical Name</Label>
              <Input id="edit-name" name="name" value={formData.name} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-casNumber">CAS Number</Label>
              <Input id="edit-casNumber" name="casNumber" value={formData.casNumber} onChange={handleInputChange} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-bottleSize">Bottle Size</Label>
              <Input id="edit-bottleSize" name="bottleSize" value={formData.bottleSize} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-remaining">Approx. Remaining (%)</Label>
              <Input
                id="edit-remaining"
                name="remaining"
                type="number"
                min="0"
                max="100"
                value={formData.remaining}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-sdsLink">SDS Link</Label>
            <Input id="edit-sdsLink" name="sdsLink" value={formData.sdsLink} onChange={handleInputChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-notes">Notes</Label>
            <Textarea id="edit-notes" name="notes" value={formData.notes} onChange={handleInputChange} rows={3} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
