"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Sparkles } from "lucide-react"

export function MLPredictionCard() {
  const [isLoading, setIsLoading] = useState(false)
  const [predictions, setPredictions] = useState(null)

  const handleSuggestConditions = async () => {
    setIsLoading(true)
    setPredictions(null)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Generate mock predictions
    const mockPredictions = {
      temperature: Math.floor(Math.random() * 50) + 50, // 50-100°C
      flowRate: Number.parseFloat((Math.random() * 0.9 + 0.1).toFixed(2)), // 0.1-1.0 mL/min
      pressure: Math.floor(Math.random() * 15) + 5, // 5-20 bar
      residenceTime: Math.floor(Math.random() * 20) + 5, // 5-25 min
      yield: Math.floor(Math.random() * 30) + 70, // 70-99%
    }

    setPredictions(mockPredictions)
    setIsLoading(false)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-yellow-500" />
          ML Reaction Optimization
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!predictions && !isLoading && (
          <div className="text-sm text-muted-foreground mb-4">
            Use machine learning to suggest optimal reaction conditions.
          </div>
        )}

        {isLoading && (
          <div className="text-center py-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
            <p className="text-sm">Analyzing reaction parameters...</p>
          </div>
        )}

        {predictions && (
          <div className="space-y-4">
            <div className="text-sm font-medium text-green-600">Optimal conditions predicted!</div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              <div>
                <div className="text-xs text-muted-foreground">Temperature</div>
                <div className="text-lg font-medium">{predictions.temperature}°C</div>
              </div>

              <div>
                <div className="text-xs text-muted-foreground">Flow Rate</div>
                <div className="text-lg font-medium">{predictions.flowRate} mL/min</div>
              </div>

              <div>
                <div className="text-xs text-muted-foreground">Pressure</div>
                <div className="text-lg font-medium">{predictions.pressure} bar</div>
              </div>

              <div>
                <div className="text-xs text-muted-foreground">Residence Time</div>
                <div className="text-lg font-medium">{predictions.residenceTime} min</div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-muted rounded-md">
              <div className="text-xs text-muted-foreground">Predicted Yield</div>
              <div className="text-2xl font-bold text-green-600">{predictions.yield}%</div>
            </div>
          </div>
        )}

        <div className="flex justify-center pt-2">
          <Button onClick={handleSuggestConditions} disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Suggest Optimal Conditions
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
