"use client"

import { useState, useEffect } from "react"
import { useSession } from "@/lib/auth-client"
import { unauthorized } from "next/navigation"
import { TasksCarousel } from "@/components/business/carousel"
import type { Task, Client } from "@/types/task-client"
import FormNewTaskDialog from "@/components/forms/form-new-task"
import axiosApi from "@/lib/axios"
import TasksLoading from "./loading"

export default function TasksPage() {
  const { data: user, isPending } = useSession()

  if (!user && !isPending) {
    unauthorized()
  }

  const [tasks, setTasks] = useState<Task[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [clients, setClients] = useState<Client[]>([])
  const [clientsLoading, setClientsLoading] = useState(true)

  const fetchTasks = () => {
    setLoading(true)
    axiosApi
      .get(`/api/task?userId=${user?.user.id}`)
      .then((res) => setTasks(res.data))
      .finally(() => setLoading(false))
  }

  const fetchClients = () => {
    setClientsLoading(true)
    axiosApi
      .get("/api/client")
      .then((res) => setClients(res.data))
      .finally(() => setClientsLoading(false))
  }

  useEffect(() => {
    if (user && !isPending) {
      fetchTasks()
    }
  }, [user, isPending])

  useEffect(() => {
    fetchClients()
  }, [])

  if (loading || clientsLoading) return <TasksLoading />

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col px-0 pt-5">
      <div className="space-y-6">
        <div className="flex flex-row justify-between px-4">
          <h1 className="text-2xl font-semibold">Tasks</h1>
          {user && (
            <FormNewTaskDialog
              clients={clients}
              userId={user?.user.id}
              onSuccess={() => fetchTasks()}
            />
          )}
        </div>

        <main className="flex flex-1 flex-col">
          {tasks && <TasksCarousel tasks={tasks} />}
        </main>
      </div>
    </main>
  )
}
