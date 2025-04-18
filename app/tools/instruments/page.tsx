"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PumpTypeManager } from "@/components/equipment/pump-type-manager"
import { ReactorTypeManager } from "@/components/equipment/reactor-type-manager"
import { ProtectedRoute } from "@/components/protected-route"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Settings } from "lucide-react"

export default function InstrumentsPage() {
  const [activeTab, setActiveTab] = useState("pumps")

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Settings className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">Instruments Management</h1>
          </div>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Equipment Configuration</CardTitle>
              <CardDescription>Manage your flow chemistry equipment including pumps and reactors</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList>
                  <TabsTrigger value="pumps">Pump Types</TabsTrigger>
                  <TabsTrigger value="reactors">Reactor Types</TabsTrigger>
                </TabsList>

                <TabsContent value="pumps">
                  <PumpTypeManager />
                </TabsContent>

                <TabsContent value="reactors">
                  <ReactorTypeManager />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
