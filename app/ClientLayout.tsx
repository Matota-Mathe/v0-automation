"use client"

import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { EquipmentProvider } from "@/contexts/equipment-context"
import { ChemicalsProvider } from "@/contexts/chemicals-context"
import { LabNotebookProvider } from "@/contexts/lab-notebook-context"
import { Toaster } from "@/components/ui/toaster"
import { useEffect } from "react" // Add this import

const inter = Inter({ subsets: ["latin"] })

export default function ClientLayout({ children }) {
  // Add this useEffect
  useEffect(() => {
    // Initialize storage buckets
    fetch("/api/init-storage").catch((err) => console.error("Failed to initialize storage:", err))
  }, [])

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <EquipmentProvider>
            <ChemicalsProvider>
              <LabNotebookProvider>
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                  {children}
                  <Toaster />
                </ThemeProvider>
              </LabNotebookProvider>
            </ChemicalsProvider>
          </EquipmentProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
