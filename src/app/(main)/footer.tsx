import Link from "next/link"

export function Footer() {
  return (
    <footer className="flex h-[50px] flex-row items-center justify-center border-t bg-gray-600 text-white">
      <div className="flex max-w-6xl items-center justify-between px-4 py-3">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-semibold"
        >
          AUFGABEN
        </Link>
      </div>

      <div className="flex max-w-6xl items-center justify-between px-4 py-3">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-semibold"
        >
          FEED
        </Link>
      </div>

      <div className="flex max-w-6xl items-center justify-between px-4 py-3">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-semibold"
        >
          KUNDEN
        </Link>
      </div>

      <div className="flex max-w-6xl items-center justify-between px-4 py-3">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-semibold"
        >
          ÜBERGABE
        </Link>
      </div>
    </footer>
  )
}
