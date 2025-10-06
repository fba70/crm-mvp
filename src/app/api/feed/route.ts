import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "@/lib/get-session"

export async function GET() {
  const session = await getServerSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const feed = await prisma.feed.findMany({
    include: {
      client: true,
    },
  })

  return NextResponse.json(feed)
}
