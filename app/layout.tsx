import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { EquipmentProvider } from "@/contexts/equipment-context"
import { ChemicalsProvider } from "@/contexts/chemicals-context"
import { LabNotebookProvider } from "@/contexts/lab-notebook-context"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Automated Flow Chemistry Lab",
  description: "Control and monitor your flow chemistry experiments",
    generator: 'v0.dev'
}

export default function RootLayout({ children }) {
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
