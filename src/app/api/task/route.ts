import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "@/lib/get-session"

export async function GET(req: NextRequest) {
  const session = await getServerSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const sessionUserId = session.user.id
  const urlUserId = req.nextUrl.searchParams.get("userId")

  if (!urlUserId || urlUserId !== sessionUserId) {
    return NextResponse.json(
      { error: "Forbidden: user mismatch" },
      { status: 403 },
    )
  }

  const tasks = await prisma.task.findMany({
    where: {
      OR: [{ createdById: urlUserId }, { assignedToId: urlUserId }],
    },
    include: {
      client: true,
      createdBy: true,
      assignedTo: true,
    },
  })

  return NextResponse.json(tasks)
}
