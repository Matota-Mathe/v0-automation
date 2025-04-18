"use client"

import { useState } from "react"
import { Search, Calendar, ArrowUpDown, Tag, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { useLabNotebook } from "@/contexts/lab-notebook-context"

interface FilterBarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  selectedTag: string | null
  onTagChange: (tag: string | null) => void
  dateRange: { from: Date | undefined; to: Date | undefined }
  onDateRangeChange: (range: { from: Date | undefined; to: Date | undefined }) => void
  sortField: string
  onSortFieldChange: (field: string) => void
  sortDirection: "asc" | "desc"
  onSortDirectionChange: (direction: "asc" | "desc") => void
}

export function FilterBar({
  searchQuery,
  onSearchChange,
  selectedTag,
  onTagChange,
  dateRange,
  onDateRangeChange,
  sortField,
  onSortFieldChange,
  sortDirection,
  onSortDirectionChange,
}: FilterBarProps) {
  const [dateOpen, setDateOpen] = useState(false)
  const { getAllTags } = useLabNotebook()
  const allTags = getAllTags()

  const sortOptions = [
    { value: "date", label: "Date" },
    { value: "title", label: "Title" },
    { value: "experimentType", label: "Experiment Type" },
    { value: "status", label: "Status" },
  ]

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search experiments..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8"
        />
      </div>

      <Popover open={dateOpen} onOpenChange={setDateOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="justify-start text-left font-normal">
            <Calendar className="mr-2 h-4 w-4" />
            {dateRange.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                </>
              ) : (
                format(dateRange.from, "LLL dd, y")
              )
            ) : (
              "Date Range"
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <CalendarComponent
            initialFocus
            mode="range"
            defaultMonth={dateRange.from}
            selected={{
              from: dateRange.from,
              to: dateRange.to,
            }}
            onSelect={(range) => {
              onDateRangeChange({
                from: range?.from,
                to: range?.to,
              })
            }}
            numberOfMonths={2}
          />
          <div className="flex items-center justify-between p-3 border-t">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onDateRangeChange({ from: undefined, to: undefined })
                setDateOpen(false)
              }}
            >
              Clear
            </Button>
            <Button size="sm" onClick={() => setDateOpen(false)}>
              Apply
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      <div className="flex gap-2">
        <Select value={sortField} onValueChange={onSortFieldChange}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="icon"
          onClick={() => onSortDirectionChange(sortDirection === "asc" ? "desc" : "asc")}
        >
          <ArrowUpDown className={`h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
        </Button>
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Tag className="h-4 w-4" />
            {selectedTag ? `#${selectedTag}` : "Tags"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <div className="p-2 max-h-[300px] overflow-auto">
            {allTags.length > 0 ? (
              <div className="flex flex-wrap gap-2 p-2">
                {allTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={selectedTag === tag ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => onTagChange(selectedTag === tag ? null : tag)}
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            ) : (
              <div className="p-2 text-sm text-muted-foreground">No tags found</div>
            )}
          </div>
          {selectedTag && (
            <div className="flex items-center justify-between p-2 border-t">
              <Button variant="ghost" size="sm" className="gap-1" onClick={() => onTagChange(null)}>
                <X className="h-3 w-3" />
                Clear
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  )
}
