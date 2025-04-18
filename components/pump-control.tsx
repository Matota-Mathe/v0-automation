"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, AlertTriangle, CheckCircle, Play, Pause, RotateCcw } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useEquipment } from "@/contexts/equipment-context"

export function PumpControl({ pumpFlowRates = {}, updatePumpFlowRate = () => {} }) {
  const { toast } = useToast()
  const { pumpTypes } = useEquipment()
  const initialRender = useRef(true)

  const [inputValues, setInputValues] = useState({
    pump1: "",
    pump2: "",
    pump3: "",
  })

  const [pumpStatus, setPumpStatus] = useState({
    pump1: "inactive",
    pump2: "inactive",
    pump3: "inactive",
  })

  const [selectedPumpTypes, setSelectedPumpTypes] = useState({
    pump1: pumpTypes[0]?.id || "",
    pump2: pumpTypes[1]?.id || "",
    pump3: pumpTypes[2]?.id || "",
  })

  // Ensure pumpFlowRates has default values
  const defaultFlowRates = {
    pump1: { set: 0.5, actual: 0.48 },
    pump2: { set: 0.3, actual: 0.31 },
    pump3: { set: 0.0, actual: 0.0 },
  }

  // Merge provided flow rates with defaults - do this only once to avoid recreating on every render
  const flowRates = useRef({
    ...defaultFlowRates,
    ...pumpFlowRates,
  }).current

  // Update local flowRates ref when props change
  useEffect(() => {
    if (!initialRender.current) {
      flowRates.pump1 = pumpFlowRates.pump1 || defaultFlowRates.pump1
      flowRates.pump2 = pumpFlowRates.pump2 || defaultFlowRates.pump2
      flowRates.pump3 = pumpFlowRates.pump3 || defaultFlowRates.pump3
    } else {
      initialRender.current = false
    }
  }, [pumpFlowRates, defaultFlowRates, flowRates])

  // Update pump status based on flow rates - only when actual values change
  useEffect(() => {
    const pump1Active = (pumpFlowRates.pump1?.actual || 0) > 0
    const pump2Active = (pumpFlowRates.pump2?.actual || 0) > 0
    const pump3Active = (pumpFlowRates.pump3?.actual || 0) > 0

    setPumpStatus({
      pump1: pump1Active ? "active" : "inactive",
      pump2: pump2Active ? "active" : "inactive",
      pump3: pump3Active ? "active" : "inactive",
    })
  }, [pumpFlowRates.pump1?.actual, pumpFlowRates.pump2?.actual, pumpFlowRates.pump3?.actual])

  const handleInputChange = (pump, value) => {
    setInputValues((prev) => ({
      ...prev,
      [pump]: value,
    }))
  }

  const handleSetFlowRate = (pump) => {
    const value = Number.parseFloat(inputValues[pump])
    if (!isNaN(value) && value >= 0) {
      // Get the selected pump type
      const pumpTypeId = selectedPumpTypes[pump]
      const pumpType = pumpTypes.find((p) => p.id === pumpTypeId)

      // Check if flow rate is within the allowed range
      if (pumpType && (value < pumpType.flowRateMin || value > pumpType.flowRateMax)) {
        toast({
          title: "Invalid Flow Rate",
          description: `Flow rate must be between ${pumpType.flowRateMin} and ${pumpType.flowRateMax} mL/min for this pump type.`,
          variant: "destructive",
        })
        return
      }

      updatePumpFlowRate(pump, value)
      toast({
        title: "Flow Rate Updated",
        description: `${pump.charAt(0).toUpperCase() + pump.slice(1)} flow rate set to ${value} mL/min.`,
      })
    }
  }

  const togglePumpStatus = (pump) => {
    const newStatus = pumpStatus[pump] === "active" ? "inactive" : "active"

    // If turning off, set flow rate to 0
    if (newStatus === "inactive") {
      updatePumpFlowRate(pump, 0)
    } else {
      // If turning on, use the last set value or default to minimum flow rate
      const pumpTypeId = selectedPumpTypes[pump]
      const pumpType = pumpTypes.find((p) => p.id === pumpTypeId)
      const minFlowRate = pumpType?.flowRateMin || 0.1

      const lastSetValue = flowRates[pump].set
      updatePumpFlowRate(pump, lastSetValue > 0 ? lastSetValue : minFlowRate)
    }
  }

  const emergencyStop = () => {
    // Set all pumps to 0 flow rate
    Object.keys(flowRates).forEach((pumpId) => {
      updatePumpFlowRate(pumpId, 0)
    })

    toast({
      title: "Emergency Stop",
      description: "All pumps have been stopped.",
      variant: "destructive",
    })
  }

  const handlePumpTypeChange = (pump, typeId) => {
    setSelectedPumpTypes((prev) => ({ ...prev, [pump]: typeId }))
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
      case "inactive":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
      case "error":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
      case "warning":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 mr-1" />
      case "inactive":
        return <Pause className="h-4 w-4 mr-1" />
      case "error":
        return <AlertCircle className="h-4 w-4 mr-1" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 mr-1" />
      default:
        return <Pause className="h-4 w-4 mr-1" />
    }
  }

  // Enhanced PumpCard component
  const PumpCard = ({ pumpId, title }) => {
    const pumpData = pumpFlowRates[pumpId] || { set: 0, actual: 0 }
    const status = pumpStatus[pumpId] || "inactive"
    const pumpTypeId = selectedPumpTypes[pumpId]
    const pumpType = pumpTypes.find((p) => p.id === pumpTypeId)

    // Calculate progress percentage based on the max flow rate of the selected pump type
    const maxFlowRate = pumpType?.flowRateMax || 10
    const progressPercentage = (pumpData.actual / maxFlowRate) * 100

    return (
      <Card className={status === "active" ? "border-green-300 dark:border-green-700" : ""}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">{title}</CardTitle>
            <Badge className={getStatusColor(status)} variant="outline">
              {getStatusIcon(status)}
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor={`${pumpId}-type`}>Pump Type</Label>
              <Select value={pumpTypeId} onValueChange={(value) => handlePumpTypeChange(pumpId, value)}>
                <SelectTrigger id={`${pumpId}-type`}>
                  <SelectValue placeholder="Select pump type" />
                </SelectTrigger>
                <SelectContent>
                  {pumpTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name} ({type.manufacturer})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {pumpType && (
                <div className="text-xs text-muted-foreground">
                  Flow rate range: {pumpType.flowRateMin} - {pumpType.flowRateMax} mL/min
                </div>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor={`${pumpId}-flow-rate`}>Set Flow Rate (mL/min)</Label>
              <div className="flex gap-2">
                <Input
                  id={`${pumpId}-flow-rate`}
                  type="number"
                  min="0"
                  step="0.1"
                  placeholder="0.0"
                  value={inputValues[pumpId]}
                  onChange={(e) => handleInputChange(pumpId, e.target.value)}
                />
                <Button onClick={() => handleSetFlowRate(pumpId)}>Set</Button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Actual Flow Rate (mL/min)</Label>
                <span className="font-mono">{pumpData.actual?.toFixed(2) || "0.00"}</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0</span>
                <span>{maxFlowRate} mL/min</span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant={status === "active" ? "destructive" : "default"}
            size="sm"
            onClick={() => togglePumpStatus(pumpId)}
          >
            {status === "active" ? (
              <>
                <Pause className="mr-1 h-4 w-4" /> Stop
              </>
            ) : (
              <>
                <Play className="mr-1 h-4 w-4" /> Start
              </>
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              updatePumpFlowRate(pumpId, 0)
              setInputValues((prev) => ({ ...prev, [pumpId]: "" }))
            }}
          >
            <RotateCcw className="mr-1 h-4 w-4" /> Reset
          </Button>
        </CardFooter>
      </Card>
    )
  }

  // Calculate total flow rate from the current props, not the ref
  const totalFlowRate = (
    (pumpFlowRates.pump1?.actual || 0) +
    (pumpFlowRates.pump2?.actual || 0) +
    (pumpFlowRates.pump3?.actual || 0)
  ).toFixed(2)

  // Count active pumps from the current status state
  const activePumps = Object.values(pumpStatus).filter((status) => status === "active").length

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Pump Control</h2>
        <Button variant="destructive" onClick={emergencyStop} className="bg-red-600 hover:bg-red-700">
          Emergency Stop
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <PumpCard pumpId="pump1" title="Pump 1" />
        <PumpCard pumpId="pump2" title="Pump 2" />
        <PumpCard pumpId="pump3" title="Pump 3" />
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">System Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Total Flow Rate:</span>
              <span className="font-medium">{totalFlowRate} mL/min</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Active Pumps:</span>
              <span className="font-medium">{activePumps} / 3</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
