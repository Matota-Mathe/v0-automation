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
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  updateUserRole: (userId: string, role: Role) => Promise<boolean>
  hasPermission: (permission: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = getSupabaseBrowserClient()

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
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
            setUser({
              id: session.user.id,
              name: profile.name,
              email: session.user.email || "",
              role: profile.role as Role,
              avatar: profile.avatar_url,
            })
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
          setUser({
            id: session.user.id,
            name: profile.name,
            email: session.user.email || "",
            role: profile.role as Role,
            avatar: profile.avatar_url,
          })
        }
      } else if (event === "SIGNED_OUT") {
        setUser(null)
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
        setUser({
          id: data.user.id,
          name: profile.name,
          email: data.user.email || "",
          role: profile.role as Role,
          avatar: profile.avatar_url,
        })
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
  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true)

    try {
      // Create auth user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error || !data.user) {
        console.error("Registration error:", error)
        return false
      }

      // Create user profile
      const { error: profileError } = await supabase.from("user_profiles").insert([
        {
          id: data.user.id,
          name,
          role: "guest", // Default role
          avatar_url: null,
        },
      ])

      if (profileError) {
        console.error("Error creating user profile:", profileError)
        return false
      }

      setUser({
        id: data.user.id,
        name,
        email,
        role: "guest",
        avatar: null,
      })

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
