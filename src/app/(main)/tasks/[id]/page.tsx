import type { Metadata } from "next"
import { getServerSession } from "@/lib/get-session"
import { unauthorized, notFound } from "next/navigation"
import type { Task } from "@/types/task-client"
import prisma from "@/lib/prisma"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import RouteButton from "@/components/business/route-button"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

export const metadata: Metadata = {
  title: "Tasks",
}

export default async function TaskPage({ params }: { params: { id: string } }) {
  const session = await getServerSession()
  const user = session?.user

  if (!user) {
    unauthorized()
  }

  const { id } = await params

  const task: Task | null = await prisma.task.findUnique({
    where: { id },
    include: {
      client: true,
      createdBy: true,
      assignedTo: true,
    },
  })

  if (!task) {
    notFound()
  }

  // console.log("USER", user)
  // console.log("TASKS", tasks)

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
          <Button variant="default" className="mx-auto w-[80%]">
            Edit Task
          </Button>
        </Card>
      </div>
    </main>
  )
}
