"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ProtectedRoute } from "@/components/protected-route"
import { DashboardLayout } from "@/components/dashboard-layout"
import { PermissionGate } from "@/components/permission-gate"
import { FileSearch, Calculator, Settings, Book, Beaker } from "lucide-react"
import Link from "next/link"

export default function ToolsPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Beaker className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">Tools & Utilities</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <PermissionGate permission="analyze_pdfs">
              <Card className="shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileSearch className="h-5 w-5 text-primary" />
                    PDF Analyzer
                  </CardTitle>
                  <CardDescription>
                    Upload scientific PDFs to get AI-powered summaries, key points, and relevant chemistry concepts.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    This tool uses AI to analyze scientific papers and extract key information to help with research.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href="/tools/pdf-analyzer">Open PDF Analyzer</Link>
                  </Button>
                </CardFooter>
              </Card>
            </PermissionGate>

            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-primary" />
                  Flow Chemistry Calculators
                </CardTitle>
                <CardDescription>Calculate residence time, back pressure regulator settings, and more.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Access calculators for residence time based on reactor volume and flow rate, and BPR settings based on
                  solvent and temperature.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href="/tools/calculators">Open Calculators</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  Instruments Management
                </CardTitle>
                <CardDescription>Configure and manage your flow chemistry equipment.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Add, edit, and manage pump types and reactor types for your flow chemistry setup.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href="/tools/instruments">Manage Instruments</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Book className="h-5 w-5 text-primary" />
                  Lab Notebook
                </CardTitle>
                <CardDescription>Record and track your experiments.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Keep detailed records of your experiments, including conditions, observations, and results.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href="/lab-notebook">Open Lab Notebook</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
