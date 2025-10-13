"use client"

import { useState, useEffect } from "react"
import { useSession } from "@/lib/auth-client"
import { unauthorized } from "next/navigation"
import { TasksCarousel } from "@/components/business/carousel"
import type { Task, Client } from "@/types/entities"
import FormNewTaskDialog from "@/components/forms/form-new-task"
import axiosApi from "@/lib/axios"
import TasksLoading from "./loading"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

export default function TasksPage() {
  const { data: user, isPending } = useSession()

  if (!user && !isPending) {
    unauthorized()
  }

  const [tasks, setTasks] = useState<Task[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [clients, setClients] = useState<Client[]>([])
  const [clientsLoading, setClientsLoading] = useState(true)
  const [typeFilter, setTypeFilter] = useState<string>("ALL")
  const [clientNameFilter, setClientNameFilter] = useState("")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [priorityFilter, setPriorityFilter] = useState<string>("ALL")
  const [showClosed, setShowClosed] = useState(false)

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

  const filteredTasks = tasks
    ?.filter(
      (task) =>
        task.status !== "DELETED" && // Exclude deleted tasks
        (showClosed || task.status !== "CLOSED") && // Only include CLOSED if checked
        (typeFilter === "ALL" || task.type === typeFilter) &&
        (priorityFilter === "ALL" || task.priority === priorityFilter) &&
        (clientNameFilter === "" ||
          (task.client?.name ?? "")
            .toLowerCase()
            .includes(clientNameFilter.toLowerCase())),
    )
    ?.sort((a, b) =>
      sortOrder === "asc"
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )

  if (loading || clientsLoading) return <TasksLoading />

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col px-0 pt-5">
      <div className="space-y-6">
        <div className="flex flex-row justify-between px-4">
          <h1 className="pl-2 text-2xl font-semibold">Tasks</h1>
          {user && (
            <FormNewTaskDialog
              clients={clients}
              userId={user?.user.id}
              onSuccess={() => fetchTasks()}
              triggerLabel="Add New Task"
            />
          )}
        </div>

        <div className="mb-3 flex flex-row items-center justify-between gap-4 px-6">
          <Input
            type="text"
            placeholder="Filter by client name..."
            value={clientNameFilter}
            onChange={(e) => setClientNameFilter(e.target.value)}
            className="w-[220px]"
          />

          <div className="flex items-center gap-2">
            <Checkbox
              id="show-closed"
              checked={showClosed}
              onCheckedChange={(v) => setShowClosed(Boolean(v))}
            />
            <label htmlFor="show-closed" className="text-sm">
              include closed tasks
            </label>
          </div>
        </div>

        <div className="mb-4 flex flex-row items-center justify-between gap-4 px-6">
          <Select
            value={sortOrder}
            onValueChange={(v) => setSortOrder(v as "asc" | "desc")}
          >
            <SelectTrigger className="w-auto">
              <SelectValue placeholder="Sort by date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">New first</SelectItem>
              <SelectItem value="asc">Old first</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-auto">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Types</SelectItem>
              <SelectItem value="CALL">Call</SelectItem>
              <SelectItem value="MEET">Meet</SelectItem>
              <SelectItem value="EMAIL">Email</SelectItem>
              <SelectItem value="OFFER">Offer</SelectItem>
              <SelectItem value="PRESENTATION">Presentation</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="All Priorities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Priorities</SelectItem>
              <SelectItem value="HIGH">High</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="LOW">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <main className="flex flex-1 flex-col">
          {tasks && <TasksCarousel tasks={filteredTasks ?? []} />}
        </main>
      </div>
    </main>
  )
}
