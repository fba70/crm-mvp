import { CalendarCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <main className="flex min-h-svh items-center justify-center px-4">
      <div className="mx-auto max-w-3xl text-center">
        <div className="mb-8 flex items-center justify-center gap-4">
          <CalendarCheck size={128} />
        </div>
        <h1 className="mb-16 text-3xl font-semibold sm:text-4xl">
          CRM MVP APP
        </h1>
        <div className="mx-auto mt-6 flex max-w-sm flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild>
            <Link href="/sign-in">Sign In</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/sign-up">Sign Up</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
