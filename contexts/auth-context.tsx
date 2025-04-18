"use client"

import type React from "react"
import type { Role } from "@/utils/permissions"

import { createContext, useContext, useEffect, useState } from "react"
import { hasPermission } from "@/utils/permissions"
import { getSupabaseBrowserClient } from "@/lib/supabase"

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
  register: (name: string, email: string, password: string, role?: Role) => Promise<boolean>
  logout: () => void
  updateUserRole: (userId: string, role: Role) => Promise<boolean>
  hasPermission: (permission: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Demo accounts for testing
const demoAccounts = [
  { email: "admin@example.com", password: "password123", role: "admin", name: "Admin User" },
  { email: "researcher@example.com", password: "password123", role: "researcher", name: "Researcher" },
  { email: "demo1@nmu.edu", password: "demo1pass", role: "researcher", name: "Alex Johnson" },
  { email: "demo2@nmu.edu", password: "demo2pass", role: "researcher", name: "Taylor Smith" },
  { email: "demo3@nmu.edu", password: "demo3pass", role: "technician", name: "Jordan Lee" },
  { email: "demo4@nmu.edu", password: "demo4pass", role: "technician", name: "Casey Brown" },
  { email: "demo5@nmu.edu", password: "demo5pass", role: "guest", name: "Morgan White" },
  { email: "demo6@nmu.edu", password: "demo6pass", role: "researcher", name: "Riley Green" },
  { email: "demo7@nmu.edu", password: "demo7pass", role: "researcher", name: "Quinn Davis" },
  { email: "demo8@nmu.edu", password: "demo8pass", role: "technician", name: "Sam Wilson" },
  { email: "demo9@nmu.edu", password: "demo9pass", role: "guest", name: "Jamie Miller" },
  { email: "demo10@nmu.edu", password: "demo10pass", role: "researcher", name: "Drew Parker" },
]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = getSupabaseBrowserClient()

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        // First check localStorage for stored user
        const storedUser = localStorage.getItem("flowChemUser")
        if (storedUser) {
          setUser(JSON.parse(storedUser))
          setIsLoading(false)
          return
        }

        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          console.error("Error getting session:", error)
          setIsLoading(false)
          return
        }

        if (session) {
          // Get user profile from the database
          const { data: profile, error: profileError } = await supabase
            .from("user_profiles")
            .select("*")
            .eq("id", session.user.id)
            .single()

          if (profileError) {
            console.error("Error fetching user profile:", profileError)
            setIsLoading(false)
            return
          }

          if (profile) {
            const userData = {
              id: session.user.id,
              name: profile.name,
              email: session.user.email || "",
              role: profile.role as Role,
              avatar: profile.avatar_url,
            }

            setUser(userData)
            localStorage.setItem("flowChemUser", JSON.stringify(userData))
          }
        }
      } catch (error) {
        console.error("Session check error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkSession()

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        // Get user profile from the database
        const { data: profile } = await supabase.from("user_profiles").select("*").eq("id", session.user.id).single()

        if (profile) {
          const userData = {
            id: session.user.id,
            name: profile.name,
            email: session.user.email || "",
            role: profile.role as Role,
            avatar: profile.avatar_url,
          }

          setUser(userData)
          localStorage.setItem("flowChemUser", JSON.stringify(userData))
        }
      } else if (event === "SIGNED_OUT") {
        setUser(null)
        localStorage.removeItem("flowChemUser")
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true)

    try {
      // Check if this is one of our demo accounts
      const demoAccount = demoAccounts.find((account) => account.email === email && account.password === password)

      if (demoAccount) {
        // Mock successful login with demo account
        const mockUser = {
          id: `demo-${Date.now()}`,
          name: demoAccount.name,
          email: demoAccount.email,
          role: demoAccount.role as Role,
          avatar: null,
        }

        setUser(mockUser)

        // Store in localStorage for persistence
        localStorage.setItem("flowChemUser", JSON.stringify(mockUser))

        return true
      }

      // Try actual Supabase authentication if not using demo credentials
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error("Login error:", error)
        return false
      }

      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", data.user.id)
        .single()

      if (profileError) {
        console.error("Error fetching user profile:", profileError)
        return false
      }

      if (profile) {
        const userData = {
          id: data.user.id,
          name: profile.name,
          email: data.user.email || "",
          role: profile.role as Role,
          avatar: profile.avatar_url,
        }

        setUser(userData)

        // Store in localStorage for persistence
        localStorage.setItem("flowChemUser", JSON.stringify(userData))

        return true
      }

      return false
    } catch (error) {
      console.error("Login error:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Register function
  const register = async (name: string, email: string, password: string, role: Role = "guest") => {
    setIsLoading(true)

    try {
      // For demo purposes, store in localStorage
      const mockUser = {
        id: `user-${Date.now()}`,
        name,
        email,
        role,
        avatar: null,
      }

      // Store in localStorage
      const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
      registeredUsers.push({
        email,
        password,
        name,
        role,
      })
      localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers))

      // In a real app, we would create the user in Supabase
      // const { data, error } = await supabase.auth.signUp({
      //   email,
      //   password,
      // })
      //
      // if (error || !data.user) {
      //   console.error("Registration error:", error)
      //   return false
      // }
      //
      // // Create user profile
      // const { error: profileError } = await supabase.from("user_profiles").insert([
      //   {
      //     id: data.user.id,
      //     name,
      //     role,
      //     avatar_url: null,
      //   },
      // ])
      //
      // if (profileError) {
      //   console.error("Error creating user profile:", profileError)
      //   return false
      // }

      return true
    } catch (error) {
      console.error("Registration error:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Logout function
  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    localStorage.removeItem("flowChemUser")
  }

  // Function to update a user's role (admin only)
  const updateUserRole = async (userId: string, role: Role) => {
    if (user?.role !== "admin") {
      return false
    }

    try {
      const { error } = await supabase.from("user_profiles").update({ role }).eq("id", userId)

      if (error) {
        console.error("Error updating user role:", error)
        return false
      }

      // If updating the current user
      if (userId === user.id) {
        setUser((prev) => (prev ? { ...prev, role } : null))
      }

      return true
    } catch (error) {
      console.error("Error updating user role:", error)
      return false
    }
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
