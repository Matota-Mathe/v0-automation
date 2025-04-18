"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calculator } from "lucide-react"

export function BprCalculator({ addLogEntry }) {
  const [solvent, setSolvent] = useState("")
  const [temperature, setTemperature] = useState("")
  const [bprRequired, setBprRequired] = useState(null)

  // Simplified vapor pressure calculation
  // In a real application, this would use Antoine equations or lookup tables
  const calculateBpr = () => {
    const temp = Number.parseFloat(temperature)

    if (isNaN(temp) || !solvent) {
      setBprRequired(null)
      addLogEntry("Invalid input for BPR calculation", "error")
      return
    }

    let vaporPressure = 0

    // Very simplified vapor pressure estimation
    // In a real application, this would use proper equations
    switch (solvent) {
      case "water":
        vaporPressure = 0.02 * Math.exp(0.05 * temp)
        break
      case "methanol":
        vaporPressure = 0.04 * Math.exp(0.06 * temp)
        break
      case "ethanol":
        vaporPressure = 0.03 * Math.exp(0.055 * temp)
        break
      case "acetonitrile":
        vaporPressure = 0.025 * Math.exp(0.058 * temp)
        break
      case "dcm":
        vaporPressure = 0.06 * Math.exp(0.065 * temp)
        break
      case "thf":
        vaporPressure = 0.035 * Math.exp(0.062 * temp)
        break
      case "dmf":
        vaporPressure = 0.015 * Math.exp(0.045 * temp)
        break
      default:
        vaporPressure = 0
    }

    // Add safety factor
    const bpr = vaporPressure * 1.5
    setBprRequired(bpr)
    addLogEntry(`BPR calculation: ${bpr.toFixed(1)} bar required for ${solvent} at ${temp}°C`, "info")
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          <CardTitle>BPR Calculator</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="solvent-select">Select Solvent</Label>
          <Select value={solvent} onValueChange={setSolvent}>
            <SelectTrigger id="solvent-select">
              <SelectValue placeholder="Select solvent" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="water">Water</SelectItem>
              <SelectItem value="methanol">Methanol</SelectItem>
              <SelectItem value="ethanol">Ethanol</SelectItem>
              <SelectItem value="acetonitrile">Acetonitrile</SelectItem>
              <SelectItem value="dcm">DCM</SelectItem>
              <SelectItem value="thf">THF</SelectItem>
              <SelectItem value="dmf">DMF</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="temperature-bpr">Set Temperature (°C)</Label>
          <Input
            id="temperature-bpr"
            type="number"
            min="0"
            max="200"
            placeholder="25"
            value={temperature}
            onChange={(e) => setTemperature(e.target.value)}
          />
        </div>

        <Button className="w-full" onClick={calculateBpr} disabled={!solvent || !temperature}>
          Calculate
        </Button>

        <div className="rounded-lg border p-3">
          <Label className="text-sm text-muted-foreground">Minimum BPR Required (bar)</Label>
          <div className="text-2xl font-bold mt-1">{bprRequired !== null ? bprRequired.toFixed(1) : "—"}</div>
        </div>
      </CardContent>
    </Card>
  )
}
