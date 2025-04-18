"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Thermometer, Gauge, Lock } from "lucide-react"
import { PermissionGate } from "@/components/permission-gate"

export function SystemMonitoring({ systemValues, updateSystemValue }) {
  const [inputValues, setInputValues] = useState({
    temperature: "",
    pressure: "",
  })

  const handleInputChange = (parameter, value) => {
    setInputValues((prev) => ({
      ...prev,
      [parameter]: value,
    }))
  }

  const handleSetValue = (parameter) => {
    const value = Number.parseFloat(inputValues[parameter])
    if (!isNaN(value)) {
      updateSystemValue(parameter, value)
    }
  }

  // Function to calculate gauge percentage
  const calculateGaugePercentage = (value, max) => {
    return (value / max) * 100
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-2xl">System Monitoring</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Temperature Control */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Thermometer className="h-5 w-5 text-red-500" />
            <h3 className="text-lg font-medium">Temperature Control</h3>
          </div>

          <PermissionGate
            permission="control_temperature"
            fallback={
              <Alert>
                <Lock className="h-4 w-4 mr-2" />
                <AlertDescription>You don't have permission to control temperature</AlertDescription>
              </Alert>
            }
          >
            <div className="grid gap-2">
              <Label htmlFor="set-temperature">Set Temperature (°C)</Label>
              <div className="flex gap-2">
                <Input
                  id="set-temperature"
                  type="number"
                  placeholder="25.0"
                  value={inputValues.temperature}
                  onChange={(e) => handleInputChange("temperature", e.target.value)}
                />
                <Button onClick={() => handleSetValue("temperature")}>Set</Button>
              </div>
            </div>
          </PermissionGate>

          <div className="flex flex-col items-center">
            <div className="relative w-32 h-32">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold">{systemValues.temperature.actual.toFixed(1)}</span>
                <span className="text-sm ml-1">°C</span>
              </div>
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  className="text-muted-foreground/20"
                  strokeWidth="10"
                  stroke="currentColor"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                />
                <circle
                  className="text-red-500"
                  strokeWidth="10"
                  strokeDasharray={251.2}
                  strokeDashoffset={
                    251.2 - (calculateGaugePercentage(systemValues.temperature.actual, 100) / 100) * 251.2
                  }
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                />
              </svg>
            </div>
            <div className="mt-2 text-sm text-muted-foreground">Set: {systemValues.temperature.set.toFixed(1)}°C</div>
          </div>
        </div>

        {/* Pressure Control */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Gauge className="h-5 w-5 text-blue-500" />
            <h3 className="text-lg font-medium">Pressure Control</h3>
          </div>

          <PermissionGate
            permission="control_pressure"
            fallback={
              <Alert>
                <Lock className="h-4 w-4 mr-2" />
                <AlertDescription>You don't have permission to control pressure</AlertDescription>
              </Alert>
            }
          >
            <div className="grid gap-2">
              <Label htmlFor="set-pressure">Set Pressure (bar)</Label>
              <div className="flex gap-2">
                <Input
                  id="set-pressure"
                  type="number"
                  placeholder="5.0"
                  value={inputValues.pressure}
                  onChange={(e) => handleInputChange("pressure", e.target.value)}
                />
                <Button onClick={() => handleSetValue("pressure")}>Set</Button>
              </div>
            </div>
          </PermissionGate>

          <div className="flex flex-col items-center">
            <div className="relative w-32 h-32">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold">{systemValues.pressure.actual.toFixed(1)}</span>
                <span className="text-sm ml-1">bar</span>
              </div>
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  className="text-muted-foreground/20"
                  strokeWidth="10"
                  stroke="currentColor"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                />
                <circle
                  className="text-blue-500"
                  strokeWidth="10"
                  strokeDasharray={251.2}
                  strokeDashoffset={251.2 - (calculateGaugePercentage(systemValues.pressure.actual, 20) / 100) * 251.2}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                />
              </svg>
            </div>
            <div className="mt-2 text-sm text-muted-foreground">Set: {systemValues.pressure.set.toFixed(1)} bar</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
