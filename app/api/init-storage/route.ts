import { getSupabaseServerClient } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = getSupabaseServerClient()

    // Check if the bucket exists
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()

    if (bucketsError) {
      console.error("Error checking buckets:", bucketsError)
      return NextResponse.json({ error: "Failed to check storage buckets" }, { status: 500 })
    }

    // Create the bucket if it doesn't exist
    if (!buckets.some((bucket) => bucket.name === "lab-files")) {
      const { error: createError } = await supabase.storage.createBucket("lab-files", {
        public: true, // Files will be publicly accessible
      })

      if (createError) {
        console.error("Error creating bucket:", createError)
        return NextResponse.json({ error: "Failed to create storage bucket" }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true, message: "Storage initialized successfully" })
  } catch (error) {
    console.error("Error initializing storage:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
