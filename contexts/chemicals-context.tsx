"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { type Chemical, defaultChemicals } from "@/types/chemicals"

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

  // Load initial data
  useEffect(() => {
    const storedChemicals = localStorage.getItem("chemicals")
    setChemicals(storedChemicals ? JSON.parse(storedChemicals) : defaultChemicals)
  }, [])

  // Save to localStorage when data changes
  useEffect(() => {
    if (chemicals.length > 0) {
      localStorage.setItem("chemicals", JSON.stringify(chemicals))
    }
  }, [chemicals])

  const addChemical = (chemical: Omit<Chemical, "id">) => {
    const newChemical = {
      ...chemical,
      id: `chem-${Date.now()}`,
    }
    setChemicals((prev) => [...prev, newChemical])
  }

  const updateChemical = (id: string, chemical: Partial<Chemical>) => {
    setChemicals((prev) => prev.map((item) => (item.id === id ? { ...item, ...chemical } : item)))
  }

  const deleteChemical = (id: string) => {
    setChemicals((prev) => prev.filter((item) => item.id !== id))
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
