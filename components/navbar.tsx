"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import {
  Beaker,
  User,
  LogOut,
  Users,
  BarChart,
  FileText,
  Settings,
  FlaskRoundIcon as Flask,
  FileSearch,
  ChevronDown,
  Calculator,
  Book,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { PermissionGate } from "@/components/permission-gate"

export function Navbar() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const handleProfileClick = () => {
    router.push("/profile")
  }

  // Get role color
  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
      case "researcher":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
      case "technician":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Beaker className="h-6 w-6" />
            <span className="text-xl font-bold">Automated Flow Chemistry Lab</span>
          </Link>

          {user && (
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
                Dashboard
              </Link>

              <Link href="/chemicals" className="text-sm font-medium transition-colors hover:text-primary">
                Chemicals
              </Link>

              <Link href="/lab-notebook" className="text-sm font-medium transition-colors hover:text-primary">
                Lab Notebook
              </Link>

              <PermissionGate permission="view_analytics">
                <Link href="/analytics" className="text-sm font-medium transition-colors hover:text-primary">
                  Analytics
                </Link>
              </PermissionGate>

              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary">
                  Tools <ChevronDown className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <PermissionGate permission="analyze_pdfs">
                    <DropdownMenuItem onClick={() => router.push("/tools/pdf-analyzer")}>
                      <FileSearch className="mr-2 h-4 w-4" />
                      <span>PDF Analyzer</span>
                    </DropdownMenuItem>
                  </PermissionGate>
                  <DropdownMenuItem onClick={() => router.push("/tools/calculators")}>
                    <Calculator className="mr-2 h-4 w-4" />
                    <span>Calculators</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/tools")}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>All Tools</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <PermissionGate permission="manage_equipment">
                <Link href="/equipment" className="text-sm font-medium transition-colors hover:text-primary">
                  Equipment
                </Link>
              </PermissionGate>

              <PermissionGate permission="manage_users">
                <Link href="/admin/users" className="text-sm font-medium transition-colors hover:text-primary">
                  User Management
                </Link>
              </PermissionGate>

              <Link href="/documentation" className="text-sm font-medium transition-colors hover:text-primary">
                Documentation
              </Link>
            </nav>
          )}
        </div>

        {user ? (
          <div className="flex items-center gap-4">
            {user.role && (
              <Badge variant="outline" className={getRoleBadgeColor(user.role)}>
                {user.role}
              </Badge>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar || ""} alt={user.name} />
                    <AvatarFallback>
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleProfileClick}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>

                <PermissionGate permission="manage_users">
                  <DropdownMenuItem onClick={() => router.push("/admin/users")}>
                    <Users className="mr-2 h-4 w-4" />
                    <span>User Management</span>
                  </DropdownMenuItem>
                </PermissionGate>

                <PermissionGate permission="view_analytics">
                  <DropdownMenuItem onClick={() => router.push("/analytics")}>
                    <BarChart className="mr-2 h-4 w-4" />
                    <span>Analytics</span>
                  </DropdownMenuItem>
                </PermissionGate>

                <DropdownMenuItem onClick={() => router.push("/tools")}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Tools</span>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => router.push("/documentation")}>
                  <FileText className="mr-2 h-4 w-4" />
                  <span>Documentation</span>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => router.push("/chemicals")}>
                  <Flask className="mr-2 h-4 w-4" />
                  <span>Chemicals</span>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => router.push("/lab-notebook")}>
                  <Book className="mr-2 h-4 w-4" />
                  <span>Lab Notebook</span>
                </DropdownMenuItem>

                <PermissionGate permission="manage_equipment">
                  <DropdownMenuItem onClick={() => router.push("/equipment")}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Equipment</span>
                  </DropdownMenuItem>
                </PermissionGate>

                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Log in</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Sign up</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  )
}
