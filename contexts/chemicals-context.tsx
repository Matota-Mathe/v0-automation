"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { type Chemical, defaultChemicals } from "@/types/chemicals"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { useAuth } from "./auth-context"

interface ChemicalsContextType {
  chemicals: Chemical[]
  addChemical: (chemical: Omit<Chemical, "id">) => void
  updateChemical: (id: string, chemical: Partial<Chemical>) => void
  deleteChemical: (id: string) => void
  searchChemicals: (query: string) => Chemical[]
}

const ChemicalsContext = createContext<ChemicalsContextType | undefined>(undefined)

export function ChemicalsProvider({ children }: { children: React.ReactNode }) {
  const [chemicals, setChemicals] = useState<Chemical[]>([])
  const supabase = getSupabaseBrowserClient()
  const { user } = useAuth()

  // Update the useEffect to check for user authentication and add better error handling

  // Load chemicals from Supabase
  useEffect(() => {
    const fetchChemicals = async () => {
      // Don't fetch if user is not authenticated
      if (!user) {
        setChemicals(defaultChemicals)
        return
      }

      try {
        // Check if supabase client is available
        if (!supabase) {
          console.error("Supabase client not available")
          setChemicals(defaultChemicals)
          return
        }

        const { data, error } = await supabase.from("chemicals").select("*").order("created_at", { ascending: false })

        if (error) {
          console.error("Error fetching chemicals:", error)
          // Fall back to default data
          setChemicals(defaultChemicals)
        } else {
          // Map Supabase data to our app's format
          const mappedChemicals: Chemical[] = data.map((chem) => ({
            id: chem.id,
            name: chem.name,
            casNumber: chem.cas_number || "",
            bottleSize: chem.bottle_size,
            remaining: chem.remaining,
            sdsLink: chem.sds_link || "",
            notes: chem.notes || "",
          }))

          setChemicals(mappedChemicals.length > 0 ? mappedChemicals : defaultChemicals)
        }
      } catch (error) {
        console.error("Error fetching chemicals:", error)
        // Fall back to default data
        setChemicals(defaultChemicals)
      }
    }

    fetchChemicals()
  }, [supabase, user]) // Add user as a dependency

  const addChemical = async (chemical: Omit<Chemical, "id">) => {
    if (!user) return

    try {
      // Insert into Supabase
      const { data, error } = await supabase
        .from("chemicals")
        .insert([
          {
            name: chemical.name,
            cas_number: chemical.casNumber,
            bottle_size: chemical.bottleSize,
            remaining: chemical.remaining,
            sds_link: chemical.sdsLink,
            notes: chemical.notes,
            user_id: user.id,
          },
        ])
        .select()

      if (error) {
        console.error("Error adding chemical:", error)
        return
      }

      if (data && data[0]) {
        const newChemical: Chemical = {
          id: data[0].id,
          name: data[0].name,
          casNumber: data[0].cas_number || "",
          bottleSize: data[0].bottle_size,
          remaining: data[0].remaining,
          sdsLink: data[0].sds_link || "",
          notes: data[0].notes || "",
        }

        setChemicals((prev) => [newChemical, ...prev])
      }
    } catch (error) {
      console.error("Error adding chemical:", error)
    }
  }

  const updateChemical = async (id: string, chemical: Partial<Chemical>) => {
    if (!user) return

    try {
      // Map to Supabase format
      const updateData: any = {}
      if (chemical.name !== undefined) updateData.name = chemical.name
      if (chemical.casNumber !== undefined) updateData.cas_number = chemical.casNumber
      if (chemical.bottleSize !== undefined) updateData.bottle_size = chemical.bottleSize
      if (chemical.remaining !== undefined) updateData.remaining = chemical.remaining
      if (chemical.sdsLink !== undefined) updateData.sds_link = chemical.sdsLink
      if (chemical.notes !== undefined) updateData.notes = chemical.notes
      updateData.updated_at = new Date().toISOString()

      // Update in Supabase
      const { error } = await supabase.from("chemicals").update(updateData).eq("id", id)

      if (error) {
        console.error("Error updating chemical:", error)
        return
      }

      // Update local state
      setChemicals((prev) => prev.map((item) => (item.id === id ? { ...item, ...chemical } : item)))
    } catch (error) {
      console.error("Error updating chemical:", error)
    }
  }

  const deleteChemical = async (id: string) => {
    if (!user) return

    try {
      // Delete from Supabase
      const { error } = await supabase.from("chemicals").delete().eq("id", id)

      if (error) {
        console.error("Error deleting chemical:", error)
        return
      }

      // Update local state
      setChemicals((prev) => prev.filter((item) => item.id !== id))
    } catch (error) {
      console.error("Error deleting chemical:", error)
    }
  }

  const searchChemicals = (query: string) => {
    if (!query) return chemicals

    const lowerQuery = query.toLowerCase()
    return chemicals.filter(
      (chemical) =>
        chemical.name.toLowerCase().includes(lowerQuery) || chemical.casNumber.toLowerCase().includes(lowerQuery),
    )
  }

  return (
    <ChemicalsContext.Provider
      value={{
        chemicals,
        addChemical,
        updateChemical,
        deleteChemical,
        searchChemicals,
      }}
    >
      {children}
    </ChemicalsContext.Provider>
  )
}

export function useChemicals() {
  const context = useContext(ChemicalsContext)
  if (context === undefined) {
    throw new Error("useChemicals must be used within a ChemicalsProvider")
  }
  return context
}
