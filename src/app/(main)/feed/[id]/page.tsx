"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useSession } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import axios from "axios"
import RouteButton from "@/components/business/route-button"
import FeedItemLoading from "./loading"
import { unauthorized, notFound } from "next/navigation"
import type { Feed, Client } from "@/types/task-client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LikeButton } from "@/components/business/like-button"
import { StatusChangeDialog } from "@/components/business/feed-status-change"
import { MapPinHouse, AtSign, Phone, CalendarCheck } from "lucide-react"
import FormNewTaskDialog from "@/components/forms/form-new-task"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import axiosApi from "@/lib/axios"

export default function FeedItemPage() {
  const params = useParams()
  const { id } = params as { id: string }
  const { data: user, isPending } = useSession()
  const router = useRouter()

  const [feedItem, setFeed] = useState<Feed | null>(null)
  const [loading, setLoading] = useState(true)
  const [clients, setClients] = useState<Client[]>([])

  const fetchClients = () => {
    axiosApi.get("/api/client").then((res) => setClients(res.data))
  }

  useEffect(() => {
    fetchClients()
  }, [])

  useEffect(() => {
    const fetchFeedItem = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`/api/feed/${id}`)
        setFeed(response.data)
      } catch (error) {
        console.error("Failed to fetch feed item", error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeedItem()
  }, [id])

  if (loading) return <FeedItemLoading />
  if (!feedItem) {
    notFound()
  }
  if (!user && !isPending) {
    unauthorized()
  }

  // console.log("Feed Item:", feedItem)

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col px-0 pt-5">
      <div className="flex justify-between">
        <div className="flex w-[95%] flex-row items-center justify-between gap-2">
          <h1 className="ml-6 text-2xl font-semibold">Feed Item</h1>
          <RouteButton pathParam="/feed" nameParam="Go back to feed list" />
        </div>
      </div>

      <Card
        key={feedItem.id}
        className="mx-auto mt-6 flex w-[95%] flex-col py-4"
      >
        <CardContent className="flex flex-col gap-2 px-5 py-0">
          <div className="flex flex-row items-center justify-between gap-2">
            <div className="rounded-xl border-1 border-gray-300 px-2 py-1 text-xs">
              {feedItem.type.replace(/_/g, " ")}
            </div>

            <div
              className={cn(
                "rounded-xl border-1 border-gray-300 px-2 py-1 text-xs",
                feedItem.status === "CANCELLED" && "text-gray-500",
                feedItem.status === "IN_PROGRESS" && "text-blue-500",
                feedItem.status === "ACTION_COMPLETED" && "text-green-400",
                feedItem.status === "CLOSED" && "text-green-700",
                feedItem.status === "NEW" && "text-orange-500",
              )}
            >
              {feedItem.status
                .replace(/_/g, " ")
                .replace("ACTION COMPLETED", "ACTION OK")}
            </div>

            <div className="flex flex-row items-center justify-start gap-3 text-xs text-gray-500">
              {format(new Date(feedItem.createdAt), "yyyy-MM-dd")}
            </div>
          </div>

          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center justify-start gap-3">
              <span className="w-[60px] text-sm text-gray-400">Client:</span>
              {feedItem.client ? (
                <span>{feedItem.client.name || "—"}</span>
              ) : (
                <span>No client</span>
              )}
            </div>

            {feedItem.taskId && (
              <Button
                variant="link"
                onClick={() => {
                  if (feedItem.taskId) {
                    router.push(`/tasks/${feedItem.taskId}`)
                  }
                }}
              >
                TASK
              </Button>
            )}
          </div>

          <div className="flex flex-row items-center justify-start gap-3">
            <span className="w-[60px] text-sm text-gray-400">Message:</span>
            <span>{feedItem.metadata || "No message"}</span>
          </div>

          <div className="flex flex-row items-center justify-between gap-2">
            <div className="flex flex-row items-center justify-start gap-3">
              <span className="w-[60px] text-sm text-gray-400">Actions:</span>
              {feedItem.actionCall && <Phone size={24} />}
              {feedItem.actionEmail && <AtSign size={24} />}
              {feedItem.actionBooking && <MapPinHouse size={24} />}
              {!feedItem.taskId && feedItem.actionTask && (
                <CalendarCheck size={24} />
              )}
              {feedItem.type === "COLLEAGUES_UPDATE" && (
                <LikeButton feedId={feedItem.id} />
              )}
            </div>

            {user &&
              !feedItem.taskId &&
              feedItem.type !== "COLLEAGUES_UPDATE" && (
                <FormNewTaskDialog
                  clients={
                    feedItem.clientId
                      ? clients.filter(
                          (client) => client.id === feedItem.clientId,
                        )
                      : clients
                  }
                  userId={user?.user.id}
                  onSuccess={() => {}}
                />
              )}

            <StatusChangeDialog
              feedId={feedItem.id}
              currentStatus={feedItem.status}
              onStatusChange={(newStatus) => {
                setFeed((prevFeedItem) => {
                  if (!prevFeedItem) {
                    console.error("Previous feed item is null or undefined...")
                    return null
                  }
                  return { ...prevFeedItem, status: newStatus }
                })
              }}
            />
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
