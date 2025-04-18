"use client"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Settings, Plus, ExternalLink } from "lucide-react"
import { useEquipment } from "@/contexts/equipment-context"

export function InstrumentsSimple() {
  const router = useRouter()
  const { pumpTypes, reactorTypes } = useEquipment()

  // Show only a few items
  const recentPumps = pumpTypes.slice(0, 2)
  const recentReactors = reactorTypes.slice(0, 2)

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          <CardTitle>Instruments</CardTitle>
        </div>
        <Button size="sm" onClick={() => router.push("/tools/instruments")}>
          <Plus className="h-4 w-4 mr-2" />
          Add Instrument
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Pump Types</h3>
            {recentPumps.length === 0 ? (
              <div className="text-center py-2 text-muted-foreground">
                <p>No pump types defined</p>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Manufacturer</TableHead>
                      <TableHead>Flow Rate Range</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentPumps.map((pump) => (
                      <TableRow key={pump.id}>
                        <TableCell className="font-medium">{pump.name}</TableCell>
                        <TableCell>{pump.manufacturer}</TableCell>
                        <TableCell>
                          {pump.flowRateMin} - {pump.flowRateMax} mL/min
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Reactor Types</h3>
            {recentReactors.length === 0 ? (
              <div className="text-center py-2 text-muted-foreground">
                <p>No reactor types defined</p>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Volume</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentReactors.map((reactor) => (
                      <TableRow key={reactor.id}>
                        <TableCell className="font-medium">{reactor.name}</TableCell>
                        <TableCell>{reactor.type}</TableCell>
                        <TableCell>{reactor.volume} mL</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 flex justify-center">
          <Button variant="outline" onClick={() => router.push("/tools/instruments")} className="w-full">
            <ExternalLink className="h-4 w-4 mr-2" />
            Manage All Instruments
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
