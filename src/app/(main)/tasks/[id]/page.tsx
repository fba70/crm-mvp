"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useSession } from "@/lib/auth-client"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import RouteButton from "@/components/business/route-button"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import FormTaskEditDialog from "@/components/forms/form-task-edit"
import type { Task, Client } from "@/types/task-client"
import { unauthorized, notFound } from "next/navigation"
import TaskLoading from "./loading"
import axiosApi from "@/lib/axios"

export default function TaskPage() {
  const router = useRouter()
  const params = useParams()
  const { id } = params as { id: string }

  const { data: user, isPending } = useSession()

  const [task, setTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(true)
  const [clients, setClients] = useState<Client[]>([])
  const [clientsLoading, setClientsLoading] = useState(true)

  const fetchTask = () => {
    setLoading(true)
    axiosApi
      .get(`/api/task/${id}`)
      .then((res) => setTask(res.data))
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
    if (!id) return

    fetchTask()
    fetchClients()
  }, [id, router])

  if (loading || clientsLoading) return <TaskLoading />
  if (!user && !isPending) {
    unauthorized()
  }
  if (!task) {
    notFound()
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col px-0 pt-5">
      <div className="flex justify-between">
        <div className="flex w-[95%] flex-row items-center justify-between gap-2">
          <h1 className="ml-6 text-2xl font-semibold">Task</h1>
          <RouteButton pathParam="/tasks" nameParam="Go back to tasks list" />
        </div>
      </div>
      <div className="space-y-6">
        <Card className="mx-auto mt-6 flex w-[90%] max-w-xl flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-4">
              <p>
                <span className="pr-2 text-sm text-gray-500">Task type: </span>
                {task.type}
              </p>
              <Badge
                variant="outline"
                className={
                  task.status === "OPEN"
                    ? "border-green-600 text-green-600"
                    : "border-gray-300 text-gray-500"
                }
              >
                {task.status}
              </Badge>
              <Badge
                variant="outline"
                className={
                  task.priority === "HIGH"
                    ? "border-red-600 text-red-600"
                    : task.priority === "MEDIUM"
                      ? "border-yellow-600 text-yellow-600"
                      : "border-gray-300 text-blue-500"
                }
              >
                {task.priority}
              </Badge>
            </CardTitle>
            <CardDescription>{task.theme || "No theme"}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-2">
              <span className="pr-2 text-sm text-gray-500">Client:</span>
              <span className="text-lg">{task.client?.name || "—"}</span>

              <span className="pr-2 text-sm text-gray-500">Due date:</span>
              <span className="text-lg">
                {task.date ? format(new Date(task.date), "dd.MM.yyyy") : "—"}
              </span>

              <span className="pr-2 text-sm text-gray-500">
                Contact Person:
              </span>
              <span className="text-lg">{task.contactPerson || "—"}</span>

              <span className="pr-2 text-sm text-gray-500">Contact Email:</span>
              <span className="text-lg">{task.contactEmail || "—"}</span>

              <span className="pr-2 text-sm text-gray-500">Contact Phone:</span>
              <span className="text-lg">{task.contactPhone || "—"}</span>

              <span className="pr-2 text-sm text-gray-500">Address:</span>
              <span className="text-lg">{task.address || "—"}</span>

              <span className="pr-2 text-sm text-gray-500">URL:</span>
              <span className="text-lg">
                {task.urlLink ? (
                  <a
                    href={task.urlLink}
                    className="text-blue-600 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {task.urlLink}
                  </a>
                ) : (
                  "—"
                )}
              </span>
            </div>
          </CardContent>
          <FormTaskEditDialog
            task={task}
            clients={clients}
            onSuccess={fetchTask}
          />
        </Card>
      </div>
    </main>
  )
}
