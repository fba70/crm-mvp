import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UserAvatar } from "@/components/user-avatar"
import { format } from "date-fns"
import {
  CalendarDaysIcon,
  MailIcon,
  ShieldIcon,
  UserIcon,
  ClipboardList,
} from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"
import BudgetCharts from "@/components/business/budget-charts"
import { getServerSession } from "@/lib/get-session"
import { unauthorized } from "next/navigation"
import { User } from "@/lib/auth"
import type { Task } from "@/types/task-client"
import prisma from "@/lib/prisma"

export const metadata: Metadata = {
  title: "Dashboard",
}

export default async function DashboardPage() {
  const session = await getServerSession()
  const user = session?.user

  // console.log("USER", user)

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

  // console.log("TASKS", tasks)

  // 1. Total number of tasks
  const totalNumberOfTasks = tasks.length

  // 2. Number of overdue tasks (today > task.date)
  const now = new Date()
  const numberOfOverdueTasks = tasks.filter((task) => {
    if (!task.date) return false

    return task.date && new Date(task.date) < now
  }).length

  // 3. Number of tasks due soon (today < date && today > date - 3 days)
  const becomesUrgent = new Date(now)
  becomesUrgent.setDate(now.getDate() + 3)

  const numberOfDueSoonTasks = tasks.filter((task) => {
    if (!task.date) return false

    const taskDate = new Date(task.date)
    return taskDate > now && taskDate <= becomesUrgent
  }).length

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6">
      <div className="space-y-3">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">User Dashboard</h1>
        </div>

        {user.emailVerified ? null : <EmailVerificationAlert />}
        <ProfileInformation user={user} />
        <TasksSummary
          totalNumberOfTasks={totalNumberOfTasks}
          numberOfUrgentTasks={numberOfDueSoonTasks}
          numberOfOverdueTasks={numberOfOverdueTasks}
        />
        <BudgetCharts />
      </div>
    </main>
  )
}

interface ProfileInformationProps {
  user: User
}

function ProfileInformation({ user }: ProfileInformationProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserIcon size={24} />
          Profile Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-row gap-6 sm:flex-row sm:items-start">
          <div className="flex flex-col items-center gap-3">
            <UserAvatar
              name={user.name}
              image={user.image}
              className="size-16 sm:size-16"
            />
            {user.role && (
              <Badge>
                <ShieldIcon size={16} />
                {user.role}
              </Badge>
            )}
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <h3 className="text-xl font-semibold capitalize">{user.name}</h3>
              <p className="text-muted-foreground">{user.email}</p>
            </div>

            <div className="flex flex-row items-center justify-between gap-4">
              <div>
                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                  <CalendarDaysIcon size={18} />
                  User Since
                </div>
                <p className="font-medium">
                  {format(user.createdAt, "MMMM d, yyyy")}
                </p>
              </div>
              <Button variant="default" asChild>
                <Link href="/profile">Edit Profile</Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function TasksSummary({
  totalNumberOfTasks,
  numberOfUrgentTasks,
  numberOfOverdueTasks,
}: {
  totalNumberOfTasks: number
  numberOfUrgentTasks: number
  numberOfOverdueTasks: number
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClipboardList size={24} />
          Tasks Summary Information
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-row gap-2 sm:items-start">
          <div className="flex flex-row gap-3 sm:items-start">
            <p>
              <span className="text-sm text-gray-400">Total:</span>
              <span className="pl-1 text-2xl text-blue-600">
                {totalNumberOfTasks}
              </span>
            </p>
            <p>
              <span className="text-sm text-gray-400">Urgent:</span>
              <span className="pl-1 text-2xl text-orange-400">
                {numberOfUrgentTasks}
              </span>
            </p>
            <p>
              <span className="text-sm text-gray-400">Overdue:</span>
              <span className="pl-1 text-2xl text-red-600">
                {numberOfOverdueTasks}
              </span>
            </p>
          </div>

          <Button className="ml-auto" asChild>
            <Link href="/tasks">View Tasks</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function EmailVerificationAlert() {
  return (
    <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800/50 dark:bg-yellow-950/30">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MailIcon className="size-5 text-yellow-600 dark:text-yellow-400" />
          <span className="text-yellow-800 dark:text-yellow-200">
            Please verify your email address to access all features.
          </span>
        </div>
        <Button size="sm" asChild>
          <Link href="/verify-email">Verify Email</Link>
        </Button>
      </div>
    </div>
  )
}
