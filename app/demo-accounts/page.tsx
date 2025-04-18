"use client"

import { DemoAccounts } from "@/components/demo-accounts"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/protected-route"

export default function DemoAccountsPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Demo Accounts</h1>
          <p className="text-muted-foreground">
            Below are the demo accounts available for testing the NMU Flow Chemistry Group platform. You can use these
            credentials to log in with different roles and permissions.
          </p>
          <DemoAccounts />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
