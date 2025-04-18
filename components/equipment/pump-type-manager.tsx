"use client"

import { DialogFooter } from "@/components/ui/dialog"

import type React from "react"

import { useState } from "react"
import { useEquipment } from "@/contexts/equipment-context"
import type { PumpType } from "@/types/equipment"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { PermissionGate } from "@/components/permission-gate"

export function PumpTypeManager() {
  const { pumpTypes, addPumpType, updatePumpType, deletePumpType } = useEquipment()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentPump, setCurrentPump] = useState<PumpType | null>(null)
  const [formData, setFormData] = useState<Omit<PumpType, "id">>({
    name: "",
    manufacturer: "",
    flowRateMin: 0.01,
    flowRateMax: 100,
    description: "",
  })
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "flowRateMin" || name === "flowRateMax" ? Number.parseFloat(value) : value,
    }))
  }

  const handleAddSubmit = () => {
    if (!formData.name || !formData.manufacturer) {
      setError("Name and manufacturer are required")
      return
    }

    // Add a default image URL if none is provided
    const newPumpData = { ...formData }
    if (!newPumpData.imageUrl) {
      newPumpData.imageUrl = `/placeholder.svg?height=300&width=400&query=flow chemistry pump ${formData.manufacturer}`
    }

    addPumpType(newPumpData)
    setFormData({
      name: "",
      manufacturer: "",
      flowRateMin: 0.01,
      flowRateMax: 100,
      description: "",
    })
    setError(null)
    setIsAddDialogOpen(false)
  }

  const handleEditSubmit = () => {
    if (!currentPump || !formData.name || !formData.manufacturer) {
      setError("Name and manufacturer are required")
      return
    }

    updatePumpType(currentPump.id, formData)
    setCurrentPump(null)
    setError(null)
    setIsEditDialogOpen(false)
  }

  const handleDeleteConfirm = () => {
    if (currentPump) {
      deletePumpType(currentPump.id)
      setCurrentPump(null)
      setIsDeleteDialogOpen(false)
    }
  }

  const openEditDialog = (pump: PumpType) => {
    setCurrentPump(pump)
    setFormData({
      name: pump.name,
      manufacturer: pump.manufacturer,
      flowRateMin: pump.flowRateMin,
      flowRateMax: pump.flowRateMax,
      description: pump.description,
      imageUrl: pump.imageUrl,
    })
    setError(null)
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (pump: PumpType) => {
    setCurrentPump(pump)
    setIsDeleteDialogOpen(true)
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Pump Types</CardTitle>
            <CardDescription>Manage available pump types for your flow chemistry system</CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <PermissionGate permission="add_equipment">
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Pump Type
                </Button>
              </DialogTrigger>
            </PermissionGate>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Pump Type</DialogTitle>
                <DialogDescription>Enter the details for the new pump type.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Pump Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g., Syringe Pump S100"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="manufacturer">Manufacturer</Label>
                    <Input
                      id="manufacturer"
                      name="manufacturer"
                      value={formData.manufacturer}
                      onChange={handleInputChange}
                      placeholder="e.g., Chemyx"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="flowRateMin">Min Flow Rate (mL/min)</Label>
                    <Input
                      id="flowRateMin"
                      name="flowRateMin"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.flowRateMin}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="flowRateMax">Max Flow Rate (mL/min)</Label>
                    <Input
                      id="flowRateMax"
                      name="flowRateMax"
                      type="number"
                      step="0.1"
                      min="0"
                      value={formData.flowRateMax}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter pump description..."
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="imageUrl">Image URL (optional)</Label>
                  <Input
                    id="imageUrl"
                    name="imageUrl"
                    value={formData.imageUrl || ""}
                    onChange={handleInputChange}
                    placeholder="https://example.com/pump-image.jpg"
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={handleAddSubmit}>Add Pump Type</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {pumpTypes.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              No pump types defined. Click "Add Pump Type" to create one.
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Manufacturer</TableHead>
                    <TableHead>Flow Rate Range</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pumpTypes.map((pump) => (
                    <TableRow key={pump.id}>
                      <TableCell className="font-medium">{pump.name}</TableCell>
                      <TableCell>{pump.manufacturer}</TableCell>
                      <TableCell>
                        {pump.flowRateMin} - {pump.flowRateMax} mL/min
                      </TableCell>
                      <TableCell className="max-w-[300px] truncate">{pump.description}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <PermissionGate permission="edit_equipment">
                            <Button variant="ghost" size="icon" onClick={() => openEditDialog(pump)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </PermissionGate>
                          <PermissionGate permission="delete_equipment">
                            <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(pump)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </PermissionGate>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Pump Type</DialogTitle>
            <DialogDescription>Update the details for this pump type.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Pump Name</Label>
                <Input id="edit-name" name="name" value={formData.name} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-manufacturer">Manufacturer</Label>
                <Input
                  id="edit-manufacturer"
                  name="manufacturer"
                  value={formData.manufacturer}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-flowRateMin">Min Flow Rate (mL/min)</Label>
                <Input
                  id="edit-flowRateMin"
                  name="flowRateMin"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.flowRateMin}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-flowRateMax">Max Flow Rate (mL/min)</Label>
                <Input
                  id="edit-flowRateMax"
                  name="flowRateMax"
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.flowRateMax}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-imageUrl">Image URL (optional)</Label>
              <Input id="edit-imageUrl" name="imageUrl" value={formData.imageUrl || ""} onChange={handleInputChange} />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleEditSubmit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the pump type "{currentPump?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
