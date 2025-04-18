"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/contexts/auth-context"
import {
  Activity,
  BarChart2,
  Beaker,
  Book,
  Calculator,
  ChevronLeft,
  ChevronRight,
  FileText,
  FlaskConical,
  Menu,
  Settings,
  Sliders,
  FileSearch,
} from "lucide-react"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const { user } = useAuth()

  // Close sidebar on mobile by default
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false)
      } else {
        setIsSidebarOpen(true)
      }
    }

    // Set initial state
    handleResize()

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  const navigationItems = [
    {
      title: "Dashboard",
      href: "/",
      icon: Beaker,
      active: pathname === "/",
    },
    {
      title: "Control",
      href: "/?tab=control",
      icon: Sliders,
      active: pathname === "/" && new URLSearchParams(window.location.search).get("tab") === "control",
    },
    {
      title: "Monitoring",
      href: "/?tab=monitoring",
      icon: Activity,
      active: pathname === "/" && new URLSearchParams(window.location.search).get("tab") === "monitoring",
    },
    {
      title: "Recipes",
      href: "/?tab=recipes",
      icon: FlaskConical,
      active: pathname === "/" && new URLSearchParams(window.location.search).get("tab") === "recipes",
    },
    {
      title: "Lab Notebook",
      href: "/lab-notebook",
      icon: Book,
      active: pathname === "/lab-notebook",
    },
    {
      title: "Files",
      href: "/?tab=files",
      icon: FileText,
      active: pathname === "/" && new URLSearchParams(window.location.search).get("tab") === "files",
    },
    {
      title: "Analytics",
      href: "/analytics",
      icon: BarChart2,
      active: pathname === "/analytics",
    },
    {
      title: "Calculators",
      href: "/tools/calculators",
      icon: Calculator,
      active: pathname === "/tools/calculators",
    },
    {
      title: "Instruments",
      href: "/tools/instruments",
      icon: Settings,
      active: pathname === "/tools/instruments",
    },
    {
      title: "Tools",
      href: "/tools",
      icon: FileSearch,
      active: pathname === "/tools" && pathname !== "/tools/calculators" && pathname !== "/tools/instruments",
    },
  ]

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar for desktop */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-20 flex w-64 flex-col border-r bg-background transition-transform lg:translate-x-0 lg:border-r",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b px-4">
          <div className="flex items-center gap-2">
            <Beaker className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold">Flow Chemistry Lab</span>
          </div>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsSidebarOpen(false)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
        <ScrollArea className="flex-1 py-2">
          <nav className="grid gap-1 px-2">
            {navigationItems.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  item.active ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </Link>
            ))}
          </nav>
        </ScrollArea>
        <div className="border-t p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                {user?.name?.charAt(0) || "U"}
              </div>
              <div>
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.role}</p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </aside>

      {/* Mobile menu button and overlay */}
      <div className="lg:hidden">
        <Button
          variant="outline"
          size="icon"
          className="fixed left-4 top-4 z-40"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <Menu className="h-4 w-4" />
        </Button>
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div className="fixed inset-y-0 left-0 z-40 w-64 bg-background p-4 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Beaker className="h-6 w-6 text-primary" />
                  <span className="text-lg font-semibold">Flow Chemistry Lab</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </div>
              <nav className="grid gap-1">
                {navigationItems.map((item) => (
                  <Link
                    key={item.title}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                      item.active ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        )}
      </div>

      {/* Main content */}
      <main className={cn("flex-1 transition-all", isSidebarOpen ? "lg:ml-64" : "")}>
        <div className="flex items-center justify-between border-b p-4">
          <div className="flex items-center gap-2">
            {!isSidebarOpen && (
              <Button variant="ghost" size="icon" className="hidden lg:flex" onClick={() => setIsSidebarOpen(true)}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
            <h1 className="text-xl font-semibold">Automated Flow Chemistry Lab</h1>
          </div>
          <div className="hidden lg:flex items-center gap-4">
            <ThemeToggle />
          </div>
        </div>
        <div className="container py-6 px-4 md:px-6">{children}</div>
      </main>
    </div>
  )
}
