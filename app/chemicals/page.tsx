"use client"

import { Navbar } from "@/components/navbar"
import { ThemeToggle } from "@/components/theme-toggle"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChemicalsProvider } from "@/contexts/chemicals-context"
import { ChemicalsTable } from "@/components/chemicals/chemicals-table"
import { AddChemicalDialog } from "@/components/chemicals/add-chemical-dialog"
import { FlaskRoundIcon as Flask } from "lucide-react"

export default function ChemicalsPage() {
  return (
    <ChemicalsProvider>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto p-4">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Flask className="h-6 w-6" />
              <h1 className="text-2xl font-bold">User Chemicals</h1>
            </div>
            <ThemeToggle />
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Chemical Inventory</CardTitle>
                <CardDescription>Manage and track chemicals available in the lab</CardDescription>
              </div>
              <AddChemicalDialog />
            </CardHeader>
            <CardContent>
              <ChemicalsTable />
            </CardContent>
          </Card>
        </main>
      </div>
    </ChemicalsProvider>
  )
}
