"use client"

import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { EquipmentProvider } from "@/contexts/equipment-context"
import { ChemicalsProvider } from "@/contexts/chemicals-context"
import { LabNotebookProvider } from "@/contexts/lab-notebook-context"
import { Toaster } from "@/components/ui/toaster"
import { usePathname } from "next/navigation"

const inter = Inter({ subsets: ["latin"] })

export default function ClientRootLayout({ children }) {
  // Get the current pathname
  const pathname = usePathname()

  // Check if we're on the login or register page
  const isAuthPage = pathname === "/login" || pathname === "/register"

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          {isAuthPage ? (
            // Only render the ThemeProvider for auth pages
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
              {children}
              <Toaster />
            </ThemeProvider>
          ) : (
            // Render all providers for other pages
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
          )}
        </AuthProvider>
      </body>
    </html>
  )
}
