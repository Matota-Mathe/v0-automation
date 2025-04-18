"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { ProtectedRoute } from "@/components/protected-route"
import { Navbar } from "@/components/navbar"
import { ThemeToggle } from "@/components/theme-toggle"
import { PermissionGate } from "@/components/permission-gate"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getAvailableRoles, getRoleDescription } from "@/utils/permissions"
import { UserCog } from "lucide-react"

// Mock users for demonstration
const mockUsers = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    avatar: "/admin-avatar.jpg",
    lastActive: "2023-05-10T14:30:00Z",
  },
  {
    id: "2",
    name: "Researcher",
    email: "researcher@example.com",
    role: "researcher",
    avatar: "/researcher-avatar.jpg",
    lastActive: "2023-05-09T10:15:00Z",
  },
  {
    id: "3",
    name: "Technician",
    email: "technician@example.com",
    role: "technician",
    avatar: "/technician-avatar.jpg",
    lastActive: "2023-05-08T16:45:00Z",
  },
  {
    id: "4",
    name: "Guest User",
    email: "guest@example.com",
    role: "guest",
    avatar: "/guest-avatar.jpg",
    lastActive: "2023-05-07T09:20:00Z",
  },
  {
    id: "5",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "researcher",
    lastActive: "2023-05-06T11:10:00Z",
  },
  {
    id: "6",
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "technician",
    lastActive: "2023-05-05T13:25:00Z",
  },
]

export default function UsersManagementPage() {
  const { user, updateUserRole } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState(mockUsers)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })
  const availableRoles = getAvailableRoles()

  const handleRoleChange = async (userId: string, newRole: string) => {
    setIsLoading(true)
    setMessage({ type: "", text: "" })

    try {
      const success = await updateUserRole(userId, newRole as any)

      if (success) {
        // Update local state
        setUsers(users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)))
        setMessage({
          type: "success",
          text: `User role updated successfully to ${newRole}`,
        })
      } else {
        setMessage({
          type: "error",
          text: "Failed to update user role. You may not have permission.",
        })
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "An error occurred while updating the role.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Format date to relative time
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return "Today"
    } else if (diffDays === 1) {
      return "Yesterday"
    } else {
      return `${diffDays} days ago`
    }
  }

  return (
    <ProtectedRoute>
      <PermissionGate
        permission="manage_users"
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <Card className="w-[400px]">
              <CardHeader>
                <CardTitle>Access Denied</CardTitle>
                <CardDescription>You don't have permission to access this page.</CardDescription>
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
                <UserCog className="h-6 w-6" />
                <h1 className="text-2xl font-bold">User Management</h1>
              </div>
              <ThemeToggle />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>All Users</CardTitle>
                <CardDescription>Manage user roles and permissions</CardDescription>
              </CardHeader>
              <CardContent>
                {message.text && (
                  <Alert variant={message.type === "error" ? "destructive" : "default"} className="mb-4">
                    <AlertDescription>{message.text}</AlertDescription>
                  </Alert>
                )}

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Last Active</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((u) => (
                        <TableRow key={u.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={u.avatar || "/placeholder.svg"} />
                                <AvatarFallback>
                                  {u.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <span>{u.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>{u.email}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                u.role === "admin"
                                  ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                                  : u.role === "researcher"
                                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                                    : u.role === "technician"
                                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                      : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
                              }
                            >
                              {u.role}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatDate(u.lastActive)}</TableCell>
                          <TableCell>
                            <Select
                              defaultValue={u.role}
                              onValueChange={(value) => handleRoleChange(u.id, value)}
                              disabled={isLoading || u.id === user?.id} // Prevent changing own role
                            >
                              <SelectTrigger className="w-[130px]">
                                <SelectValue placeholder="Select role" />
                              </SelectTrigger>
                              <SelectContent>
                                {availableRoles.map((role) => (
                                  <SelectItem key={role} value={role}>
                                    <div className="flex flex-col">
                                      <span>{role}</span>
                                      <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                                        {getRoleDescription(role)}
                                      </span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </PermissionGate>
    </ProtectedRoute>
  )
}
