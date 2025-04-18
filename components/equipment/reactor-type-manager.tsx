"use client"

import type React from "react"

import { useState } from "react"
import { useEquipment } from "@/contexts/equipment-context"
import type { ReactorType } from "@/types/equipment"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
  DialogClose,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { PermissionGate } from "@/components/permission-gate"

export function ReactorTypeManager() {
  const { reactorTypes, addReactorType, updateReactorType, deleteReactorType } = useEquipment()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentReactor, setCurrentReactor] = useState<ReactorType | null>(null)
  const [formData, setFormData] = useState<Omit<ReactorType, "id">>({
    name: "",
    type: "coil",
    volume: 10,
    material: "",
    maxTemperature: 150,
    maxPressure: 20,
    description: "",
  })
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: ["volume", "maxTemperature", "maxPressure"].includes(name) ? Number.parseFloat(value) : value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAddSubmit = () => {
    if (!formData.name || !formData.material) {
      setError("Name and material are required")
      return
    }

    // Add a default image URL if none is provided
    const newReactorData = { ...formData }
    if (!newReactorData.imageUrl) {
      // Use a placeholder image based on the reactor type
      const typeForPlaceholder = formData.type || "coil"
      newReactorData.imageUrl = `/placeholder.svg?height=300&width=400&query=flow chemistry ${typeForPlaceholder} reactor`
    }

    addReactorType(newReactorData)
    setFormData({
      name: "",
      type: "coil",
      volume: 10,
      material: "",
      maxTemperature: 150,
      maxPressure: 20,
      description: "",
    })
    setError(null)
    setIsAddDialogOpen(false)
  }

  const handleEditSubmit = () => {
    if (!currentReactor || !formData.name || !formData.material) {
      setError("Name and material are required")
      return
    }

    updateReactorType(currentReactor.id, formData)
    setCurrentReactor(null)
    setError(null)
    setIsEditDialogOpen(false)
  }

  const handleDeleteConfirm = () => {
    if (currentReactor) {
      deleteReactorType(currentReactor.id)
      setCurrentReactor(null)
      setIsDeleteDialogOpen(false)
    }
  }

  const openEditDialog = (reactor: ReactorType) => {
    setCurrentReactor(reactor)
    setFormData({
      name: reactor.name,
      type: reactor.type,
      volume: reactor.volume,
      material: reactor.material,
      maxTemperature: reactor.maxTemperature,
      maxPressure: reactor.maxPressure,
      description: reactor.description,
      imageUrl: reactor.imageUrl,
    })
    setError(null)
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (reactor: ReactorType) => {
    setCurrentReactor(reactor)
    setIsDeleteDialogOpen(true)
  }

  const getReactorTypeLabel = (type: string) => {
    switch (type) {
      case "coil":
        return "Coil Reactor"
      case "ltf-ms":
        return "LTF-MS"
      case "ltf-vs":
        return "LTF-VS"
      case "ltf-mv":
        return "LTF-MV"
      default:
        return "Other"
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Reactor Types</CardTitle>
            <CardDescription>Manage available reactor types for your flow chemistry system</CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <PermissionGate permission="add_equipment">
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Reactor Type
                </Button>
              </DialogTrigger>
            </PermissionGate>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Reactor Type</DialogTitle>
                <DialogDescription>Enter the details for the new reactor type.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Reactor Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g., Standard Coil Reactor"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Reactor Type</Label>
                    <Select
                      name="type"
                      value={formData.type}
                      onValueChange={(value) => handleSelectChange("type", value)}
                    >
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="coil">Coil Reactor</SelectItem>
                        <SelectItem value="ltf-ms">LTF-MS</SelectItem>
                        <SelectItem value="ltf-vs">LTF-VS</SelectItem>
                        <SelectItem value="ltf-mv">LTF-MV</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="volume">Volume (mL)</Label>
                    <Input
                      id="volume"
                      name="volume"
                      type="number"
                      step="0.1"
                      min="0"
                      value={formData.volume}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxTemperature">Max Temp (°C)</Label>
                    <Input
                      id="maxTemperature"
                      name="maxTemperature"
                      type="number"
                      step="1"
                      min="0"
                      value={formData.maxTemperature}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxPressure">Max Pressure (bar)</Label>
                    <Input
                      id="maxPressure"
                      name="maxPressure"
                      type="number"
                      step="0.1"
                      min="0"
                      value={formData.maxPressure}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="material">Material</Label>
                  <Input
                    id="material"
                    name="material"
                    value={formData.material}
                    onChange={handleInputChange}
                    placeholder="e.g., Stainless Steel, Glass, PEEK"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter reactor description..."
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
                    placeholder="https://example.com/reactor-image.jpg"
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={handleAddSubmit}>Add Reactor Type</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {reactorTypes.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              No reactor types defined. Click "Add Reactor Type" to create one.
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Volume</TableHead>
                    <TableHead>Material</TableHead>
                    <TableHead>Max Temp</TableHead>
                    <TableHead>Max Pressure</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reactorTypes.map((reactor) => (
                    <TableRow key={reactor.id}>
                      <TableCell className="font-medium">{reactor.name}</TableCell>
                      <TableCell>{getReactorTypeLabel(reactor.type)}</TableCell>
                      <TableCell>{reactor.volume} mL</TableCell>
                      <TableCell>{reactor.material}</TableCell>
                      <TableCell>{reactor.maxTemperature} °C</TableCell>
                      <TableCell>{reactor.maxPressure} bar</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <PermissionGate permission="edit_equipment">
                            <Button variant="ghost" size="icon" onClick={() => openEditDialog(reactor)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </PermissionGate>
                          <PermissionGate permission="delete_equipment">
                            <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(reactor)}>
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
            <DialogTitle>Edit Reactor Type</DialogTitle>
            <DialogDescription>Update the details for this reactor type.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Reactor Name</Label>
                <Input id="edit-name" name="name" value={formData.name} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-type">Reactor Type</Label>
                <Select name="type" value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
                  <SelectTrigger id="edit-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="coil">Coil Reactor</SelectItem>
                    <SelectItem value="ltf-ms">LTF-MS</SelectItem>
                    <SelectItem value="ltf-vs">LTF-VS</SelectItem>
                    <SelectItem value="ltf-mv">LTF-MV</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-volume">Volume (mL)</Label>
                <Input
                  id="edit-volume"
                  name="volume"
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.volume}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-maxTemperature">Max Temp (°C)</Label>
                <Input
                  id="edit-maxTemperature"
                  name="maxTemperature"
                  type="number"
                  step="1"
                  min="0"
                  value={formData.maxTemperature}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-maxPressure">Max Pressure (bar)</Label>
                <Input
                  id="edit-maxPressure"
                  name="maxPressure"
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.maxPressure}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-material">Material</Label>
              <Input id="edit-material" name="material" value={formData.material} onChange={handleInputChange} />
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
              Are you sure you want to delete the reactor type "{currentReactor?.name}"? This action cannot be undone.
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
