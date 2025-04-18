"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function ReactionConditionsCard() {
  const [reagents, setReagents] = useState([
    { name: "", concentration: 0, volume: 0 },
    { name: "", concentration: 0, volume: 0 },
    { name: "", concentration: 0, volume: 0 },
  ])

  const handleReagentChange = (index, field, value) => {
    const newReagents = [...reagents]

    if (field === "name") {
      newReagents[index].name = value
    } else {
      // Convert to number for concentration and volume
      const numValue = Number.parseFloat(value) || 0
      newReagents[index][field] = numValue
    }

    setReagents(newReagents)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Reaction Conditions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Simplified Reagents */}
        {reagents.map((reagent, index) => (
          <div key={index} className="space-y-2">
            <h3 className="text-sm font-medium">Reagent {index + 1}</h3>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label htmlFor={`reagent-${index}-name`} className="text-xs">
                  Name
                </Label>
                <Input
                  id={`reagent-${index}-name`}
                  value={reagent.name}
                  onChange={(e) => handleReagentChange(index, "name", e.target.value)}
                  placeholder="Reagent name"
                  className="h-8"
                />
              </div>
              <div>
                <Label htmlFor={`reagent-${index}-conc`} className="text-xs">
                  Conc. (mol/L)
                </Label>
                <Input
                  id={`reagent-${index}-conc`}
                  type="number"
                  step="0.01"
                  min="0"
                  value={reagent.concentration || ""}
                  onChange={(e) => handleReagentChange(index, "concentration", e.target.value)}
                  placeholder="0.00"
                  className="h-8"
                />
              </div>
              <div>
                <Label htmlFor={`reagent-${index}-vol`} className="text-xs">
                  Volume (mL)
                </Label>
                <Input
                  id={`reagent-${index}-vol`}
                  type="number"
                  step="0.1"
                  min="0"
                  value={reagent.volume || ""}
                  onChange={(e) => handleReagentChange(index, "volume", e.target.value)}
                  placeholder="0.0"
                  className="h-8"
                />
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
