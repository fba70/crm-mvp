"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useSession } from "@/lib/auth-client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import RouteButton from "@/components/business/route-button"
import { Badge } from "@/components/ui/badge"
import { ChevronsRight } from "lucide-react"
import { format } from "date-fns"
import FormTaskEditDialog from "@/components/forms/form-task-edit"
import FormNewTaskDialog from "@/components/forms/form-new-task"
import FormTaskTransferDialog from "@/components/forms/form-task-transfer"
import type { Task, Client } from "@/types/entities"
import { unauthorized, notFound } from "next/navigation"
import TaskLoading from "./loading"
import axiosApi from "@/lib/axios"
import { Button } from "@/components/ui/button"

type User = {
  id: string
  name: string
  image: string | null
}

export default function TaskPage() {
  const router = useRouter()
  const params = useParams()
  const { id } = params as { id: string }

  const { data: user, isPending } = useSession()

  const [task, setTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(true)
  const [clients, setClients] = useState<Client[]>([])
  const [clientsLoading, setClientsLoading] = useState(true)
  const [users, setUsers] = useState<User[]>([])
  const [loadingUsers, setLoadingUsers] = useState(true)

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

  const fetchUsers = async () => {
    try {
      const response = await axiosApi.get("/api/user")
      setUsers(response.data)
    } catch (error) {
      console.error("Failed to fetch users:", error)
    } finally {
      setLoadingUsers(false)
    }
  }

  useEffect(() => {
    if (!id) return

    fetchTask()
    fetchClients()
    fetchUsers()
  }, [id, router])

  if (loading || clientsLoading || loadingUsers) return <TaskLoading />
  if (!user && !isPending) {
    unauthorized()
  }
  if (!task) {
    notFound()
  }

  // console.log("TASK", task)

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
            <CardTitle className="flex items-center justify-between gap-4">
              <div className="flex flex-row items-center justify-start gap-1">
                {task.type}
              </div>
              <div className="flex items-center justify-center gap-2">
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
                {task.transferToId && (
                  <Badge
                    variant="outline"
                    className={
                      task.transferStatus === "REJECTED"
                        ? "border-red-600 text-red-600"
                        : task.transferStatus === "ACCEPTED"
                          ? "border-green-600 text-green-600"
                          : "border-gray-300 text-gray-500"
                    }
                  >
                    {task.transferStatus}
                  </Badge>
                )}
              </div>
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="mb-4 grid max-h-120 grid-cols-[auto_1fr] items-center gap-x-4 gap-y-2 overflow-y-auto">
              <div className="pr-2 text-sm text-gray-500">Task Name:</div>
              <div className="text-lg">{task.theme || "—"}</div>

              <div className="pr-2 text-sm text-gray-500">Client:</div>
              <div className="text-lg">{task.client?.name || "—"}</div>

              <div className="pr-2 text-sm text-gray-500">Due Date:</div>
              <div className="text-lg">
                {task.date ? format(new Date(task.date), "dd.MM.yyyy") : "—"}
              </div>

              <div className="pr-2 text-sm text-gray-500">Contact Person:</div>
              <div className="text-lg">{task.contactPerson || "—"}</div>

              <div className="pr-2 text-sm text-gray-500">Contact Email:</div>
              <div className="text-lg">{task.contactEmail || "—"}</div>

              <div className="pr-2 text-sm text-gray-500">Contact Phone:</div>
              <div className="text-lg">{task.contactPhone || "—"}</div>

              <div className="pr-2 text-sm text-gray-500">Address:</div>
              <div className="text-lg">{task.address || "—"}</div>

              <div className="pr-2 text-sm text-gray-500">Meeting URL:</div>
              <div className="text-lg">
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

              {task.parentTaskId && (
                <>
                  <div className="pr-2 text-sm text-gray-500">Parent task:</div>
                  <div className="flex items-center justify-center gap-2 text-lg">
                    {task.parentTask?.theme}{" "}
                    <Button
                      variant="outline"
                      onClick={() => {
                        if (task.parentTask?.id) {
                          router.push(`/tasks/${task.parentTask.id}`)
                        }
                      }}
                    >
                      <ChevronsRight />
                    </Button>
                  </div>
                </>
              )}

              {task.linkedTasks && task.linkedTasks.length > 0 && (
                <>
                  <div className="pr-2 text-sm text-gray-500">
                    Linked Task(s):
                  </div>
                  <div className="flex flex-col gap-2">
                    {task.linkedTasks.map((linkedTask) => (
                      <div
                        key={linkedTask.id}
                        className="flex items-center justify-between gap-2"
                      >
                        <div className="text-lg">{linkedTask.theme || "—"}</div>
                        <Button
                          variant="outline"
                          onClick={() => {
                            router.push(`/tasks/${linkedTask.id}`)
                          }}
                        >
                          <ChevronsRight />
                        </Button>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {task.transferToId && (
                <>
                  <div className="pr-2 text-sm text-gray-500">
                    Transfered to:
                  </div>
                  <div className="text-lg">
                    {users.find((u) => u.id === task.transferToId)?.name ||
                      "Unknown"}
                  </div>
                </>
              )}
            </div>
          </CardContent>

          <div className="mx-auto flex w-[80%] flex-row items-center justify-center gap-2">
            <FormTaskEditDialog
              task={task}
              clients={clients}
              onSuccess={fetchTask}
            />

            {user?.user.id && (
              <FormNewTaskDialog
                clients={clients}
                userId={user?.user.id}
                onSuccess={fetchTask}
                triggerLabel="Add Linked Task"
                parentTaskId={task.id}
              />
            )}

            <FormTaskTransferDialog
              taskId={task.id}
              onSuccess={fetchTask}
              triggerLabel="Transfer Task"
            />
          </div>
        </Card>
      </div>
    </main>
  )
}
