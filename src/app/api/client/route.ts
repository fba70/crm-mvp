import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "@/lib/get-session"

export async function GET() {
  const session = await getServerSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const clients = await prisma.client.findMany({
      orderBy: { name: "asc" },
    })
    return NextResponse.json(clients)
  } catch (error) {
    console.error("Error fetching clients:", error)
    return NextResponse.json(
      { error: "Failed to fetch clients" },
      { status: 500 },
    )
  }
}
