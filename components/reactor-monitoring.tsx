"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/components/ui/use-toast"
import { useEquipment } from "@/contexts/equipment-context"
import { Thermometer, Gauge, AlertTriangle, CheckCircle, Save, Download, Info } from "lucide-react"

// Helper function to generate random data points
const generateDataPoints = (count, baseValue, variance) => {
  return Array.from({ length: count }, (_, i) => ({
    time: new Date(Date.now() - (count - i - 1) * 60000).toISOString(),
    value: baseValue + (Math.random() * variance * 2 - variance),
  }))
}

export function ReactorMonitoring({ systemValues = {}, updateSystemValue = () => {} }) {
  const { toast } = useToast()
  const { reactorTypes } = useEquipment()
  const updateInProgress = useRef(false)

  const [inputValues, setInputValues] = useState({
    temperature: "",
    pressure: "",
  })

  const [selectedReactor, setSelectedReactor] = useState(reactorTypes[0]?.id || "")
  const [activeTab, setActiveTab] = useState("current")
  const [autoControl, setAutoControl] = useState(false)
  const [safetyLimits, setSafetyLimits] = useState({
    temperature: { min: 0, max: 150 },
    pressure: { min: 0, max: 20 },
  })

  // Historical data for charts
  const [temperatureHistory, setTemperatureHistory] = useState(() => generateDataPoints(20, 25, 0.5))
  const [pressureHistory, setPressureHistory] = useState(() => generateDataPoints(20, 5, 0.2))

  // Preset profiles
  const [profiles, setProfiles] = useState([
    { id: 1, name: "Standard Reaction", temperature: 25, pressure: 5 },
    { id: 2, name: "High Temperature", temperature: 80, pressure: 10 },
    { id: 3, name: "Low Pressure", temperature: 20, pressure: 2 },
  ])

  // Ensure systemValues has default values
  const defaultValues = {
    temperature: { set: 25.0, actual: 25.2 },
    pressure: { set: 5.0, actual: 5.1 },
  }

  // Merge provided values with defaults
  const values = {
    ...defaultValues,
    ...systemValues,
  }

  // Get the selected reactor type
  const selectedReactorType = reactorTypes.find((r) => r.id === selectedReactor) || reactorTypes[0]

  // Update history data periodically
  useEffect(() => {
    const interval = setInterval(() => {
      // Add new data point for temperature
      setTemperatureHistory((prev) => {
        const newPoint = {
          time: new Date().toISOString(),
          value: values.temperature.actual,
        }
        return [...prev.slice(1), newPoint]
      })

      // Add new data point for pressure
      setPressureHistory((prev) => {
        const newPoint = {
          time: new Date().toISOString(),
          value: values.pressure.actual,
        }
        return [...prev.slice(1), newPoint]
      })
    }, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [values.temperature.actual, values.pressure.actual])

  const handleInputChange = (parameter, value) => {
    setInputValues((prev) => ({
      ...prev,
      [parameter]: value,
    }))
  }

  const handleSetValue = (parameter) => {
    if (updateInProgress.current) return
    updateInProgress.current = true

    const value = Number.parseFloat(inputValues[parameter])
    if (!isNaN(value)) {
      // Check safety limits
      const limits = safetyLimits[parameter]
      if (value < limits.min || value > limits.max) {
        toast({
          title: "Safety Limit Exceeded",
          description: `${parameter.charAt(0).toUpperCase() + parameter.slice(1)} must be between ${limits.min} and ${limits.max}`,
          variant: "destructive",
        })
        updateInProgress.current = false
        return
      }

      updateSystemValue(parameter, value)
      toast({
        title: `${parameter.charAt(0).toUpperCase() + parameter.slice(1)} Updated`,
        description: `Set to ${value} ${parameter === "temperature" ? "°C" : "bar"}`,
      })
    }

    setTimeout(() => {
      updateInProgress.current = false
    }, 600)
  }

  const applyProfile = (profile) => {
    if (updateInProgress.current) return
    updateInProgress.current = true

    // Update temperature
    updateSystemValue("temperature", profile.temperature)

    // Update pressure after a small delay
    setTimeout(() => {
      updateSystemValue("pressure", profile.pressure)
      updateInProgress.current = false

      toast({
        title: "Profile Applied",
        description: `Applied "${profile.name}" profile`,
      })
    }, 300)
  }

  const saveCurrentAsProfile = () => {
    const newProfile = {
      id: Date.now(),
      name: `Profile ${profiles.length + 1}`,
      temperature: values.temperature.set,
      pressure: values.pressure.set,
    }

    setProfiles((prev) => [...prev, newProfile])

    toast({
      title: "Profile Saved",
      description: `Current settings saved as "${newProfile.name}"`,
    })
  }

  const exportData = (dataType) => {
    const data = dataType === "temperature" ? temperatureHistory : pressureHistory
    const csvContent = ["time,value", ...data.map((point) => `${point.time},${point.value}`)].join("\n")

    // Create a blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `${dataType}-history-${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Data Exported",
      description: `${dataType.charAt(0).toUpperCase() + dataType.slice(1)} history exported to CSV`,
    })
  }

  // Calculate temperature status
  const getTemperatureStatus = () => {
    const temp = values.temperature.actual
    const setTemp = values.temperature.set
    const diff = Math.abs(temp - setTemp)

    if (diff > 5) return "error"
    if (diff > 2) return "warning"
    return "normal"
  }

  // Calculate pressure status
  const getPressureStatus = () => {
    const pressure = values.pressure.actual
    const setPress = values.pressure.set
    const diff = Math.abs(pressure - setPress)

    if (diff > 1) return "error"
    if (diff > 0.5) return "warning"
    return "normal"
  }

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case "normal":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
      case "warning":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
      case "error":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
    }
  }

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case "normal":
        return <CheckCircle className="h-4 w-4 mr-1" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 mr-1" />
      case "error":
        return <AlertTriangle className="h-4 w-4 mr-1" />
      default:
        return <Info className="h-4 w-4 mr-1" />
    }
  }

  // Calculate gauge percentage
  const calculateGaugePercentage = (value, max) => {
    return (value / max) * 100
  }

  // Temperature status
  const temperatureStatus = getTemperatureStatus()
  const pressureStatus = getPressureStatus()

  // Mini chart component
  const MiniChart = ({ data, color }) => {
    const maxValue = Math.max(...data.map((d) => d.value)) * 1.1
    const minValue = Math.min(...data.map((d) => d.value)) * 0.9
    const range = maxValue - minValue

    return (
      <div className="h-16 w-full flex items-end">
        {data.map((point, i) => {
          const height = ((point.value - minValue) / range) * 100
          return (
            <div
              key={i}
              className="flex-1"
              style={{
                height: `${height}%`,
                backgroundColor: color,
                opacity: 0.3 + (i / data.length) * 0.7,
              }}
            />
          )
        })}
      </div>
    )
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl">Reactor Monitoring</CardTitle>
          <div className="flex items-center gap-2">
            <Label htmlFor="auto-control" className="text-sm">
              Auto Control
            </Label>
            <Switch id="auto-control" checked={autoControl} onCheckedChange={setAutoControl} />
          </div>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <Label htmlFor="reactor-type" className="text-sm">
            Reactor Type:
          </Label>
          <Select value={selectedReactor} onValueChange={setSelectedReactor}>
            <SelectTrigger id="reactor-type" className="w-[200px]">
              <SelectValue placeholder="Select reactor type" />
            </SelectTrigger>
            <SelectContent>
              {reactorTypes.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.name} ({type.volume} mL)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedReactorType && (
          <div className="text-xs text-muted-foreground mt-1">
            Max Temperature: {selectedReactorType.maxTemperature}°C | Max Pressure: {selectedReactorType.maxPressure}{" "}
            bar | Material: {selectedReactorType.material}
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="current">Current Values</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="current" className="space-y-6">
            {/* Temperature Control */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Thermometer className="h-5 w-5 text-red-500" />
                  <h3 className="text-lg font-medium">Temperature Control</h3>
                </div>
                <Badge className={getStatusColor(temperatureStatus)} variant="outline">
                  {getStatusIcon(temperatureStatus)}
                  {temperatureStatus === "normal"
                    ? "Stable"
                    : temperatureStatus === "warning"
                      ? "Unstable"
                      : "Critical"}
                </Badge>
              </div>

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

              <div className="flex flex-col items-center">
                <div className="relative w-32 h-32">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold">{values.temperature.actual.toFixed(1)}</span>
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
                      className={`${
                        temperatureStatus === "normal"
                          ? "text-green-500"
                          : temperatureStatus === "warning"
                            ? "text-yellow-500"
                            : "text-red-500"
                      }`}
                      strokeWidth="10"
                      strokeDasharray={251.2}
                      strokeDashoffset={
                        251.2 -
                        (calculateGaugePercentage(
                          values.temperature.actual,
                          selectedReactorType?.maxTemperature || 150,
                        ) /
                          100) *
                          251.2
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
                <div className="mt-2 text-sm text-muted-foreground">Set: {values.temperature.set.toFixed(1)}°C</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Difference: {Math.abs(values.temperature.actual - values.temperature.set).toFixed(1)}°C
                </div>
              </div>
            </div>

            {/* Pressure Control */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Gauge className="h-5 w-5 text-blue-500" />
                  <h3 className="text-lg font-medium">Pressure Control</h3>
                </div>
                <Badge className={getStatusColor(pressureStatus)} variant="outline">
                  {getStatusIcon(pressureStatus)}
                  {pressureStatus === "normal" ? "Stable" : pressureStatus === "warning" ? "Unstable" : "Critical"}
                </Badge>
              </div>

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

              <div className="flex flex-col items-center">
                <div className="relative w-32 h-32">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold">{values.pressure.actual.toFixed(1)}</span>
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
                      className={`${
                        pressureStatus === "normal"
                          ? "text-blue-500"
                          : pressureStatus === "warning"
                            ? "text-yellow-500"
                            : "text-red-500"
                      }`}
                      strokeWidth="10"
                      strokeDasharray={251.2}
                      strokeDashoffset={
                        251.2 -
                        (calculateGaugePercentage(values.pressure.actual, selectedReactorType?.maxPressure || 20) /
                          100) *
                          251.2
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
                <div className="mt-2 text-sm text-muted-foreground">Set: {values.pressure.set.toFixed(1)} bar</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Difference: {Math.abs(values.pressure.actual - values.pressure.set).toFixed(1)} bar
                </div>
              </div>
            </div>

            {/* Safety Limits */}
            <div className="space-y-4 border-t pt-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                <h3 className="text-lg font-medium">Safety Limits</h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Temperature Limits (°C)</Label>
                    <span className="text-sm">
                      {safetyLimits.temperature.min} - {safetyLimits.temperature.max}°C
                    </span>
                  </div>
                  <div className="flex gap-4">
                    <Slider
                      value={[safetyLimits.temperature.min, safetyLimits.temperature.max]}
                      min={0}
                      max={selectedReactorType?.maxTemperature || 200}
                      step={1}
                      onValueChange={(value) => {
                        setSafetyLimits((prev) => ({
                          ...prev,
                          temperature: { min: value[0], max: value[1] },
                        }))
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Pressure Limits (bar)</Label>
                    <span className="text-sm">
                      {safetyLimits.pressure.min} - {safetyLimits.pressure.max} bar
                    </span>
                  </div>
                  <div className="flex gap-4">
                    <Slider
                      value={[safetyLimits.pressure.min, safetyLimits.pressure.max]}
                      min={0}
                      max={selectedReactorType?.maxPressure || 30}
                      step={0.5}
                      onValueChange={(value) => {
                        setSafetyLimits((prev) => ({
                          ...prev,
                          pressure: { min: value[0], max: value[1] },
                        }))
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            {/* Temperature History */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Thermometer className="h-5 w-5 text-red-500" />
                  <h3 className="text-lg font-medium">Temperature History</h3>
                </div>
                <Button variant="outline" size="sm" onClick={() => exportData("temperature")}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>

              <div className="border rounded-md p-4">
                <MiniChart data={temperatureHistory} color="rgba(239, 68, 68, 0.7)" />
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>-20 min</span>
                  <span>Now</span>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-sm">
                    <span>Current: {values.temperature.actual.toFixed(1)}°C</span>
                    <span>
                      Average:{" "}
                      {(
                        temperatureHistory.reduce((sum, point) => sum + point.value, 0) / temperatureHistory.length
                      ).toFixed(1)}
                      °C
                    </span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span>Min: {Math.min(...temperatureHistory.map((p) => p.value)).toFixed(1)}°C</span>
                    <span>Max: {Math.max(...temperatureHistory.map((p) => p.value)).toFixed(1)}°C</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pressure History */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Gauge className="h-5 w-5 text-blue-500" />
                  <h3 className="text-lg font-medium">Pressure History</h3>
                </div>
                <Button variant="outline" size="sm" onClick={() => exportData("pressure")}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>

              <div className="border rounded-md p-4">
                <MiniChart data={pressureHistory} color="rgba(59, 130, 246, 0.7)" />
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>-20 min</span>
                  <span>Now</span>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-sm">
                    <span>Current: {values.pressure.actual.toFixed(1)} bar</span>
                    <span>
                      Average:{" "}
                      {(pressureHistory.reduce((sum, point) => sum + point.value, 0) / pressureHistory.length).toFixed(
                        1,
                      )}{" "}
                      bar
                    </span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span>Min: {Math.min(...pressureHistory.map((p) => p.value)).toFixed(1)} bar</span>
                    <span>Max: {Math.max(...pressureHistory.map((p) => p.value)).toFixed(1)} bar</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>

      <CardFooter className="flex-col space-y-4">
        <div className="w-full">
          <h3 className="text-sm font-medium mb-2">Reaction Profiles</h3>
          <div className="flex flex-wrap gap-2">
            {profiles.map((profile) => (
              <TooltipProvider key={profile.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" onClick={() => applyProfile(profile)}>
                      {profile.name}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Temperature: {profile.temperature}°C</p>
                    <p>Pressure: {profile.pressure} bar</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}

            <Button variant="outline" size="sm" onClick={saveCurrentAsProfile}>
              <Save className="h-4 w-4 mr-1" />
              Save Current
            </Button>
          </div>
        </div>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Reactor is operating within safe parameters.{" "}
            {autoControl ? "Automatic control is enabled." : "Manual control is enabled."}
          </AlertDescription>
        </Alert>
      </CardFooter>
    </Card>
  )
}
