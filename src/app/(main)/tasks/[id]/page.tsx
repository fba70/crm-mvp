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
import FormTaskEditDialog from "@/components/business/form-task-edit"
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

  useEffect(() => {
    if (!id) return
    setLoading(true)
    axiosApi
      .get(`/api/task/${id}`)
      .then((res) => setTask(res.data))
      .catch(() => router.replace("/not-found"))
      .finally(() => setLoading(false))

    axiosApi
      .get("/api/client")
      .then((res) => setClients(res.data))
      .finally(() => setClientsLoading(false))
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
        <div className="flex w-[95%] flex-row items-center justify-end gap-2">
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
            </CardTitle>
            <CardDescription>{task.theme || "No theme"}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-2">
              <span className="pr-2 text-sm text-gray-500">Priority:</span>{" "}
              <span className="text-lg font-semibold">
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
              </span>
            </div>
            <div className="mb-2">
              <span className="pr-2 text-sm text-gray-500">Client:</span>{" "}
              <span className="text-lg font-semibold">
                {task.client?.name || "—"}
              </span>
            </div>
            <div className="mb-2">
              <span className="pr-2 text-sm text-gray-500">Due date:</span>{" "}
              <span className="text-lg font-semibold">
                {task.date ? format(new Date(task.date), "dd.MM.yyyy") : "—"}
              </span>
            </div>
            <div className="mb-2">
              <span className="pr-2 text-sm text-gray-500">
                Contact Person:
              </span>{" "}
              <span className="text-lg font-semibold">
                {task.contactPerson || "—"}
              </span>
            </div>
            <div className="mb-2">
              <span className="pr-2 text-sm text-gray-500">Contact Email:</span>{" "}
              <span className="text-lg font-semibold">
                {task.contactEmail || "—"}
              </span>
            </div>
            <div className="mb-2">
              <span className="pr-2 text-sm text-gray-500">Contact Phone:</span>{" "}
              <span className="text-lg font-semibold">
                {task.contactPhone || "—"}
              </span>
            </div>
            <div className="mb-2">
              <span className="pr-2 text-sm text-gray-500">Address:</span>{" "}
              <span className="text-lg font-semibold">
                {task.address || "—"}
              </span>
            </div>
            <div className="mb-2">
              <span className="pr-2 text-sm text-gray-500">URL:</span>{" "}
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
            </div>
          </CardContent>
          <FormTaskEditDialog
            task={task}
            clients={clients}
            onSuccess={(updatedTask) => setTask(updatedTask)}
          />
        </Card>
      </div>
    </main>
  )
}
