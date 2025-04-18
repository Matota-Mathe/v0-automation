"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Edit, Play, Plus, Trash2, Lock } from "lucide-react"
import { PermissionGate } from "@/components/permission-gate"

export function ExperimentRecipes({ addLogEntry }) {
  const [recipes, setRecipes] = useState([
    {
      id: 1,
      name: "Suzuki Coupling",
      date: "2023-04-10",
      chemicals: "Pd(PPh3)4, K2CO3, PhB(OH)2",
      flowRate: 0.5,
      temperature: 80,
      pressure: 5,
    },
    {
      id: 2,
      name: "Amide Formation",
      date: "2023-04-15",
      chemicals: "EDC, HOBt, DIPEA",
      flowRate: 0.2,
      temperature: 25,
      pressure: 2,
    },
    {
      id: 3,
      name: "Hydrogenation",
      date: "2023-04-22",
      chemicals: "H2, Pd/C, MeOH",
      flowRate: 1.0,
      temperature: 40,
      pressure: 10,
    },
  ])

  const [newRecipe, setNewRecipe] = useState({
    name: "",
    chemicals: "",
    flowRate: "",
    temperature: "",
    pressure: "",
  })

  const handleInputChange = (field, value) => {
    setNewRecipe((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleAddRecipe = () => {
    const recipe = {
      id: Date.now(),
      date: new Date().toISOString().split("T")[0],
      ...newRecipe,
      flowRate: Number.parseFloat(newRecipe.flowRate),
      temperature: Number.parseFloat(newRecipe.temperature),
      pressure: Number.parseFloat(newRecipe.pressure),
    }

    setRecipes((prev) => [...prev, recipe])
    setNewRecipe({
      name: "",
      chemicals: "",
      flowRate: "",
      temperature: "",
      pressure: "",
    })

    addLogEntry(`New recipe "${recipe.name}" added`, "success")
  }

  const handleDeleteRecipe = (id) => {
    const recipe = recipes.find((r) => r.id === id)
    setRecipes((prev) => prev.filter((recipe) => recipe.id !== id))
    addLogEntry(`Recipe "${recipe.name}" deleted`, "info")
  }

  const handleRunRecipe = (recipe) => {
    addLogEntry(`Running recipe "${recipe.name}"`, "success")
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl">Experiment Recipes</CardTitle>
        <PermissionGate permission="create_recipe">
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add New Recipe
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Recipe</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="recipe-name">Recipe Name</Label>
                  <Input
                    id="recipe-name"
                    value={newRecipe.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="chemicals">Chemicals Used</Label>
                  <Input
                    id="chemicals"
                    value={newRecipe.chemicals}
                    onChange={(e) => handleInputChange("chemicals", e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="flow-rate">Flow Rate (mL/min)</Label>
                    <Input
                      id="flow-rate"
                      type="number"
                      value={newRecipe.flowRate}
                      onChange={(e) => handleInputChange("flowRate", e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="temperature">Temperature (°C)</Label>
                    <Input
                      id="temperature"
                      type="number"
                      value={newRecipe.temperature}
                      onChange={(e) => handleInputChange("temperature", e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="pressure">Pressure (bar)</Label>
                    <Input
                      id="pressure"
                      type="number"
                      value={newRecipe.pressure}
                      onChange={(e) => handleInputChange("pressure", e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={handleAddRecipe}>Add Recipe</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </PermissionGate>
      </CardHeader>
      <CardContent>
        {recipes.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            No recipes available.
            <PermissionGate permission="create_recipe">
              <div className="mt-2">
                <Button size="sm" variant="outline" asChild>
                  <DialogTrigger>
                    <Plus className="h-4 w-4 mr-1" />
                    Add your first recipe
                  </DialogTrigger>
                </Button>
              </div>
            </PermissionGate>
            <PermissionGate
              permission="create_recipe"
              fallback={
                <Alert className="mt-4">
                  <Lock className="h-4 w-4 mr-2" />
                  <AlertDescription>You don't have permission to create recipes</AlertDescription>
                </Alert>
              }
            />
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Experiment Name</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="hidden md:table-cell">Chemicals Used</TableHead>
                  <TableHead>Flow Rate</TableHead>
                  <TableHead className="hidden sm:table-cell">Temp.</TableHead>
                  <TableHead className="hidden sm:table-cell">Press.</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recipes.map((recipe) => (
                  <TableRow key={recipe.id}>
                    <TableCell className="font-medium">{recipe.name}</TableCell>
                    <TableCell>{recipe.date}</TableCell>
                    <TableCell className="hidden md:table-cell max-w-[200px] truncate" title={recipe.chemicals}>
                      {recipe.chemicals}
                    </TableCell>
                    <TableCell>{recipe.flowRate} mL/min</TableCell>
                    <TableCell className="hidden sm:table-cell">{recipe.temperature} °C</TableCell>
                    <TableCell className="hidden sm:table-cell">{recipe.pressure} bar</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <PermissionGate permission="run_recipe">
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Run Recipe"
                            onClick={() => handleRunRecipe(recipe)}
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                        </PermissionGate>

                        <PermissionGate permission="edit_recipe">
                          <Button variant="ghost" size="icon" title="Edit Recipe">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </PermissionGate>

                        <PermissionGate permission="delete_recipe">
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Delete Recipe"
                            onClick={() => handleDeleteRecipe(recipe.id)}
                          >
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
  )
}
