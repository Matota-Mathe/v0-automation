"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export interface LabEntry {
  id: string
  title: string
  date: string
  experimentType: string
  status: "Planned" | "In Progress" | "Completed" | "Failed"
  reagents: {
    name: string
    concentration: number
    volume: number
    moles: number
    equivalents: number
  }[]
  catalyst?: string
  reactionConditions: {
    temperature: number
    pressure: number
    flowRate: number
    residenceTime: number
  }
  observations: string
  yield?: number
  notes: string
  files?: File[]
  fileUrls?: string[]
  isTemplate?: boolean
  tags?: string[] // Add tags field
}

interface LabNotebookContextType {
  entries: LabEntry[]
  addEntry: (entry: Omit<LabEntry, "id">) => void
  updateEntry: (id: string, entry: Partial<LabEntry>) => void
  deleteEntry: (id: string) => void
  saveAsTemplate: (id: string) => void
  templates: LabEntry[]
  getAllTags: () => string[] // Add getAllTags function
}

const LabNotebookContext = createContext<LabNotebookContextType | undefined>(undefined)

export const useLabNotebook = () => {
  const context = useContext(LabNotebookContext)
  if (!context) {
    throw new Error("useLabNotebook must be used within a LabNotebookProvider")
  }
  return context
}

export const LabNotebookProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [entries, setEntries] = useState<LabEntry[]>([])
  const [templates, setTemplates] = useState<LabEntry[]>([])

  // Load entries from localStorage on mount
  useEffect(() => {
    const storedEntries = localStorage.getItem("labEntries")
    if (storedEntries) {
      setEntries(JSON.parse(storedEntries))
    } else {
      // Add some sample entries if none exist
      setEntries([
        {
          id: "1",
          title: "Suzuki Coupling Optimization",
          date: "2023-05-15",
          experimentType: "Optimization",
          status: "Completed",
          reagents: [
            {
              name: "4-Bromoanisole",
              concentration: 0.5,
              volume: 2,
              moles: 0.001,
              equivalents: 1,
            },
            {
              name: "Phenylboronic acid",
              concentration: 0.6,
              volume: 2,
              moles: 0.0012,
              equivalents: 1.2,
            },
          ],
          catalyst: "Pd(PPh3)4 (5 mol%)",
          reactionConditions: {
            temperature: 80,
            pressure: 5,
            flowRate: 0.5,
            residenceTime: 10,
          },
          observations: "Reaction proceeded smoothly with good conversion",
          yield: 92,
          notes:
            "Observed some precipitation at the reactor outlet which was resolved by increasing the temperature to 85°C.",
          tags: ["suzuki", "coupling", "optimization", "success"],
        },
        {
          id: "2",
          title: "Amide Formation Study",
          date: "2023-05-18",
          experimentType: "Study",
          status: "Completed",
          reagents: [
            {
              name: "Benzoic Acid",
              concentration: 0.5,
              volume: 2,
              moles: 0.001,
              equivalents: 1,
            },
            {
              name: "Aniline",
              concentration: 0.5,
              volume: 2,
              moles: 0.001,
              equivalents: 1,
            },
          ],
          catalyst: "EDC/HOBt",
          reactionConditions: {
            temperature: 25,
            pressure: 2,
            flowRate: 0.2,
            residenceTime: 5,
          },
          observations: "Room temperature reaction was sufficient for complete conversion",
          yield: 88,
          notes: "No clogging observed in the reactor",
          tags: ["amide", "room-temperature", "success"],
        },
      ])
    }

    const storedTemplates = localStorage.getItem("labTemplates")
    if (storedTemplates) {
      setTemplates(JSON.parse(storedTemplates))
    }
  }, [])

  // Save entries to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("labEntries", JSON.stringify(entries))
  }, [entries])

  // Save templates to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("labTemplates", JSON.stringify(templates))
  }, [templates])

  const addEntry = (entry: Omit<LabEntry, "id">) => {
    const newEntry = {
      ...entry,
      id: Date.now().toString(),
    }
    setEntries((prev) => [...prev, newEntry])
  }

  const updateEntry = (id: string, updatedFields: Partial<LabEntry>) => {
    setEntries((prev) => prev.map((entry) => (entry.id === id ? { ...entry, ...updatedFields } : entry)))
  }

  const deleteEntry = (id: string) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id))
  }

  const saveAsTemplate = (id: string) => {
    const entryToTemplate = entries.find((entry) => entry.id === id)
    if (entryToTemplate) {
      const template = {
        ...entryToTemplate,
        id: `template-${Date.now()}`,
        isTemplate: true,
      }
      setTemplates((prev) => [...prev, template])
    }
  }

  // Add the getAllTags function
  const getAllTags = () => {
    const allTags = new Set<string>()
    entries.forEach((entry) => {
      if (entry.tags) {
        entry.tags.forEach((tag) => allTags.add(tag))
      }
    })
    return Array.from(allTags).sort()
  }

  return (
    <LabNotebookContext.Provider
      value={{
        entries,
        addEntry,
        updateEntry,
        deleteEntry,
        saveAsTemplate,
        templates,
        getAllTags, // Include the getAllTags function
      }}
    >
      {children}
    </LabNotebookContext.Provider>
  )
}
