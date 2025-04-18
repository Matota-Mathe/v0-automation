import type { LabEntry } from "@/contexts/lab-notebook-context"

export function exportToPdf(entries: LabEntry[]) {
  // In a real application, this would use a library like jsPDF
  // For this demo, we'll just show an alert
  alert("PDF export functionality would be implemented here")
  console.log("Entries to export:", entries)
}

export function exportToCsv(entries: LabEntry[]) {
  // Create CSV content
  const headers = [
    "Title",
    "Date",
    "Type",
    "Status",
    "Temperature (°C)",
    "Pressure (bar)",
    "Flow Rate (mL/min)",
    "Residence Time (min)",
    "Yield (%)",
    "Observations",
    "Notes",
  ]

  const rows = entries.map((entry) => [
    entry.title,
    entry.date,
    entry.experimentType,
    entry.status,
    entry.reactionConditions.temperature,
    entry.reactionConditions.pressure,
    entry.reactionConditions.flowRate,
    entry.reactionConditions.residenceTime,
    entry.yield || "",
    entry.observations || "",
    entry.notes || "",
  ])

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")),
  ].join("\n")

  // Create a blob and download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.setAttribute("href", url)
  link.setAttribute("download", `lab-notebook-export-${new Date().toISOString().split("T")[0]}.csv`)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function exportToJson(entries: LabEntry[]) {
  // Create a simplified version of the entries for export
  const exportData = entries.map((entry) => ({
    title: entry.title,
    date: entry.date,
    experimentType: entry.experimentType,
    status: entry.status,
    reagents: entry.reagents,
    catalyst: entry.catalyst,
    reactionConditions: entry.reactionConditions,
    observations: entry.observations,
    yield: entry.yield,
    notes: entry.notes,
    tags: entry.tags,
  }))

  // Create a blob and download
  const jsonContent = JSON.stringify(exportData, null, 2)
  const blob = new Blob([jsonContent], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.setAttribute("href", url)
  link.setAttribute("download", `lab-notebook-export-${new Date().toISOString().split("T")[0]}.json`)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
