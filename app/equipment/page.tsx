"use client"
import { Navbar } from "@/components/navbar"
import { ProtectedRoute } from "@/components/protected-route"
import { ThemeToggle } from "@/components/theme-toggle"
import { PermissionGate } from "@/components/permission-gate"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { PumpTypeManager } from "@/components/equipment/pump-type-manager"
import { ReactorTypeManager } from "@/components/equipment/reactor-type-manager"
import { Settings } from "lucide-react"

export default function EquipmentPage() {
  const router = useRouter()

  return (
    <ProtectedRoute>
      <PermissionGate
        permission="manage_equipment"
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <Card className="w-[400px]">
              <CardHeader>
                <CardTitle>Access Denied</CardTitle>
                <CardDescription>You don't have permission to access equipment management.</CardDescription>
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
                <Settings className="h-6 w-6" />
                <h1 className="text-2xl font-bold">Equipment Management</h1>
              </div>
              <ThemeToggle />
            </div>

            <Tabs defaultValue="pumps" className="space-y-4">
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
          </main>
        </div>
      </PermissionGate>
    </ProtectedRoute>
  )
}
