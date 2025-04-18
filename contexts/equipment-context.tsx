"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { type PumpType, type ReactorType, defaultPumpTypes, defaultReactorTypes } from "@/types/equipment"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { useAuth } from "./auth-context"

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
  const supabase = getSupabaseBrowserClient()
  const { user } = useAuth()

  // Load data from Supabase
  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        // Fetch pump types
        const { data: pumpData, error: pumpError } = await supabase
          .from("pump_types")
          .select("*")
          .order("created_at", { ascending: false })

        if (pumpError) {
          console.error("Error fetching pump types:", pumpError)
          // Fall back to default data
          setPumpTypes(defaultPumpTypes)
        } else {
          // Map Supabase data to our app's format
          const mappedPumpTypes: PumpType[] = pumpData.map((pump) => ({
            id: pump.id,
            name: pump.name,
            manufacturer: pump.manufacturer,
            flowRateMin: pump.flow_rate_min,
            flowRateMax: pump.flow_rate_max,
            description: pump.description || "",
            imageUrl: pump.image_url,
          }))

          setPumpTypes(mappedPumpTypes.length > 0 ? mappedPumpTypes : defaultPumpTypes)
        }

        // Fetch reactor types
        const { data: reactorData, error: reactorError } = await supabase
          .from("reactor_types")
          .select("*")
          .order("created_at", { ascending: false })

        if (reactorError) {
          console.error("Error fetching reactor types:", reactorError)
          // Fall back to default data
          setReactorTypes(defaultReactorTypes)
        } else {
          // Map Supabase data to our app's format
          const mappedReactorTypes: ReactorType[] = reactorData.map((reactor) => ({
            id: reactor.id,
            name: reactor.name,
            type: reactor.type as any,
            volume: reactor.volume,
            material: reactor.material,
            maxTemperature: reactor.max_temperature,
            maxPressure: reactor.max_pressure,
            description: reactor.description || "",
            imageUrl: reactor.image_url,
          }))

          setReactorTypes(mappedReactorTypes.length > 0 ? mappedReactorTypes : defaultReactorTypes)
        }
      } catch (error) {
        console.error("Error fetching equipment data:", error)
        // Fall back to default data
        setPumpTypes(defaultPumpTypes)
        setReactorTypes(defaultReactorTypes)
      }
    }

    fetchEquipment()
  }, [supabase])

  // Pump type functions
  const addPumpType = async (pumpType: Omit<PumpType, "id">) => {
    if (!user) return

    try {
      // Insert into Supabase
      const { data, error } = await supabase
        .from("pump_types")
        .insert([
          {
            name: pumpType.name,
            manufacturer: pumpType.manufacturer,
            flow_rate_min: pumpType.flowRateMin,
            flow_rate_max: pumpType.flowRateMax,
            description: pumpType.description,
            image_url: pumpType.imageUrl,
            user_id: user.id,
          },
        ])
        .select()

      if (error) {
        console.error("Error adding pump type:", error)
        return
      }

      if (data && data[0]) {
        const newPumpType: PumpType = {
          id: data[0].id,
          name: data[0].name,
          manufacturer: data[0].manufacturer,
          flowRateMin: data[0].flow_rate_min,
          flowRateMax: data[0].flow_rate_max,
          description: data[0].description || "",
          imageUrl: data[0].image_url,
        }

        setPumpTypes((prev) => [newPumpType, ...prev])
      }
    } catch (error) {
      console.error("Error adding pump type:", error)
    }
  }

  const updatePumpType = async (id: string, pumpType: Partial<PumpType>) => {
    if (!user) return

    try {
      // Map to Supabase format
      const updateData: any = {}
      if (pumpType.name !== undefined) updateData.name = pumpType.name
      if (pumpType.manufacturer !== undefined) updateData.manufacturer = pumpType.manufacturer
      if (pumpType.flowRateMin !== undefined) updateData.flow_rate_min = pumpType.flowRateMin
      if (pumpType.flowRateMax !== undefined) updateData.flow_rate_max = pumpType.flowRateMax
      if (pumpType.description !== undefined) updateData.description = pumpType.description
      if (pumpType.imageUrl !== undefined) updateData.image_url = pumpType.imageUrl
      updateData.updated_at = new Date().toISOString()

      // Update in Supabase
      const { error } = await supabase.from("pump_types").update(updateData).eq("id", id)

      if (error) {
        console.error("Error updating pump type:", error)
        return
      }

      // Update local state
      setPumpTypes((prev) => prev.map((item) => (item.id === id ? { ...item, ...pumpType } : item)))
    } catch (error) {
      console.error("Error updating pump type:", error)
    }
  }

  const deletePumpType = async (id: string) => {
    if (!user) return

    try {
      // Delete from Supabase
      const { error } = await supabase.from("pump_types").delete().eq("id", id)

      if (error) {
        console.error("Error deleting pump type:", error)
        return
      }

      // Update local state
      setPumpTypes((prev) => prev.filter((item) => item.id !== id))
    } catch (error) {
      console.error("Error deleting pump type:", error)
    }
  }

  // Reactor type functions
  const addReactorType = async (reactorType: Omit<ReactorType, "id">) => {
    if (!user) return

    try {
      // Insert into Supabase
      const { data, error } = await supabase
        .from("reactor_types")
        .insert([
          {
            name: reactorType.name,
            type: reactorType.type,
            volume: reactorType.volume,
            material: reactorType.material,
            max_temperature: reactorType.maxTemperature,
            max_pressure: reactorType.maxPressure,
            description: reactorType.description,
            image_url: reactorType.imageUrl,
            user_id: user.id,
          },
        ])
        .select()

      if (error) {
        console.error("Error adding reactor type:", error)
        return
      }

      if (data && data[0]) {
        const newReactorType: ReactorType = {
          id: data[0].id,
          name: data[0].name,
          type: data[0].type,
          volume: data[0].volume,
          material: data[0].material,
          maxTemperature: data[0].max_temperature,
          maxPressure: data[0].max_pressure,
          description: data[0].description || "",
          imageUrl: data[0].image_url,
        }

        setReactorTypes((prev) => [newReactorType, ...prev])
      }
    } catch (error) {
      console.error("Error adding reactor type:", error)
    }
  }

  const updateReactorType = async (id: string, reactorType: Partial<ReactorType>) => {
    if (!user) return

    try {
      // Map to Supabase format
      const updateData: any = {}
      if (reactorType.name !== undefined) updateData.name = reactorType.name
      if (reactorType.type !== undefined) updateData.type = reactorType.type
      if (reactorType.volume !== undefined) updateData.volume = reactorType.volume
      if (reactorType.material !== undefined) updateData.material = reactorType.material
      if (reactorType.maxTemperature !== undefined) updateData.max_temperature = reactorType.maxTemperature
      if (reactorType.maxPressure !== undefined) updateData.max_pressure = reactorType.maxPressure
      if (reactorType.description !== undefined) updateData.description = reactorType.description
      if (reactorType.imageUrl !== undefined) updateData.image_url = reactorType.imageUrl
      updateData.updated_at = new Date().toISOString()

      // Update in Supabase
      const { error } = await supabase.from("reactor_types").update(updateData).eq("id", id)

      if (error) {
        console.error("Error updating reactor type:", error)
        return
      }

      // Update local state
      setReactorTypes((prev) => prev.map((item) => (item.id === id ? { ...item, ...reactorType } : item)))
    } catch (error) {
      console.error("Error updating reactor type:", error)
    }
  }

  const deleteReactorType = async (id: string) => {
    if (!user) return

    try {
      // Delete from Supabase
      const { error } = await supabase.from("reactor_types").delete().eq("id", id)

      if (error) {
        console.error("Error deleting reactor type:", error)
        return
      }

      // Update local state
      setReactorTypes((prev) => prev.filter((item) => item.id !== id))
    } catch (error) {
      console.error("Error deleting reactor type:", error)
    }
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
