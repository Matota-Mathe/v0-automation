"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { type PumpType, type ReactorType, defaultPumpTypes, defaultReactorTypes } from "@/types/equipment"

interface EquipmentContextType {
  pumpTypes: PumpType[]
  reactorTypes: ReactorType[]
  addPumpType: (pumpType: Omit<PumpType, "id">) => void
  updatePumpType: (id: string, pumpType: Partial<PumpType>) => void
  deletePumpType: (id: string) => void
  addReactorType: (reactorType: Omit<ReactorType, "id">) => void
  updateReactorType: (id: string, reactorType: Partial<ReactorType>) => void
  deleteReactorType: (id: string) => void
}

const EquipmentContext = createContext<EquipmentContextType | undefined>(undefined)

export function EquipmentProvider({ children }: { children: React.ReactNode }) {
  const [pumpTypes, setPumpTypes] = useState<PumpType[]>([])
  const [reactorTypes, setReactorTypes] = useState<ReactorType[]>([])

  // Load initial data
  useEffect(() => {
    const storedPumpTypes = localStorage.getItem("pumpTypes")
    const storedReactorTypes = localStorage.getItem("reactorTypes")

    setPumpTypes(storedPumpTypes ? JSON.parse(storedPumpTypes) : defaultPumpTypes)
    setReactorTypes(storedReactorTypes ? JSON.parse(storedReactorTypes) : defaultReactorTypes)
  }, [])

  // Save to localStorage when data changes
  useEffect(() => {
    if (pumpTypes.length > 0) {
      localStorage.setItem("pumpTypes", JSON.stringify(pumpTypes))
    }
    if (reactorTypes.length > 0) {
      localStorage.setItem("reactorTypes", JSON.stringify(reactorTypes))
    }
  }, [pumpTypes, reactorTypes])

  // Pump type functions
  const addPumpType = (pumpType: Omit<PumpType, "id">) => {
    const newPumpType = {
      ...pumpType,
      id: `pump-${Date.now()}`,
    }
    setPumpTypes((prev) => [...prev, newPumpType])
  }

  const updatePumpType = (id: string, pumpType: Partial<PumpType>) => {
    setPumpTypes((prev) => prev.map((item) => (item.id === id ? { ...item, ...pumpType } : item)))
  }

  const deletePumpType = (id: string) => {
    setPumpTypes((prev) => prev.filter((item) => item.id !== id))
  }

  // Reactor type functions
  const addReactorType = (reactorType: Omit<ReactorType, "id">) => {
    const newReactorType = {
      ...reactorType,
      id: `reactor-${Date.now()}`,
    }
    setReactorTypes((prev) => [...prev, newReactorType])
  }

  const updateReactorType = (id: string, reactorType: Partial<ReactorType>) => {
    setReactorTypes((prev) => prev.map((item) => (item.id === id ? { ...item, ...reactorType } : item)))
  }

  const deleteReactorType = (id: string) => {
    setReactorTypes((prev) => prev.filter((item) => item.id !== id))
  }

  return (
    <EquipmentContext.Provider
      value={{
        pumpTypes,
        reactorTypes,
        addPumpType,
        updatePumpType,
        deletePumpType,
        addReactorType,
        updateReactorType,
        deleteReactorType,
      }}
    >
      {children}
    </EquipmentContext.Provider>
  )
}

export function useEquipment() {
  const context = useContext(EquipmentContext)
  if (context === undefined) {
    throw new Error("useEquipment must be used within an EquipmentProvider")
  }
  return context
}
