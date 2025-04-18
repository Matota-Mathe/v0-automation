"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PumpControl } from "@/components/pump-control"
import { ReactorMonitoring } from "@/components/reactor-monitoring"
import { ReactionConditionsCard } from "@/components/reaction-conditions-card"
import { MLPredictionCard } from "@/components/ml-prediction-card"
import { ExperimentRecipes } from "@/components/experiment-recipes"
import { UserFiles } from "@/components/user-files"
import { LiveSystemLogs } from "@/components/live-system-logs"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Toaster } from "@/components/ui/toaster"
import { Sliders, Activity, FlaskConical, FileText, Book, Gauge, Loader2 } from "lucide-react"
import { LabNotebookSimple } from "@/components/lab-notebook-simple"

export default function Home() {
  // Initialize authData outside the try-catch block
  const authData = useAuth()
  const { user, loading } = authData
  const router = useRouter()
  const searchParams = useSearchParams()
  const tabParam = searchParams.get("tab")
  const [activeTab, setActiveTab] = useState(tabParam || "control")
  const updateInProgress = useRef(false)

  // Update URL when tab changes
  useEffect(() => {
    if (activeTab !== "control") {
      router.push(`/?tab=${activeTab}`, { scroll: false })
    } else {
      router.push("/", { scroll: false })
    }
  }, [activeTab, router])

  // Initialize system values
  const [systemValues, setSystemValues] = useState({
    temperature: { set: 25.0, actual: 25.2 },
    pressure: { set: 5.0, actual: 5.1 },
  })

  // Initialize pump flow rates
  const [pumpFlowRates, setPumpFlowRates] = useState({
    pump1: { set: 0.5, actual: 0.48 },
    pump2: { set: 0.3, actual: 0.31 },
    pump3: { set: 0.0, actual: 0.0 },
  })

  // Initialize logs
  const [logs, setLogs] = useState([
    { timestamp: new Date().toISOString(), message: "System initialized", type: "info" },
    { timestamp: new Date(Date.now() - 60000).toISOString(), message: "Pumps ready", type: "info" },
    { timestamp: new Date(Date.now() - 120000).toISOString(), message: "Reactor temperature stable", type: "success" },
  ])

  // Function to add log entry
  const addLogEntry = (message, type = "info") => {
    setLogs((prev) => [
      { timestamp: new Date().toISOString(), message, type },
      ...prev.slice(0, 99), // Keep only the last 100 logs
    ])
  }

  // Update system value function
  const updateSystemValue = (parameter, value) => {
    if (updateInProgress.current) return
    updateInProgress.current = true

    setSystemValues((prev) => ({
      ...prev,
      [parameter]: { ...prev[parameter], set: value },
    }))

    // Add log entry
    addLogEntry(`${parameter.charAt(0).toUpperCase() + parameter.slice(1)} set to ${value}`, "info")

    // Simulate actual value changing gradually
    const timer = setTimeout(() => {
      setSystemValues((prev) => {
        const newValue = {
          ...prev,
          [parameter]: {
            ...prev[parameter],
            actual: value + (Math.random() * 0.4 - 0.2), // Add small random variation
          },
        }
        updateInProgress.current = false
        return newValue
      })
    }, 500)

    return () => {
      clearTimeout(timer)
      updateInProgress.current = false
    }
  }

  // Update pump flow rate function with debounce
  const updatePumpFlowRate = (pumpId, value) => {
    if (updateInProgress.current) return
    updateInProgress.current = true

    setPumpFlowRates((prev) => ({
      ...prev,
      [pumpId]: { ...prev[pumpId], set: value },
    }))

    // Add log entry
    addLogEntry(`${pumpId.charAt(0).toUpperCase() + pumpId.slice(1)} flow rate set to ${value} mL/min`, "info")

    // Simulate actual value changing gradually
    const timer = setTimeout(() => {
      setPumpFlowRates((prev) => {
        const actualValue = value > 0 ? value + (Math.random() * 0.1 - 0.05) : 0
        const newRates = {
          ...prev,
          [pumpId]: {
            ...prev[pumpId],
            actual: actualValue,
          },
        }
        updateInProgress.current = false
        return newRates
      })
    }, 500)

    return () => {
      clearTimeout(timer)
      updateInProgress.current = false
    }
  }

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading...</span>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl flex items-center gap-2">
                <Gauge className="h-5 w-5 text-primary" />
                Current Experiment
              </CardTitle>
              <CardDescription>Configure and monitor your active experiment</CardDescription>
            </CardHeader>
            <CardContent>
              <ReactionConditionsCard />
            </CardContent>
          </Card>
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Predictions
              </CardTitle>
              <CardDescription>AI-powered reaction optimization</CardDescription>
            </CardHeader>
            <CardContent>
              <MLPredictionCard />
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="control" className="flex items-center gap-2">
              <Sliders className="h-4 w-4" />
              <span>Control</span>
            </TabsTrigger>
            <TabsTrigger value="monitoring" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <span>Monitoring</span>
            </TabsTrigger>
            <TabsTrigger value="recipes" className="flex items-center gap-2">
              <FlaskConical className="h-4 w-4" />
              <span>Recipes</span>
            </TabsTrigger>
            <TabsTrigger value="notebook" className="flex items-center gap-2">
              <Book className="h-4 w-4" />
              <span>Notebook</span>
            </TabsTrigger>
            <TabsTrigger value="files" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Files</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="control" className="mt-6 space-y-4">
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>Pump Control</CardTitle>
                <CardDescription>Configure and control flow rates for all pumps</CardDescription>
              </CardHeader>
              <CardContent>
                <PumpControl pumpFlowRates={pumpFlowRates} updatePumpFlowRate={updatePumpFlowRate} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="monitoring" className="mt-6 space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>Reactor Monitoring</CardTitle>
                  <CardDescription>Monitor and control reactor conditions</CardDescription>
                </CardHeader>
                <CardContent>
                  <ReactorMonitoring systemValues={systemValues} updateSystemValue={updateSystemValue} />
                </CardContent>
              </Card>

              <Card className="shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>System Status</CardTitle>
                  <CardDescription>Live system logs and status</CardDescription>
                </CardHeader>
                <CardContent>
                  <LiveSystemLogs logs={logs} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="recipes" className="mt-6 space-y-4">
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>Experiment Recipes</CardTitle>
                <CardDescription>Create and manage experiment recipes</CardDescription>
              </CardHeader>
              <CardContent>
                <ExperimentRecipes addLogEntry={addLogEntry} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notebook" className="mt-6 space-y-4">
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>Lab Notebook</CardTitle>
                <CardDescription>Record and track your experiments</CardDescription>
              </CardHeader>
              <CardContent>
                <LabNotebookSimple />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="files" className="mt-6 space-y-4">
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>File Management</CardTitle>
                <CardDescription>Upload and manage experiment files</CardDescription>
              </CardHeader>
              <CardContent>
                <UserFiles addLogEntry={addLogEntry} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <Toaster />
    </DashboardLayout>
  )
}
