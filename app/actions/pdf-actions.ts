"use server"

import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { hasPermission } from "@/utils/permissions"

// Function to extract text from PDF
// In a real implementation, this would use a PDF parsing library
// For this demo, we'll simulate text extraction
async function extractTextFromPDF(file: File): Promise<string> {
  // In a real implementation, you would use a library like pdf-parse
  // For demo purposes, we'll return a placeholder
  return "This is simulated extracted text from the PDF. In a real implementation, we would extract the actual text content from the uploaded PDF file using a library like pdf-parse."
}

// Function to check if OpenAI API key is available
function isOpenAIKeyAvailable(): boolean {
  return process.env.OPENAI_API_KEY ? true : false
}

// Function to generate mock AI responses for demo purposes
function generateMockResponses(extractedText: string) {
  return {
    summary:
      "This is a mock summary of the PDF content. In a real implementation with a valid OpenAI API key, this would be an AI-generated summary of the document's content. The summary would highlight the main points, methodology, and conclusions from the scientific document.",
    keyPoints:
      "1. First key point extracted from the document\n2. Second key point about methodology\n3. Third key point about results\n4. Fourth key point about implications\n5. Fifth key point about future research directions",
    chemistryConcepts:
      "• **Catalysis**: The process of increasing the rate of a chemical reaction by adding a substance known as a catalyst\n• **Flow Chemistry**: Continuous processing where reactions are run in a continuously flowing stream\n• **Reaction Kinetics**: The study of rates of chemical processes\n• **Selectivity**: The preferential formation of one product over others in a chemical reaction",
  }
}

export async function analyzePDF(formData: FormData, userRole: string) {
  try {
    // Check if user has permission
    if (!hasPermission(userRole as any, "view_analytics")) {
      return {
        success: false,
        error: "You don't have permission to use the PDF analyzer",
      }
    }

    const file = formData.get("pdf") as File

    if (!file) {
      return {
        success: false,
        error: "No file provided",
      }
    }

    // Check if file is a PDF
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      return {
        success: false,
        error: "File must be a PDF",
      }
    }

    // Extract text from PDF
    const extractedText = await extractTextFromPDF(file)

    // Check if OpenAI API key is available
    const hasApiKey = isOpenAIKeyAvailable()

    let summary, keyPoints, chemistryConcepts

    if (hasApiKey) {
      // Generate summary using AI
      const summaryResult = await generateText({
        model: openai("gpt-4o"),
        prompt: `Summarize the following text from a scientific document in 3-5 paragraphs. Focus on the key findings, methodology, and conclusions: ${extractedText}`,
      })
      summary = summaryResult.text

      // Generate key points using AI
      const keyPointsResult = await generateText({
        model: openai("gpt-4o"),
        prompt: `Extract 5 key points from the following text from a scientific document: ${extractedText}`,
      })
      keyPoints = keyPointsResult.text

      // Generate relevant chemistry concepts using AI
      const chemistryConceptsResult = await generateText({
        model: openai("gpt-4o"),
        prompt: `Identify and explain 3-5 chemistry concepts that are relevant to the following text. Format as a bullet list: ${extractedText}`,
      })
      chemistryConcepts = chemistryConceptsResult.text
    } else {
      // Use mock responses when API key is not available
      const mockResponses = generateMockResponses(extractedText)
      summary = mockResponses.summary
      keyPoints = mockResponses.keyPoints
      chemistryConcepts = mockResponses.chemistryConcepts
    }

    return {
      success: true,
      fileName: file.name,
      fileSize: file.size,
      summary,
      keyPoints,
      chemistryConcepts,
      isDemo: !hasApiKey,
    }
  } catch (error) {
    console.error("Error analyzing PDF:", error)
    return {
      success: false,
      error: "Failed to analyze PDF. Please try again.",
      details: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
