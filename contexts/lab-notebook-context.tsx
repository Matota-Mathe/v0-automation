"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { useAuth } from "./auth-context"

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
  getAllTags: () => string[]
  uploadFiles: (files: File[]) => Promise<string[]> // Add this line
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
  const supabase = getSupabaseBrowserClient()
  const { user } = useAuth()

  // Load entries from Supabase
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        // Fetch regular entries
        const { data: entriesData, error: entriesError } = await supabase
          .from("lab_entries")
          .select("*")
          .eq("is_template", false)
          .order("created_at", { ascending: false })

        if (entriesError) {
          console.error("Error fetching lab entries:", entriesError)
          // Fall back to localStorage
          const storedEntries = localStorage.getItem("labEntries")
          if (storedEntries) {
            setEntries(JSON.parse(storedEntries))
          }
        } else {
          // Map Supabase data to our app's format
          const mappedEntries: LabEntry[] = entriesData.map((entry) => ({
            id: entry.id,
            title: entry.title,
            date: entry.date,
            experimentType: entry.experiment_type,
            status: entry.status as "Planned" | "In Progress" | "Completed" | "Failed",
            reagents: entry.reagents,
            catalyst: entry.catalyst,
            reactionConditions: entry.reaction_conditions,
            observations: entry.observations || "",
            yield: entry.yield,
            notes: entry.notes || "",
            fileUrls: entry.file_urls || [],
            isTemplate: false,
            tags: entry.tags || [],
          }))

          setEntries(mappedEntries)
        }

        // Fetch templates
        const { data: templatesData, error: templatesError } = await supabase
          .from("lab_entries")
          .select("*")
          .eq("is_template", true)
          .order("created_at", { ascending: false })

        if (templatesError) {
          console.error("Error fetching lab templates:", templatesError)
          // Fall back to localStorage
          const storedTemplates = localStorage.getItem("labTemplates")
          if (storedTemplates) {
            setTemplates(JSON.parse(storedTemplates))
          }
        } else {
          // Map Supabase data to our app's format
          const mappedTemplates: LabEntry[] = templatesData.map((entry) => ({
            id: entry.id,
            title: entry.title,
            date: entry.date,
            experimentType: entry.experiment_type,
            status: entry.status as "Planned" | "In Progress" | "Completed" | "Failed",
            reagents: entry.reagents,
            catalyst: entry.catalyst,
            reactionConditions: entry.reaction_conditions,
            observations: entry.observations || "",
            yield: entry.yield,
            notes: entry.notes || "",
            fileUrls: entry.file_urls || [],
            isTemplate: true,
            tags: entry.tags || [],
          }))

          setTemplates(mappedTemplates)
        }
      } catch (error) {
        console.error("Error fetching lab notebook data:", error)
        // Fall back to localStorage
        const storedEntries = localStorage.getItem("labEntries")
        const storedTemplates = localStorage.getItem("labTemplates")

        if (storedEntries) setEntries(JSON.parse(storedEntries))
        if (storedTemplates) setTemplates(JSON.parse(storedTemplates))
      }
    }

    if (user) {
      fetchEntries()
    }
  }, [supabase, user])

  // Add a new function to handle file uploads to Supabase storage
  // Add this function inside the LabNotebookProvider component before the return statement

  const uploadFiles = async (files: File[]): Promise<string[]> => {
    if (!user || !files.length) return []

    const fileUrls: string[] = []

    try {
      // Upload each file to Supabase storage
      for (const file of files) {
        const fileExt = file.name.split(".").pop()
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
        const filePath = `${user.id}/lab-notebook/${fileName}`

        const { data, error } = await supabase.storage.from("lab-files").upload(filePath, file)

        if (error) {
          console.error("Error uploading file:", error)
          continue
        }

        // Get public URL for the uploaded file
        const { data: urlData } = supabase.storage.from("lab-files").getPublicUrl(filePath)

        if (urlData?.publicUrl) {
          fileUrls.push(urlData.publicUrl)
        }
      }

      return fileUrls
    } catch (error) {
      console.error("Error in file upload:", error)
      return []
    }
  }

  // Update the addEntry function to handle file uploads
  // Modify the addEntry function to include file uploads

  const addEntry = async (entry: Omit<LabEntry, "id">) => {
    if (!user) return

    try {
      // Upload files if any
      let fileUrls = entry.fileUrls || []

      if (entry.files && entry.files.length > 0) {
        const uploadedUrls = await uploadFiles(entry.files)
        fileUrls = [...fileUrls, ...uploadedUrls]
      }

      // Insert into Supabase
      const { data, error } = await supabase
        .from("lab_entries")
        .insert([
          {
            title: entry.title,
            date: entry.date,
            experiment_type: entry.experimentType,
            status: entry.status,
            reaction_conditions: entry.reactionConditions,
            reagents: entry.reagents,
            catalyst: entry.catalyst,
            observations: entry.observations,
            yield: entry.yield,
            notes: entry.notes,
            file_urls: fileUrls,
            is_template: entry.isTemplate || false,
            tags: entry.tags || [],
            user_id: user.id,
          },
        ])
        .select()

      if (error) {
        console.error("Error adding lab entry:", error)
        return
      }

      if (data && data[0]) {
        const newEntry: LabEntry = {
          id: data[0].id,
          title: data[0].title,
          date: data[0].date,
          experimentType: data[0].experiment_type,
          status: data[0].status as "Planned" | "In Progress" | "Completed" | "Failed",
          reagents: data[0].reagents,
          catalyst: data[0].catalyst,
          reactionConditions: data[0].reaction_conditions,
          observations: data[0].observations || "",
          yield: data[0].yield,
          notes: data[0].notes || "",
          fileUrls: data[0].file_urls || [],
          isTemplate: data[0].is_template,
          tags: data[0].tags || [],
        }

        if (newEntry.isTemplate) {
          setTemplates((prev) => [newEntry, ...prev])
        } else {
          setEntries((prev) => [newEntry, ...prev])
        }
      }
    } catch (error) {
      console.error("Error adding lab entry:", error)
    }
  }

  // Update the updateEntry function to handle file uploads
  // Modify the updateEntry function to include file uploads

  const updateEntry = async (id: string, updatedFields: Partial<LabEntry>) => {
    if (!user) return

    try {
      // Upload new files if any
      let fileUrls = updatedFields.fileUrls || []

      if (updatedFields.files && updatedFields.files.length > 0) {
        const uploadedUrls = await uploadFiles(updatedFields.files)
        fileUrls = [...fileUrls, ...uploadedUrls]
        updatedFields.fileUrls = fileUrls
      }

      // Map to Supabase format
      const updateData: any = {}
      if (updatedFields.title !== undefined) updateData.title = updatedFields.title
      if (updatedFields.date !== undefined) updateData.date = updatedFields.date
      if (updatedFields.experimentType !== undefined) updateData.experiment_type = updatedFields.experimentType
      if (updatedFields.status !== undefined) updateData.status = updatedFields.status
      if (updatedFields.reagents !== undefined) updateData.reagents = updatedFields.reagents
      if (updatedFields.catalyst !== undefined) updateData.catalyst = updatedFields.catalyst
      if (updatedFields.reactionConditions !== undefined)
        updateData.reaction_conditions = updatedFields.reactionConditions
      if (updatedFields.observations !== undefined) updateData.observations = updatedFields.observations
      if (updatedFields.yield !== undefined) updateData.yield = updatedFields.yield
      if (updatedFields.notes !== undefined) updateData.notes = updatedFields.notes
      if (updatedFields.fileUrls !== undefined) updateData.file_urls = updatedFields.fileUrls
      if (updatedFields.isTemplate !== undefined) updateData.is_template = updatedFields.isTemplate
      if (updatedFields.tags !== undefined) updateData.tags = updatedFields.tags
      updateData.updated_at = new Date().toISOString()

      // Update in Supabase
      const { error } = await supabase.from("lab_entries").update(updateData).eq("id", id)

      if (error) {
        console.error("Error updating lab entry:", error)
        return
      }

      // Update local state
      const isTemplate =
        entries.find((e) => e.id === id)?.isTemplate ||
        templates.find((t) => t.id === id)?.isTemplate ||
        updatedFields.isTemplate ||
        false

      if (isTemplate) {
        setTemplates((prev) => prev.map((entry) => (entry.id === id ? { ...entry, ...updatedFields } : entry)))
      } else {
        setEntries((prev) => prev.map((entry) => (entry.id === id ? { ...entry, ...updatedFields } : entry)))
      }
    } catch (error) {
      console.error("Error updating lab entry:", error)
    }
  }

  const deleteEntry = async (id: string) => {
    if (!user) return

    try {
      // Delete from Supabase
      const { error } = await supabase.from("lab_entries").delete().eq("id", id)

      if (error) {
        console.error("Error deleting lab entry:", error)
        return
      }

      // Update local state
      setEntries((prev) => prev.filter((entry) => entry.id !== id))
      setTemplates((prev) => prev.filter((template) => template.id !== id))
    } catch (error) {
      console.error("Error deleting lab entry:", error)
    }
  }

  const saveAsTemplate = async (id: string) => {
    const entryToTemplate = entries.find((entry) => entry.id === id)
    if (!entryToTemplate || !user) return

    try {
      // Create a new template entry in Supabase
      const { data, error } = await supabase
        .from("lab_entries")
        .insert([
          {
            title: entryToTemplate.title,
            date: entryToTemplate.date,
            experiment_type: entryToTemplate.experimentType,
            status: entryToTemplate.status,
            reaction_conditions: entryToTemplate.reactionConditions,
            reagents: entryToTemplate.reagents,
            catalyst: entryToTemplate.catalyst,
            observations: entryToTemplate.observations,
            yield: entryToTemplate.yield,
            notes: entryToTemplate.notes,
            file_urls: entryToTemplate.fileUrls || [],
            is_template: true,
            tags: entryToTemplate.tags || [],
            user_id: user.id,
          },
        ])
        .select()

      if (error) {
        console.error("Error saving as template:", error)
        return
      }

      if (data && data[0]) {
        const newTemplate: LabEntry = {
          id: data[0].id,
          title: data[0].title,
          date: data[0].date,
          experimentType: data[0].experiment_type,
          status: data[0].status as "Planned" | "In Progress" | "Completed" | "Failed",
          reagents: data[0].reagents,
          catalyst: data[0].catalyst,
          reactionConditions: data[0].reaction_conditions,
          observations: data[0].observations || "",
          yield: data[0].yield,
          notes: data[0].notes || "",
          fileUrls: data[0].file_urls || [],
          isTemplate: true,
          tags: data[0].tags || [],
        }

        setTemplates((prev) => [newTemplate, ...prev])
      }
    } catch (error) {
      console.error("Error saving as template:", error)
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
        getAllTags,
        uploadFiles, // Add this line
      }}
    >
      {children}
    </LabNotebookContext.Provider>
  )
}
