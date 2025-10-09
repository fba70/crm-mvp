"use client"

import { useSession } from "@/lib/auth-client"
import { unauthorized } from "next/navigation"

export default function DashboardPage() {
  const { data: user, isPending } = useSession()

  if (!user && !isPending) {
    unauthorized()
  }

  if (!user) {
    unauthorized()
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col px-0 pt-5">
      <div className="space-y-4">
        <div className="flex flex-row justify-between px-4">
          <h1 className="pl-2 text-2xl font-semibold">Task Transitions</h1>
        </div>
      </div>
    </main>
  )
}
