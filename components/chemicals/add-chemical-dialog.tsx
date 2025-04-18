"use client"

import type React from "react"

import { useState } from "react"
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
  DialogTrigger,
} from "@/components/ui/dialog"
import { useChemicals } from "@/contexts/chemicals-context"
import { Plus } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function AddChemicalDialog() {
  const { addChemical } = useChemicals()
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    casNumber: "",
    bottleSize: "",
    remaining: 100,
    sdsLink: "",
    notes: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "remaining" ? Number(value) : value,
    }))
  }

  const handleSubmit = () => {
    if (!formData.name || !formData.casNumber || !formData.bottleSize) {
      setError("Name, CAS Number, and Bottle Size are required")
      return
    }

    addChemical(formData)
    setFormData({
      name: "",
      casNumber: "",
      bottleSize: "",
      remaining: 100,
      sdsLink: "",
      notes: "",
    })
    setError(null)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Chemical
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Chemical</DialogTitle>
          <DialogDescription>Enter the details for the new chemical.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Chemical Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Acetonitrile"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="casNumber">CAS Number</Label>
              <Input
                id="casNumber"
                name="casNumber"
                value={formData.casNumber}
                onChange={handleInputChange}
                placeholder="e.g., 75-05-8"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bottleSize">Bottle Size</Label>
              <Input
                id="bottleSize"
                name="bottleSize"
                value={formData.bottleSize}
                onChange={handleInputChange}
                placeholder="e.g., 1L"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="remaining">Approx. Remaining (%)</Label>
              <Input
                id="remaining"
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
            <Label htmlFor="sdsLink">SDS Link</Label>
            <Input
              id="sdsLink"
              name="sdsLink"
              value={formData.sdsLink}
              onChange={handleInputChange}
              placeholder="https://example.com/sds/chemical"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Additional information about the chemical..."
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Add Chemical</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
