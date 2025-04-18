"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { ProtectedRoute } from "@/components/protected-route"
import { ThemeToggle } from "@/components/theme-toggle"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info, BookOpen, FileSearch, Download, FileDown, Database, Trash2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PermissionGate } from "@/components/permission-gate"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"

export default function DocumentationPage() {
  const { toast } = useToast()
  const [sensorDataExports, setSensorDataExports] = useState([])
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [exportToDelete, setExportToDelete] = useState(null)

  useEffect(() => {
    // Load saved exports from localStorage
    const savedExports = JSON.parse(localStorage.getItem("sensorDataExports") || "[]")
    setSensorDataExports(savedExports)
  }, [])

  const downloadCSV = (exportData) => {
    const blob = new Blob([exportData.csvData], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", exportData.filename)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Download Started",
      description: `Downloading ${exportData.filename}`,
    })
  }

  const handleDeleteExport = (exportData) => {
    setExportToDelete(exportData)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (!exportToDelete) return

    const updatedExports = sensorDataExports.filter((exp) => exp.id !== exportToDelete.id)
    localStorage.setItem("sensorDataExports", JSON.stringify(updatedExports))
    setSensorDataExports(updatedExports)

    toast({
      title: "Export Deleted",
      description: `${exportToDelete.filename} has been deleted.`,
    })

    setIsDeleteDialogOpen(false)
    setExportToDelete(null)
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto p-4">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <BookOpen className="h-6 w-6" />
              <h1 className="text-2xl font-bold">Documentation</h1>
            </div>
            <ThemeToggle />
          </div>

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid grid-cols-6 md:w-[900px]">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="user-guide">User Guide</TabsTrigger>
              <TabsTrigger value="technical">Technical</TabsTrigger>
              <TabsTrigger value="tools">Tools</TabsTrigger>
              <TabsTrigger value="data-exports">Data Exports</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>System Overview</CardTitle>
                  <CardDescription>Introduction to the Automated Flow Chemistry Lab</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    The Automated Flow Chemistry Lab is a comprehensive system designed to control and monitor flow
                    chemistry experiments. The system provides tools for managing pumps, monitoring temperature and
                    pressure, creating experiment recipes, and analyzing results.
                  </p>

                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>Note</AlertTitle>
                    <AlertDescription>
                      Different user roles have different permissions within the system. Please refer to the User Guide
                      for more information.
                    </AlertDescription>
                  </Alert>

                  <h3 className="text-lg font-medium mt-4">Key Features</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Control of up to three precision pumps</li>
                    <li>Real-time temperature and pressure monitoring</li>
                    <li>Experiment recipe creation and management</li>
                    <li>File upload and management</li>
                    <li>Residence time and back pressure regulator calculators</li>
                    <li>Real-time system logs</li>
                    <li>Analytics dashboard (for researchers and admins)</li>
                    <li>PDF AI analyzer for scientific documents</li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="user-guide" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>User Guide</CardTitle>
                  <CardDescription>How to use the Automated Flow Chemistry Lab</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <h3 className="text-lg font-medium">User Roles</h3>
                  <p>The system has four user roles with different permissions:</p>

                  <div className="space-y-3 mt-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium">Admin</h4>
                      <p className="text-sm text-muted-foreground">
                        Full access to all system features and user management
                      </p>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium">Researcher</h4>
                      <p className="text-sm text-muted-foreground">
                        Can create and run experiments, analyze data, and manage recipes
                      </p>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium">Technician</h4>
                      <p className="text-sm text-muted-foreground">Can operate equipment and run predefined recipes</p>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium">Guest</h4>
                      <p className="text-sm text-muted-foreground">View-only access to dashboard and logs</p>
                    </div>
                  </div>

                  <h3 className="text-lg font-medium mt-6">Getting Started</h3>
                  <ol className="list-decimal pl-6 space-y-2">
                    <li>Log in with your credentials</li>
                    <li>Navigate to the main dashboard</li>
                    <li>Set up your experiment parameters</li>
                    <li>Monitor the system in real-time</li>
                    <li>Save and analyze your results</li>
                  </ol>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="technical" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Technical Documentation</CardTitle>
                  <CardDescription>Technical details and specifications</CardDescription>
                </CardHeader>
                <CardContent>
                  <h3 className="text-lg font-medium">System Architecture</h3>
                  <p className="mb-4">
                    The Automated Flow Chemistry Lab consists of a web-based control interface connected to physical
                    hardware through a secure API. The system uses a modern React-based frontend with a Node.js backend.
                  </p>

                  <h3 className="text-lg font-medium mt-6">Hardware Specifications</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse border">
                      <thead>
                        <tr className="bg-muted">
                          <th className="border p-2 text-left">Component</th>
                          <th className="border p-2 text-left">Specification</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border p-2">Pumps</td>
                          <td className="border p-2">High-precision syringe pumps, 0.01-10 mL/min flow rate</td>
                        </tr>
                        <tr>
                          <td className="border p-2">Temperature Sensor</td>
                          <td className="border p-2">PT100 RTD, -50 to 200°C range, ±0.1°C accuracy</td>
                        </tr>
                        <tr>
                          <td className="border p-2">Pressure Sensor</td>
                          <td className="border p-2">Strain gauge, 0-20 bar range, ±0.1 bar accuracy</td>
                        </tr>
                        <tr>
                          <td className="border p-2">Control System</td>
                          <td className="border p-2">Embedded Linux controller with real-time capabilities</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tools" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Available Tools</CardTitle>
                  <CardDescription>Special tools and utilities available in the system</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">PDF AI Analyzer</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          Upload scientific PDFs to get AI-powered summaries, key points, and relevant chemistry
                          concepts.
                        </p>
                        <PermissionGate permission="analyze_pdfs">
                          <Button asChild>
                            <Link href="/tools/pdf-analyzer">
                              <FileSearch className="h-4 w-4 mr-2" />
                              Open PDF Analyzer
                            </Link>
                          </Button>
                        </PermissionGate>
                        <PermissionGate
                          permission="analyze_pdfs"
                          fallback={
                            <Alert className="mt-2">
                              <Info className="h-4 w-4 mr-2" />
                              <AlertDescription>
                                You need researcher or admin permissions to access this tool.
                              </AlertDescription>
                            </Alert>
                          }
                        />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Flow Chemistry Calculators</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          Access calculators for residence time and back pressure regulator settings.
                        </p>
                        <Button asChild>
                          <Link href="/tools/calculators">
                            <Info className="h-4 w-4 mr-2" />
                            Open Calculators
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="data-exports" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Sensor Data Exports
                  </CardTitle>
                  <CardDescription>Temperature and pressure data exported from the Analytics Dashboard</CardDescription>
                </CardHeader>
                <CardContent>
                  {sensorDataExports.length === 0 ? (
                    <Alert>
                      <Info className="h-4 w-4 mr-2" />
                      <AlertDescription>
                        No sensor data exports available. Go to the Analytics Dashboard, select the "Sensor Logs" tab,
                        record some data, and export it to see it here.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Filename</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Recording Period</TableHead>
                            <TableHead>Data Points</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {sensorDataExports.map((exportData) => (
                            <TableRow key={exportData.id}>
                              <TableCell className="font-medium">
                                <div className="flex items-center gap-2">
                                  <FileDown className="h-4 w-4 text-muted-foreground" />
                                  {exportData.filename}
                                </div>
                              </TableCell>
                              <TableCell>{format(new Date(exportData.date), "MMM d, yyyy h:mm a")}</TableCell>
                              <TableCell>
                                <Badge variant="outline">
                                  {format(new Date(exportData.recordingStartTime), "h:mm a")} -
                                  {format(new Date(exportData.recordingEndTime), "h:mm a")}
                                </Badge>
                              </TableCell>
                              <TableCell>{exportData.dataPoints}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button variant="outline" size="sm" onClick={() => downloadCSV(exportData)}>
                                    <Download className="h-4 w-4" />
                                  </Button>
                                  <Button variant="outline" size="sm" onClick={() => handleDeleteExport(exportData)}>
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="faq" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                  <CardDescription>Common questions and answers</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium">How do I request a role change?</h3>
                      <p className="text-muted-foreground">
                        Contact your system administrator to request a change in your user role.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium">What file formats are supported for upload?</h3>
                      <p className="text-muted-foreground">
                        The system supports CSV, Excel, PDF, and image files (PNG, JPG).
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium">How accurate are the calculators?</h3>
                      <p className="text-muted-foreground">
                        The calculators provide estimates based on theoretical models. For critical applications, always
                        verify with experimental data.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium">Can I export my experiment data?</h3>
                      <p className="text-muted-foreground">
                        Yes, experiment data can be exported in CSV or Excel format from the Analytics page.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium">How does the PDF AI Analyzer work?</h3>
                      <p className="text-muted-foreground">
                        The PDF AI Analyzer uses advanced AI models to extract text from PDFs and generate summaries,
                        key points, and identify relevant chemistry concepts. It's designed to help researchers quickly
                        understand scientific papers and reports.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium">How do I access the sensor data exports?</h3>
                      <p className="text-muted-foreground">
                        Sensor data can be recorded and exported from the Analytics Dashboard under the "Sensor Logs"
                        tab. All exported data is automatically saved to the Documentation page under the "Data Exports"
                        tab.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {exportToDelete?.filename}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ProtectedRoute>
  )
}
