"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { ProtectedRoute } from "@/components/protected-route"
import { PermissionGate } from "@/components/permission-gate"
import { ThemeToggle } from "@/components/theme-toggle"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LineChart,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  Bar,
  Line,
  ResponsiveContainer,
  Tooltip,
} from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Download, BarChart2, History, Save } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"

// Mock data for charts
const temperatureData = [
  { time: "00:00", temperature: 25.2 },
  { time: "01:00", temperature: 25.3 },
  { time: "02:00", temperature: 25.1 },
  { time: "03:00", temperature: 24.9 },
  { time: "04:00", temperature: 24.8 },
  { time: "05:00", temperature: 24.7 },
  { time: "06:00", temperature: 24.9 },
  { time: "07:00", temperature: 25.0 },
  { time: "08:00", temperature: 25.2 },
  { time: "09:00", temperature: 25.5 },
  { time: "10:00", temperature: 25.8 },
  { time: "11:00", temperature: 26.0 },
  { time: "12:00", temperature: 26.2 },
]

const flowRateData = [
  { time: "00:00", pump1: 0.5, pump2: 0.3, pump3: 0.0 },
  { time: "01:00", pump1: 0.5, pump2: 0.3, pump3: 0.0 },
  { time: "02:00", pump1: 0.5, pump2: 0.3, pump3: 0.0 },
  { time: "03:00", pump1: 0.5, pump2: 0.3, pump3: 0.0 },
  { time: "04:00", pump1: 0.5, pump2: 0.3, pump3: 0.0 },
  { time: "05:00", pump1: 0.5, pump2: 0.3, pump3: 0.0 },
  { time: "06:00", pump1: 0.5, pump2: 0.3, pump3: 0.0 },
  { time: "07:00", pump1: 0.5, pump2: 0.3, pump3: 0.0 },
  { time: "08:00", pump1: 0.5, pump2: 0.3, pump3: 0.0 },
  { time: "09:00", pump1: 0.5, pump2: 0.3, pump3: 0.0 },
  { time: "10:00", pump1: 0.5, pump2: 0.3, pump3: 0.2 },
  { time: "11:00", pump1: 0.5, pump2: 0.3, pump3: 0.5 },
  { time: "12:00", pump1: 0.5, pump2: 0.3, pump3: 0.5 },
]

const experimentData = [
  { name: "Suzuki Coupling", count: 12 },
  { name: "Amide Formation", count: 8 },
  { name: "Hydrogenation", count: 15 },
  { name: "Oxidation", count: 6 },
  { name: "Reduction", count: 9 },
]

export default function AnalyticsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [sensorLogs, setSensorLogs] = useState([])
  const [isRecording, setIsRecording] = useState(false)
  const [recordingStartTime, setRecordingStartTime] = useState(null)

  // Generate simulated sensor data
  useEffect(() => {
    if (!isRecording) return

    const interval = setInterval(() => {
      const now = new Date()
      const temperature = (25 + Math.random() * 1.5).toFixed(2)
      const pressure = (5 + Math.random() * 0.8).toFixed(2)

      setSensorLogs((prev) => [
        {
          timestamp: now.toISOString(),
          formattedTime: now.toLocaleTimeString(),
          temperature: Number.parseFloat(temperature),
          pressure: Number.parseFloat(pressure),
        },
        ...prev,
      ])
    }, 5000) // Add new data every 5 seconds

    return () => clearInterval(interval)
  }, [isRecording])

  const startRecording = () => {
    setSensorLogs([])
    setIsRecording(true)
    setRecordingStartTime(new Date())
    toast({
      title: "Recording Started",
      description: "Real-time temperature and pressure logging has started.",
    })
  }

  const stopRecording = () => {
    setIsRecording(false)
    toast({
      title: "Recording Stopped",
      description: "Sensor data recording has been stopped.",
    })
  }

  const exportToCSV = () => {
    if (sensorLogs.length === 0) {
      toast({
        title: "No Data to Export",
        description: "There is no sensor data to export. Start recording first.",
        variant: "destructive",
      })
      return
    }

    // Create CSV content
    const headers = ["Timestamp", "Time", "Temperature (°C)", "Pressure (bar)"]
    const rows = sensorLogs.map((log) => [
      log.timestamp,
      log.formattedTime,
      log.temperature.toString(),
      log.pressure.toString(),
    ])

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")),
    ].join("\n")

    // Create and download the file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    const date = new Date().toISOString().split("T")[0]
    link.setAttribute("href", url)
    link.setAttribute("download", `sensor_data_${date}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // Save to localStorage for documentation page
    const savedExports = JSON.parse(localStorage.getItem("sensorDataExports") || "[]")
    const newExport = {
      id: Date.now(),
      filename: `sensor_data_${date}.csv`,
      date: new Date().toISOString(),
      recordingStartTime: recordingStartTime?.toISOString() || new Date().toISOString(),
      recordingEndTime: new Date().toISOString(),
      dataPoints: sensorLogs.length,
      csvData: csvContent,
    }

    localStorage.setItem("sensorDataExports", JSON.stringify([newExport, ...savedExports]))

    toast({
      title: "Data Exported",
      description: "Sensor data has been exported to CSV and saved to Documentation.",
    })
  }

  return (
    <ProtectedRoute>
      <PermissionGate
        permission="view_analytics"
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <Card className="w-[400px]">
              <CardHeader>
                <CardTitle>Access Denied</CardTitle>
                <CardDescription>You don't have permission to access analytics.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => router.push("/")}>Return to Dashboard</Button>
              </CardContent>
            </Card>
          </div>
        }
      >
        <div className="min-h-screen bg-background">
          <Navbar />
          <main className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <BarChart2 className="h-6 w-6" />
                <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
              </div>
              <ThemeToggle />
            </div>

            <Tabs defaultValue="temperature" className="space-y-4">
              <TabsList>
                <TabsTrigger value="temperature">Temperature</TabsTrigger>
                <TabsTrigger value="flow-rates">Flow Rates</TabsTrigger>
                <TabsTrigger value="experiments">Experiments</TabsTrigger>
                <TabsTrigger value="sensor-logs">Sensor Logs</TabsTrigger>
              </TabsList>

              <TabsContent value="temperature" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Temperature Over Time</CardTitle>
                    <CardDescription>24-hour temperature monitoring data</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[400px]">
                    <ChartContainer
                      config={{
                        temperature: {
                          label: "Temperature (°C)",
                          color: "hsl(221.2 83.2% 53.3%)",
                        },
                      }}
                      className="h-full"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={temperatureData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="time" />
                          <YAxis domain={[24, 27]} />
                          <Tooltip content={<ChartTooltipContent />} />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="temperature"
                            stroke="var(--color-temperature)"
                            activeDot={{ r: 8 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="flow-rates" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Pump Flow Rates</CardTitle>
                    <CardDescription>24-hour flow rate monitoring data</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[400px]">
                    <ChartContainer
                      config={{
                        pump1: {
                          label: "Pump 1 (mL/min)",
                          color: "hsl(221.2 83.2% 53.3%)",
                        },
                        pump2: {
                          label: "Pump 2 (mL/min)",
                          color: "hsl(142.1 76.2% 36.3%)",
                        },
                        pump3: {
                          label: "Pump 3 (mL/min)",
                          color: "hsl(346.8 77.2% 49.8%)",
                        },
                      }}
                      className="h-full"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={flowRateData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="time" />
                          <YAxis domain={[0, 1]} />
                          <Tooltip content={<ChartTooltipContent />} />
                          <Legend />
                          <Line type="monotone" dataKey="pump1" stroke="var(--color-pump1)" />
                          <Line type="monotone" dataKey="pump2" stroke="var(--color-pump2)" />
                          <Line type="monotone" dataKey="pump3" stroke="var(--color-pump3)" />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="experiments" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Experiment Types</CardTitle>
                    <CardDescription>Distribution of experiment types run in the lab</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[400px]">
                    <ChartContainer
                      config={{
                        count: {
                          label: "Number of Experiments",
                          color: "hsl(221.2 83.2% 53.3%)",
                        },
                      }}
                      className="h-full"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={experimentData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip content={<ChartTooltipContent />} />
                          <Legend />
                          <Bar dataKey="count" fill="var(--color-count)" />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="sensor-logs" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <History className="h-5 w-5" />
                          Real-Time Temperature & Pressure Log
                        </CardTitle>
                        <CardDescription>
                          {isRecording
                            ? "Recording sensor data in real-time. New readings every 5 seconds."
                            : "Start recording to log temperature and pressure readings."}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        {!isRecording ? (
                          <Button onClick={startRecording}>Start Recording</Button>
                        ) : (
                          <Button variant="destructive" onClick={stopRecording}>
                            Stop Recording
                          </Button>
                        )}
                        <Button variant="outline" onClick={exportToCSV} disabled={sensorLogs.length === 0}>
                          <Download className="mr-2 h-4 w-4" />
                          Export CSV
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {sensorLogs.length === 0 ? (
                      <Alert>
                        <AlertDescription>
                          {isRecording
                            ? "Waiting for sensor data..."
                            : "No sensor data available. Click 'Start Recording' to begin collecting data."}
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <ScrollArea className="h-[400px] w-full rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Time</TableHead>
                              <TableHead>Temperature (°C)</TableHead>
                              <TableHead>Pressure (bar)</TableHead>
                              <TableHead>Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {sensorLogs.map((log, index) => (
                              <TableRow key={index}>
                                <TableCell>{log.formattedTime}</TableCell>
                                <TableCell>{log.temperature.toFixed(2)}</TableCell>
                                <TableCell>{log.pressure.toFixed(2)}</TableCell>
                                <TableCell>
                                  <Badge
                                    variant="outline"
                                    className={
                                      log.temperature > 26
                                        ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                                        : log.temperature < 24.5
                                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                                          : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                    }
                                  >
                                    {log.temperature > 26
                                      ? "High Temp"
                                      : log.temperature < 24.5
                                        ? "Low Temp"
                                        : "Normal"}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </ScrollArea>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="text-sm text-muted-foreground">
                      {sensorLogs.length > 0 && (
                        <>
                          Data points: {sensorLogs.length} | Recording {isRecording ? "active" : "stopped"}
                        </>
                      )}
                    </div>
                    {sensorLogs.length > 0 && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          toast({
                            title: "Data Saved",
                            description: "Sensor data has been saved to Documentation.",
                          })

                          // Save to localStorage for documentation page
                          const savedExports = JSON.parse(localStorage.getItem("sensorDataExports") || "[]")
                          const date = new Date().toISOString().split("T")[0]

                          // Create CSV content
                          const headers = ["Timestamp", "Time", "Temperature (°C)", "Pressure (bar)"]
                          const rows = sensorLogs.map((log) => [
                            log.timestamp,
                            log.formattedTime,
                            log.temperature.toString(),
                            log.pressure.toString(),
                          ])

                          const csvContent = [
                            headers.join(","),
                            ...rows.map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")),
                          ].join("\n")

                          const newExport = {
                            id: Date.now(),
                            filename: `sensor_data_${date}_${new Date().getHours()}-${new Date().getMinutes()}.csv`,
                            date: new Date().toISOString(),
                            recordingStartTime: recordingStartTime?.toISOString() || new Date().toISOString(),
                            recordingEndTime: new Date().toISOString(),
                            dataPoints: sensorLogs.length,
                            csvData: csvContent,
                          }

                          localStorage.setItem("sensorDataExports", JSON.stringify([newExport, ...savedExports]))
                        }}
                      >
                        <Save className="mr-2 h-4 w-4" />
                        Save to Documentation
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </PermissionGate>
    </ProtectedRoute>
  )
}
