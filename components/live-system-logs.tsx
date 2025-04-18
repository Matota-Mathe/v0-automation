"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { PermissionGate } from "@/components/permission-gate"

export function LiveSystemLogs({ logs }) {
  const getLogTypeStyles = (type) => {
    switch (type) {
      case "error":
        return "bg-destructive text-destructive-foreground"
      case "warning":
        return "bg-yellow-500 text-white"
      case "success":
        return "bg-green-500 text-white"
      default:
        return "bg-primary text-primary-foreground"
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl">Live System Logs</CardTitle>
        <PermissionGate permission="clear_logs">
          <Button variant="outline" size="sm">
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Logs
          </Button>
        </PermissionGate>
      </CardHeader>
      <CardContent>
        <PermissionGate permission="view_logs">
          <ScrollArea className="h-[200px] w-full rounded-md border p-4">
            {logs.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">No logs available</div>
            ) : (
              <div className="space-y-2">
                {logs.map((log, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm">
                    <Badge variant="outline" className="shrink-0">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </Badge>
                    <Badge className={`shrink-0 ${getLogTypeStyles(log.type)}`}>{log.type.toUpperCase()}</Badge>
                    <span>{log.message}</span>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </PermissionGate>
      </CardContent>
    </Card>
  )
}
