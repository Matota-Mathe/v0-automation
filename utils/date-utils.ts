import { format, parseISO } from "date-fns"

/**
 * Format a date string to a readable format
 * @param dateString ISO date string
 * @returns Formatted date string (e.g., "Apr 15, 2023")
 */
export function formatDate(dateString: string): string {
  try {
    // Handle both ISO strings and Date objects converted to strings
    const date = typeof dateString === "object" ? dateString : parseISO(dateString)
    return format(date, "MMM d, yyyy")
  } catch (error) {
    console.error("Error formatting date:", error)
    return dateString // Return the original string if parsing fails
  }
}

/**
 * Format a date string to include time
 * @param dateString ISO date string
 * @returns Formatted date and time string (e.g., "Apr 15, 2023, 2:30 PM")
 */
export function formatDateTime(dateString: string): string {
  try {
    const date = typeof dateString === "object" ? dateString : parseISO(dateString)
    return format(date, "MMM d, yyyy, h:mm a")
  } catch (error) {
    console.error("Error formatting date and time:", error)
    return dateString
  }
}
