import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
import { getServerSession } from "@/lib/get-session"
import { unauthorized } from "next/navigation"
import { User } from "@/lib/auth"

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

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here&apos;s your account overview.
          </p>
        </div>

        {user.emailVerified ? null : <EmailVerificationAlert />}
        <ProfileInformation user={user} />
        <TasksSummary />
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
          <UserIcon className="size-5" />
          Profile Information
        </CardTitle>
        <CardDescription>
          Your account details and current status
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-row gap-6 sm:flex-row sm:items-start">
          <div className="flex flex-col items-center gap-3">
            <UserAvatar
              name={user.name}
              image={user.image}
              className="size-18 sm:size-18"
            />
            {user.role && (
              <Badge>
                <ShieldIcon className="size-3" />
                {user.role}
              </Badge>
            )}
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <h3 className="text-2xl font-semibold">{user.name}</h3>
              <p className="text-muted-foreground">{user.email}</p>
            </div>

            <div className="space-y-2">
              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <CalendarDaysIcon className="size-4" />
                Member Since
              </div>
              <p className="font-medium">
                {format(user.createdAt, "MMMM d, yyyy")}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function TasksSummary() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClipboardList />
          Tasks Summary Information
        </CardTitle>
        <CardDescription>Your tasks main statistics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex-crow flex gap-4 sm:flex-row sm:items-start">
          <p>
            Total: <span className="pl-2 text-2xl text-blue-600">10</span>
          </p>
          <p>
            Urgent: <span className="pl-2 text-2xl text-orange-400">3</span>
          </p>
          <p>
            Overdue: <span className="pl-2 text-2xl text-red-600">2</span>
          </p>
        </div>

        <Button className="mt-6" asChild>
          <Link href="/tasks">View All Tasks</Link>
        </Button>
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
