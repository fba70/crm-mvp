import { useState, useEffect } from "react"
import axiosApi from "@/lib/axios"
import { ThumbsUp } from "lucide-react"

export function LikeButton({ feedId }: { feedId: string }) {
  const [likeCount, setLikeCount] = useState<number | null>(null)
  const [isLiking, setIsLiking] = useState(false)

  // Fetch the initial like count when the component mounts
  useEffect(() => {
    const fetchLikeCount = async () => {
      try {
        const response = await axiosApi.get(`/api/feed/${feedId}/like`)
        setLikeCount(response.data.likeCount)
      } catch (error) {
        console.error("Error fetching like count:", error)
      }
    }

    fetchLikeCount()
  }, [feedId])

  const handleLike = async () => {
    setIsLiking(true)
    try {
      // Post a like
      await axiosApi.post(`/api/feed/${feedId}/like`)
      // Fetch the updated like count
      const response = await axiosApi.get(`/api/feed/${feedId}/like`)
      setLikeCount(response.data.likeCount)
    } catch (error) {
      console.error("Error liking the feed item:", error)
    } finally {
      setIsLiking(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleLike}
        disabled={isLiking}
        className="flex items-center gap-1 text-blue-500 hover:text-blue-700 disabled:opacity-50"
      >
        <ThumbsUp className="text-green-500" />
        {isLiking ? (
          <span className="text-sm">Liking...</span>
        ) : (
          <span className="text-sm text-green-600">Like</span>
        )}
      </button>
      {likeCount !== null && (
        <span className="text-sm text-green-600">({likeCount} likes)</span>
      )}
    </div>
  )
}
