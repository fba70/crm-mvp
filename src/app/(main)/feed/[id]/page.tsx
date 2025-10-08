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
import { Textarea } from "@/components/ui/textarea"
import { LikeButton } from "@/components/business/like-button"
import { StatusChangeDialog } from "@/components/business/feed-status-change"
import { AtSign, Phone } from "lucide-react"
import FormNewTaskIconDialog from "@/components/forms/form-new-task-icon"
import BookingRequestDialog from "@/components/forms/form-booking-request"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

export default function FeedItemPage() {
  const params = useParams()
  const { id } = params as { id: string }
  const { data: user, isPending } = useSession()
  const router = useRouter()

  const [feedItem, setFeed] = useState<Feed | null>(null)
  const [loading, setLoading] = useState(true)
  const [clients, setClients] = useState<Client[]>([])

  const [userPrompt, setUserPrompt] = useState("")
  const [response, setResponse] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const fetchClients = () => {
    axios.get("/api/client").then((res) => setClients(res.data))
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

  const handleOpenAICall = async () => {
    setIsLoading(true)
    setResponse("")

    try {
      const systemPromptClientActivity =
        "You are a helpful assistant providing insights for sales team members based on input from client activity feed." +
        "Client is:" +
        (feedItem?.client?.name ?? "No client provided.") +
        ".Client activity message is: " +
        (feedItem?.metadata ?? "No message provided.") +
        ". Provide concise and relevant suggestions or actions that a sales team member could take based on this activity. Keep the response under 100 words."

      const systemPromptIndustryInfo =
        "You are a helpful assistant providing insights for sales team members based on input from client activity feed." +
        "Client is:" +
        (feedItem?.client?.name ?? "No client provided.") +
        ".Client activity message is: " +
        (feedItem?.metadata ?? "No message provided.") +
        ". Provide concise and relevant suggestions or actions that a sales team member could take based on this activity. Keep the response under 100 words."

      const systemPromptRecommendations =
        "You are a helpful assistant providing insights for sales team members based on input from client activity feed." +
        "Client is:" +
        (feedItem?.client?.name ?? "No client provided.") +
        ".Client activity message is: " +
        (feedItem?.metadata ?? "No message provided.") +
        ". Provide concise and relevant suggestions or actions that a sales team member could take based on this activity. Keep the response under 100 words."

      let systemPrompt = ""

      if (feedItem?.type === "CLIENT_ACTIVITY") {
        systemPrompt = systemPromptClientActivity
      } else if (feedItem?.type === "INDUSTRY_INFO") {
        systemPrompt = systemPromptIndustryInfo
      } else if (feedItem?.type === "RECOMMENDATION") {
        systemPrompt = systemPromptRecommendations
      }

      const fullPrompt = `${systemPrompt}\n\nUser: ${userPrompt}`

      const res = await fetch("/api/openai/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: fullPrompt }),
      })

      if (!res.ok) {
        throw new Error("Failed to fetch OpenAI response")
      }

      const data = await res.json()
      // console.log("AI response:", data.result)
      setResponse(data.result.output_text)
    } catch (error) {
      console.error("Error calling OpenAI API:", error)
      setResponse("An error occurred while processing your request.")
    } finally {
      setIsLoading(false)
    }
  }

  if (loading) return <FeedItemLoading />
  if (!feedItem) {
    notFound()
  }
  if (!user && !isPending) {
    unauthorized()
  }

  // console.log("AI response text:", response)
  // console.log("Feed Item:", feedItem)
  // key={feedItem.id}

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col px-0 pt-5">
      <div className="flex justify-between">
        <div className="flex w-[95%] flex-row items-center justify-between gap-2">
          <h1 className="ml-6 text-2xl font-semibold">Feed Item</h1>
          <RouteButton pathParam="/feed" nameParam="Go back to feed list" />
        </div>
      </div>

      <div className="max-h-190 overflow-y-auto">
        <Card className="mx-auto mt-6 flex w-[95%] flex-col py-4">
          <CardContent className="flex flex-col gap-2 px-5 py-0">
            <div className="flex flex-row items-center justify-between gap-2">
              <div className="flex flex-row items-center justify-center gap-2">
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

            <div className="flex flex-row items-center justify-start gap-3">
              <span className="w-[60px] text-sm text-gray-400">Assistant:</span>
              <span className="block max-h-20 overflow-y-auto text-sm">
                {feedItem.feedback || "No message"}
              </span>
            </div>

            <div className="flex flex-row items-center justify-between gap-2">
              <div className="flex flex-row items-center justify-start gap-3">
                <span className="w-[60px] text-sm text-gray-400">Actions:</span>
                {feedItem.actionCall && (
                  <a
                    href={`tel:${feedItem?.client?.phone ?? ""}`}
                    onClick={(e) => {
                      if (!feedItem?.client?.phone) e.preventDefault()
                    }}
                  >
                    <Button variant="outline">
                      <Phone size={24} />
                    </Button>
                  </a>
                )}

                {feedItem.actionEmail && (
                  <a
                    href={`mailto:${feedItem?.client?.email ?? ""}`}
                    onClick={(e) => {
                      if (!feedItem?.client?.email) e.preventDefault()
                    }}
                  >
                    <Button variant="outline">
                      <AtSign size={24} />
                    </Button>
                  </a>
                )}

                {feedItem.actionBooking && (
                  <BookingRequestDialog
                    feedId={feedItem.id}
                    onSuccess={() => {}}
                  />
                )}

                {user &&
                  !feedItem.taskId &&
                  feedItem.actionTask &&
                  feedItem.type !== "COLLEAGUES_UPDATE" && (
                    <FormNewTaskIconDialog
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

                {feedItem.type === "COLLEAGUES_UPDATE" && (
                  <LikeButton feedId={feedItem.id} />
                )}
              </div>

              <StatusChangeDialog
                feedId={feedItem.id}
                currentStatus={feedItem.status}
                onStatusChange={(newStatus) => {
                  setFeed((prevFeedItem) => {
                    if (!prevFeedItem) {
                      console.error(
                        "Previous feed item is null or undefined...",
                      )
                      return null
                    }
                    return { ...prevFeedItem, status: newStatus }
                  })
                }}
              />
            </div>
          </CardContent>
        </Card>

        {(feedItem.type === "RECOMMENDATION" ||
          feedItem.type === "CLIENT_ACTIVITY" ||
          feedItem.type === "INDUSTRY_INFO") && (
          <Card className="mx-auto mt-4 flex w-[95%] flex-col py-4">
            <CardContent className="flex flex-col gap-2 px-5 py-0">
              <p className="text-sm text-gray-500">
                You can ask AI-assistant to provide inputs and recommendations
                within the context of the client activity event. Please specify
                your request to AI-assistant here:
              </p>

              <Textarea
                className="w-full rounded-md border border-gray-300 p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                rows={4}
                placeholder="Enter your request details here..."
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
              />
              <Button
                variant="default"
                className="mt-2"
                onClick={handleOpenAICall}
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Submit Request"}
              </Button>
              {response && (
                <div className="mt-3 rounded-md border border-gray-300 p-3">
                  <p className="text-sm text-gray-700">
                    AI-assistant response:
                  </p>
                  <p className="text-sm text-gray-900">{response}</p>
                  <Button
                    variant="default"
                    className="mt-3 w-full"
                    onClick={async () => {
                      try {
                        await axios.patch(`/api/feed/${feedItem.id}`, {
                          feedback: response,
                        })
                        toast.success(
                          "Recommendation saved successfully to the feed item!",
                        )
                      } catch (error) {
                        console.error("Failed to save recommendation", error)
                        toast.error(
                          "Failed to save recommendation. Please try again.",
                        )
                      }
                    }}
                  >
                    Save Recommendation
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  )
}
