import type { Metadata } from "next"
import { getServerSession } from "@/lib/get-session"
import { unauthorized } from "next/navigation"
import { TasksCarousel } from "@/components/business/carousel"
import type { Task } from "@/types/task-client"
import prisma from "@/lib/prisma"

export const metadata: Metadata = {
  title: "Tasks",
}

export default async function TasksPage() {
  const session = await getServerSession()
  const user = session?.user

  if (!user) {
    unauthorized()
  }

  const tasks: Task[] = await prisma.task.findMany({
    where: {
      OR: [{ createdById: user.id }, { assignedToId: user.id }],
    },
    include: {
      client: true,
      createdBy: true,
      assignedTo: true,
    },
  })

  // console.log("USER", user)
  // console.log("TASKS", tasks)

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col px-0 pt-5">
      <div className="space-y-6">
        <div className="space-y-2 px-4">
          <h1 className="text-2xl font-semibold">Tasks</h1>
        </div>

        <main className="flex flex-1 flex-col">
          <TasksCarousel tasks={tasks} />
        </main>
      </div>
    </main>
  )
}
