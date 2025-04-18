"use client"

import type React from "react"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLabNotebook } from "@/contexts/lab-notebook-context"
import { useChemicals } from "@/contexts/chemicals-context"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Upload } from "lucide-react"

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  date: z.string().min(1, "Date is required"),
  experimentType: z.string().min(1, "Experiment type is required"),
  status: z.enum(["Planned", "In Progress", "Completed", "Failed"]),
  reagents: z
    .array(
      z.object({
        name: z.string().min(1, "Reagent name is required"),
        concentration: z.number().min(0, "Must be a positive number"),
        volume: z.number().min(0, "Must be a positive number"),
        moles: z.number().optional(),
        equivalents: z.number().optional(),
      }),
    )
    .min(1, "At least one reagent is required"),
  catalyst: z.string().optional(),
  reactionConditions: z.object({
    temperature: z.number().min(0, "Temperature must be a positive number"),
    pressure: z.number().min(0, "Pressure must be a positive number"),
    flowRate: z.number().min(0, "Flow rate must be a positive number"),
    residenceTime: z.number().min(0, "Residence time must be a positive number"),
  }),
  observations: z.string().optional(),
  yield: z.number().min(0, "Yield must be a positive number").max(100, "Yield cannot exceed 100%").optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
})

type FormValues = z.infer<typeof formSchema>

interface NewEntryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: Partial<FormValues>
  isRepeat?: boolean
  isEdit?: boolean // Add this prop
}

export function NewEntryDialog({
  open,
  onOpenChange,
  initialData,
  isRepeat = false,
  isEdit = false,
}: NewEntryDialogProps) {
  const { addEntry, updateEntry } = useLabNotebook()
  const { chemicals } = useChemicals()
  const [files, setFiles] = useState<File[]>([])
  const [tags, setTags] = useState<string[]>(initialData?.tags || [])
  const [tagInput, setTagInput] = useState("")

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      date: initialData?.date || new Date().toISOString().split("T")[0],
      experimentType: initialData?.experimentType || "",
      status: initialData?.status || "Planned",
      reagents: initialData?.reagents || [{ name: "", concentration: 0, volume: 0 }],
      catalyst: initialData?.catalyst || "",
      reactionConditions: initialData?.reactionConditions || {
        temperature: 25,
        pressure: 1,
        flowRate: 0.5,
        residenceTime: 10,
      },
      observations: initialData?.observations || "",
      yield: initialData?.yield,
      notes: initialData?.notes || "",
      tags: tags,
    },
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setFiles((prev) => [...prev, ...newFiles])
    }
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags((prev) => [...prev, tagInput.trim()])
      setTagInput("")
    }
  }

  const removeTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag))
  }

  const onSubmit = (values: FormValues) => {
    // Calculate moles and equivalents for each reagent
    const reagentsWithCalculations = values.reagents.map((reagent) => {
      const moles = reagent.concentration * (reagent.volume / 1000)
      return {
        ...reagent,
        moles,
      }
    })

    // Find limiting reagent (lowest moles)
    const lowestMoles = Math.min(...reagentsWithCalculations.map((r) => r.moles || 0))

    // Calculate equivalents based on limiting reagent
    const finalReagents = reagentsWithCalculations.map((reagent) => ({
      ...reagent,
      equivalents: (reagent.moles || 0) / lowestMoles,
    }))

    const entryData = {
      ...values,
      reagents: finalReagents,
      tags,
    }

    if (isEdit && initialData?.id) {
      updateEntry(initialData.id, entryData)
    } else {
      addEntry(entryData)
    }

    onOpenChange(false)
  }

  const addReagent = () => {
    const reagents = form.getValues("reagents")
    form.setValue("reagents", [...reagents, { name: "", concentration: 0, volume: 0 }])
  }

  const removeReagent = (index: number) => {
    const reagents = form.getValues("reagents")
    if (reagents.length > 1) {
      form.setValue(
        "reagents",
        reagents.filter((_, i) => i !== index),
      )
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Experiment" : isRepeat ? "Repeat Experiment" : "New Experiment Entry"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the details of your experiment."
              : isRepeat
                ? "Create a new experiment based on an existing one."
                : "Record the details of your flow chemistry experiment."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid grid-cols-4">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="reagents">Reagents</TabsTrigger>
                <TabsTrigger value="conditions">Conditions</TabsTrigger>
                <TabsTrigger value="results">Results & Notes</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Experiment title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="experimentType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Experiment Type</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Optimization, Synthesis" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Planned">Planned</SelectItem>
                            <SelectItem value="In Progress">In Progress</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                            <SelectItem value="Failed">Failed</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  name="tags"
                  render={() => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <div className="flex flex-wrap gap-2 mt-2 mb-2">
                        {tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="gap-1">
                            #{tag}
                            <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add tag (e.g., optimization)"
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault()
                              addTag()
                            }
                          }}
                        />
                        <Button type="button" variant="outline" onClick={addTag}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="reagents" className="space-y-4 pt-4">
                {form.getValues("reagents").map((_, index) => (
                  <div key={index} className="space-y-4 p-4 border rounded-md">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Reagent {index + 1}</h4>
                      {index > 0 && (
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeReagent(index)}>
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name={`reagents.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select or enter name" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {chemicals.map((chemical) => (
                                  <SelectItem key={chemical.id} value={chemical.name}>
                                    {chemical.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`reagents.${index}.concentration`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Concentration (mol/L)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                {...field}
                                onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`reagents.${index}.volume`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Volume (mL)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.1"
                                {...field}
                                onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                ))}

                <Button type="button" variant="outline" onClick={addReagent} className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Reagent
                </Button>

                <FormField
                  control={form.control}
                  name="catalyst"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Catalyst (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Pd/C, 10 mol%" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="conditions" className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="reactionConditions.temperature"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Temperature (°C)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.1"
                            {...field}
                            onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="reactionConditions.pressure"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pressure (bar)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.1"
                            {...field}
                            onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="reactionConditions.flowRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Flow Rate (mL/min)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            {...field}
                            onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="reactionConditions.residenceTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Residence Time (min)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.1"
                            {...field}
                            onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              <TabsContent value="results" className="space-y-4 pt-4">
                <FormField
                  control={form.control}
                  name="observations"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Observations</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Record your observations during the experiment"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="yield"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Yield (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.1"
                          min="0"
                          max="100"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) =>
                            field.onChange(e.target.value ? Number.parseFloat(e.target.value) : undefined)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Additional notes, analysis, or conclusions"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="files"
                  render={() => (
                    <FormItem>
                      <FormLabel>Files</FormLabel>
                      <div className="mt-2 space-y-2">
                        {files.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                            <div className="flex items-center">
                              <span className="text-sm">{file.name}</span>
                              <span className="text-xs text-muted-foreground ml-2">
                                ({(file.size / 1024).toFixed(1)} KB)
                              </span>
                            </div>
                            <Button type="button" variant="ghost" size="sm" onClick={() => removeFile(index)}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}

                        <div className="flex items-center justify-center w-full">
                          <label
                            htmlFor="file-upload"
                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted"
                          >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <Upload className="h-6 w-6 text-muted-foreground mb-2" />
                              <p className="text-sm text-muted-foreground">
                                <span className="font-medium">Click to upload</span> or drag and drop
                              </p>
                              <p className="text-xs text-muted-foreground">PDF, images, or data files</p>
                            </div>
                            <input
                              id="file-upload"
                              type="file"
                              className="hidden"
                              multiple
                              onChange={handleFileChange}
                            />
                          </label>
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">{isEdit ? "Update Entry" : "Save Entry"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
