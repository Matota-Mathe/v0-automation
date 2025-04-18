"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { ProtectedRoute } from "@/components/protected-route"
import { ThemeToggle } from "@/components/theme-toggle"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ResidenceTimeCalculator } from "@/components/residence-time-calculator"
import { BprCalculator } from "@/components/bpr-calculator"
import { Calculator } from "lucide-react"

export default function CalculatorsPage() {
  // State for logs
  const [logs, setLogs] = useState([])

  // Function to add log entry
  const addLogEntry = (message, type = "info") => {
    setLogs((prev) => [
      { timestamp: new Date().toISOString(), message, type },
      ...prev.slice(0, 99), // Keep only the last 100 logs
    ])
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto p-4">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Calculator className="h-6 w-6" />
              <h1 className="text-2xl font-bold">Flow Chemistry Calculators</h1>
            </div>
            <ThemeToggle />
          </div>

          <Tabs defaultValue="residence-time" className="space-y-4">
            <TabsList>
              <TabsTrigger value="residence-time">Residence Time Calculator</TabsTrigger>
              <TabsTrigger value="bpr">BPR Calculator</TabsTrigger>
            </TabsList>

            <TabsContent value="residence-time">
              <Card>
                <CardHeader>
                  <CardTitle>Residence Time Calculator</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResidenceTimeCalculator addLogEntry={addLogEntry} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bpr">
              <Card>
                <CardHeader>
                  <CardTitle>Back Pressure Regulator (BPR) Calculator</CardTitle>
                </CardHeader>
                <CardContent>
                  <BprCalculator addLogEntry={addLogEntry} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </ProtectedRoute>
  )
}
