"use client"

import type React from "react"
import type { Role } from "@/utils/permissions"

import { createContext, useContext, useEffect, useState } from "react"
import { hasPermission } from "@/utils/permissions"

type User = {
  id: string
  name: string
  email: string
  role: Role
  avatar?: string
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  updateUserRole: (userId: string, role: Role) => Promise<boolean>
  hasPermission: (permission: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Failed to parse stored user:", error)
        localStorage.removeItem("user")
      }
    }
    setIsLoading(false)
  }, [])

  // Mock login function - in a real app, this would call an API
  const login = async (email: string, password: string) => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Demo users for testing
    const demoUsers = [
      {
        id: "1",
        name: "Admin User",
        email: "admin@example.com",
        password: "password123",
        role: "admin" as Role,
        avatar: "/admin-avatar.jpg",
      },
      {
        id: "2",
        name: "Researcher",
        email: "researcher@example.com",
        password: "password123",
        role: "researcher" as Role,
        avatar: "/researcher-avatar.jpg",
      },
      {
        id: "3",
        name: "Technician",
        email: "technician@example.com",
        password: "password123",
        role: "technician" as Role,
        avatar: "/technician-avatar.jpg",
      },
      {
        id: "4",
        name: "Guest User",
        email: "guest@example.com",
        password: "password123",
        role: "guest" as Role,
        avatar: "/guest-avatar.jpg",
      },
    ]

    const foundUser = demoUsers.find((u) => u.email === email && u.password === password)

    if (foundUser) {
      // Remove password before storing
      const { password, ...userWithoutPassword } = foundUser
      setUser(userWithoutPassword)
      localStorage.setItem("user", JSON.stringify(userWithoutPassword))
      setIsLoading(false)
      return true
    }

    setIsLoading(false)
    return false
  }

  // Mock register function
  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Create new user with guest role by default
    const newUser = {
      id: Math.random().toString(36).substring(2, 9),
      name,
      email,
      role: "guest" as Role,
    }

    setUser(newUser)
    localStorage.setItem("user", JSON.stringify(newUser))
    setIsLoading(false)
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  // Function to update a user's role (admin only)
  const updateUserRole = async (userId: string, role: Role) => {
    // In a real app, this would call an API
    if (user?.role !== "admin") {
      return false
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    // If updating the current user
    if (userId === user.id) {
      const updatedUser = { ...user, role }
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
    }

    return true
  }

  // Check if current user has a specific permission
  const checkPermission = (permission: string) => {
    if (!user) return false
    return hasPermission(user.role, permission as any)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        updateUserRole,
        hasPermission: checkPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
