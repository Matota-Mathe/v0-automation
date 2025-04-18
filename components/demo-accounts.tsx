"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

// Demo accounts for testing
const demoAccounts = [
  { email: "admin@example.com", password: "password123", role: "admin", name: "Admin User" },
  { email: "researcher@example.com", password: "password123", role: "researcher", name: "Researcher" },
  { email: "demo1@nmu.edu", password: "demo1pass", role: "researcher", name: "Alex Johnson" },
  { email: "demo2@nmu.edu", password: "demo2pass", role: "researcher", name: "Taylor Smith" },
  { email: "demo3@nmu.edu", password: "demo3pass", role: "technician", name: "Jordan Lee" },
  { email: "demo4@nmu.edu", password: "demo4pass", role: "technician", name: "Casey Brown" },
  { email: "demo5@nmu.edu", password: "demo5pass", role: "guest", name: "Morgan White" },
  { email: "demo6@nmu.edu", password: "demo6pass", role: "researcher", name: "Riley Green" },
  { email: "demo7@nmu.edu", password: "demo7pass", role: "researcher", name: "Quinn Davis" },
  { email: "demo8@nmu.edu", password: "demo8pass", role: "technician", name: "Sam Wilson" },
  { email: "demo9@nmu.edu", password: "demo9pass", role: "guest", name: "Jamie Miller" },
  { email: "demo10@nmu.edu", password: "demo10pass", role: "researcher", name: "Drew Parker" },
]

export function DemoAccounts() {
  const { toast } = useToast()
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    toast({
      title: "Copied to clipboard",
      description: "The credentials have been copied to your clipboard.",
    })
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Demo Accounts</CardTitle>
        <CardDescription>Use these accounts to test the system</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Password</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="w-[100px]">Copy</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {demoAccounts.map((account, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{account.name}</TableCell>
                  <TableCell>{account.email}</TableCell>
                  <TableCell>{account.password}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        account.role === "admin"
                          ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                          : account.role === "researcher"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                            : account.role === "technician"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
                      }`}
                    >
                      {account.role}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(`Email: ${account.email}\nPassword: ${account.password}`, index)}
                    >
                      {copiedIndex === index ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
