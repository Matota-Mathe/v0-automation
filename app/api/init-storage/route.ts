import { getSupabaseServerClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = getSupabaseServerClient()

    // Check if the bucket exists
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()

    if (bucketsError) {
      console.error("Error listing buckets:", bucketsError)
      return new Response(JSON.stringify({ error: "Failed to list buckets" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Check if lab-files bucket exists
    const bucketExists = buckets?.some((bucket) => bucket.name === "lab-files")

    if (!bucketExists) {
      // Create the bucket
      const { error: createError } = await supabase.storage.createBucket("lab-files", {
        public: true,
        fileSizeLimit: 50 * 1024 * 1024, // 50MB limit
      })

      if (createError) {
        console.error("Error creating bucket:", createError)
        return new Response(JSON.stringify({ error: "Failed to create bucket" }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        })
      }

      return new Response(JSON.stringify({ message: "Storage bucket created successfully" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    }

    return new Response(JSON.stringify({ message: "Storage bucket already exists" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Error initializing storage:", error)
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
