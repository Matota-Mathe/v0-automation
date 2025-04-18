"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Calculator } from "lucide-react"

export function ResidenceTimeCalculator({ addLogEntry }) {
  const [flowRate, setFlowRate] = useState("")
  const [reactorVolume, setReactorVolume] = useState("")
  const [residenceTime, setResidenceTime] = useState(null)

  const calculateResidenceTime = () => {
    const flow = Number.parseFloat(flowRate)
    const volume = Number.parseFloat(reactorVolume)

    if (isNaN(flow) || isNaN(volume) || flow <= 0) {
      setResidenceTime(null)
      addLogEntry("Invalid input for residence time calculation", "error")
      return
    }

    // Residence time = Volume / Flow Rate
    const time = volume / flow
    setResidenceTime(time)
    addLogEntry(`Residence time calculated: ${time.toFixed(2)} min`, "info")
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          <CardTitle>Residence Time Calculator</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="flow-rate-calc">Flow Rate (mL/min)</Label>
          <Input
            id="flow-rate-calc"
            type="number"
            min="0.1"
            step="0.1"
            placeholder="1.0"
            value={flowRate}
            onChange={(e) => setFlowRate(e.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="reactor-volume">Reactor Volume (mL)</Label>
          <Input
            id="reactor-volume"
            type="number"
            min="0.1"
            step="0.1"
            placeholder="10.0"
            value={reactorVolume}
            onChange={(e) => setReactorVolume(e.target.value)}
          />
        </div>

        <Button className="w-full" onClick={calculateResidenceTime} disabled={!flowRate || !reactorVolume}>
          Calculate
        </Button>

        <div className="rounded-lg border p-3">
          <Label className="text-sm text-muted-foreground">Residence Time (min)</Label>
          <div className="text-2xl font-bold mt-1">{residenceTime !== null ? residenceTime.toFixed(2) : "—"}</div>
        </div>
      </CardContent>
    </Card>
  )
}
