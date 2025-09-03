import { CalendarCheck } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"
import { UserDropdown } from "@/components/user-dropdown"
import Link from "next/link"
import { getServerSession } from "@/lib/get-session"
import { unauthorized } from "next/navigation"

export async function Navbar() {
  const session = await getServerSession()
  const user = session?.user

  // console.log("Navbar user:", user)

  if (!user) {
    unauthorized()
  }

  return (
    <header className="bg-background border-b">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-semibold"
        >
          <CalendarCheck size={32} />
          CRM MVP APP
        </Link>
        <div className="flex items-center gap-2">
          <ModeToggle />
          <UserDropdown user={user} />
        </div>
      </div>
    </header>
  )
}
