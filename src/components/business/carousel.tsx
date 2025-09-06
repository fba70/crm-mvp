"use client"

import { useState, useEffect } from "react"
import { ChevronDown, ChevronUp, Mail, Phone, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Task } from "@/types/task-client"
import { format } from "date-fns"

export function TasksCarousel({ tasks }: { tasks: Task[] }) {
  const [currentIndex, setCurrentIndex] = useState(2)
  const [isScrolling, setIsScrolling] = useState(false)

  const handleScroll = (direction: "up" | "down") => {
    if (isScrolling) return

    setIsScrolling(true)

    if (direction === "down" && currentIndex < tasks.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else if (direction === "up" && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }

    setTimeout(() => setIsScrolling(false), 600)
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") handleScroll("down")
      if (e.key === "ArrowUp") handleScroll("up")
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [currentIndex, isScrolling])

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      if (e.deltaY > 0) {
        handleScroll("down")
      } else {
        handleScroll("up")
      }
    }

    const container = document.getElementById("carousel-scroll-container")
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false })
    }
    return () => {
      if (container) {
        container.removeEventListener("wheel", handleWheel)
      }
    }
  }, [isScrolling, currentIndex])

  const getCardPosition = (index: number) => {
    const diff = index - currentIndex
    const baseY = diff * 120
    const curve = Math.abs(diff) * 30
    const scale = diff === 0 ? 1 : Math.max(0.7, 1 - Math.abs(diff) * 0.15)
    const opacity = Math.max(0.3, 1 - Math.abs(diff) * 0.3)
    const blur = Math.abs(diff) * 2

    return {
      transform: `translateY(${baseY}px) translateX(${curve}px) scale(${scale})`,
      opacity,
      filter: `blur(${blur}px)`,
      zIndex: 10 - Math.abs(diff),
    }
  }

  const renderStars = (priority: string) => {
    const count =
      priority === "HIGH"
        ? 3
        : priority === "MEDIUM"
          ? 2
          : priority === "LOW"
            ? 1
            : 0

    return Array.from({ length: 3 }, (_, i) => (
      <span
        key={i}
        className={`text-2xl ${i < count ? "text-red-500" : "text-gray-300"}`}
      >
        ★
      </span>
    ))
  }

  const getTaskBgColor = (date?: string | Date | null) => {
    if (!date) return "bg-gray-200"
    const now = new Date()
    const taskDate = new Date(date)
    const threeDaysFromNow = new Date(now)
    threeDaysFromNow.setDate(now.getDate() + 3)

    if (now >= taskDate) {
      return "bg-red-300"
    } else if (taskDate <= threeDaysFromNow) {
      return "bg-yellow-300"
    } else {
      return "bg-green-300"
    }
  }

  return (
    <div className="relative h-[80vh] w-full overflow-hidden bg-gradient-to-t from-white to-gray-200">
      {/* Header Controls */}
      <div className="absolute top-6 right-6 left-6 z-20 flex items-center justify-between">
        <div className="flex gap-4">
          <Button variant="outline" className="bg-white/80 backdrop-blur-sm">
            SORTIEREN <X className="ml-2 h-4 w-4" />
          </Button>
          <Button variant="outline" className="bg-white/80 backdrop-blur-sm">
            FILTERN <X className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-green-500 font-bold text-white">
          1
          <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-xs text-white">
            1
          </div>
        </div>
      </div>

      {/* Carousel Container */}
      <div className="relative flex h-full w-full items-center justify-center">
        {/* Progress Ring for Center Card */}
        {currentIndex >= 0 && currentIndex < tasks.length && (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
            <div className="relative h-80 w-80 rounded-full border-4 border-gray-300">
              <div
                className="absolute inset-0 rounded-full border-5 border-blue-400"
                style={{
                  clipPath: "polygon(0 0, 25% 0, 25% 100%, 0 100%)",
                  transform: "rotate(-90deg)",
                }}
              />
            </div>
          </div>
        )}

        {/* Task Cards */}
        {tasks.map((card, index) => (
          <div
            key={card.id}
            className="absolute flex h-64 w-64 cursor-pointer flex-col items-center justify-center rounded-full text-center transition-all duration-500 ease-out"
            style={getCardPosition(index)}
            onClick={() => !isScrolling && setCurrentIndex(index)}
          >
            <div
              className={`flex h-full w-full flex-col items-center justify-center rounded-full p-6 shadow-lg ${getTaskBgColor(card.date)}`}
            >
              <div className="mb-4">{renderStars(card.priority)}</div>
              <h3 className="mb-1 text-xl font-bold text-gray-700">
                {card.type}
              </h3>
              {card.client?.name && (
                <h4 className="mb-4 text-lg font-semibold text-gray-600">
                  {card.client.name}
                </h4>
              )}
              {card.date && (
                <p className="text-sm font-medium text-gray-500">
                  {format(new Date(card.date), "dd.MM.yyyy")}
                </p>
              )}
            </div>
          </div>
        ))}

        {/* Action Buttons for Center Card */}
        {currentIndex >= 0 && currentIndex < tasks.length && (
          <>
            <Button
              size="lg"
              variant="outline"
              className="absolute top-1/2 left-2 z-15 h-16 w-16 -translate-y-1/2 rounded-full border-2 bg-white/90 backdrop-blur-sm transition-transform hover:scale-110"
            >
              <Mail className="h-8 w-8" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="absolute bottom-1/3 left-2 z-15 h-16 w-16 rounded-full border-2 bg-white/90 backdrop-blur-sm transition-transform hover:scale-110"
            >
              <Phone className="h-8 w-8" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="absolute top-1/2 right-2 z-15 h-16 w-16 -translate-y-1/2 rounded-full border-2 bg-white/90 backdrop-blur-sm transition-transform hover:scale-110"
            >
              <Check className="h-8 w-8" />
            </Button>
          </>
        )}

        {/* Scroll Indicator */}
        <Button
          variant="ghost"
          size="lg"
          className="absolute bottom-8 left-1/3 z-20 h-12 w-12 -translate-x-1/2 animate-bounce rounded-full bg-white/80 backdrop-blur-sm"
          onClick={() => handleScroll("down")}
          disabled={currentIndex >= tasks.length - 1}
        >
          <ChevronDown className="h-6 w-6" />
        </Button>

        <Button
          variant="ghost"
          size="lg"
          className="absolute bottom-8 left-2/3 z-20 h-12 w-12 -translate-x-1/2 animate-bounce rounded-full bg-white/80 backdrop-blur-sm"
          onClick={() => handleScroll("up")}
          disabled={currentIndex >= 0 && currentIndex <= 0}
        >
          <ChevronUp className="h-6 w-6" />
        </Button>
      </div>

      {/* Touch/Scroll Controls */}
      <div
        id="carousel-scroll-container"
        className="absolute inset-0 z-10"
        onTouchStart={(e) => {
          const touch = e.touches[0]
          const startY = touch.clientY

          const handleTouchMove = (moveEvent: TouchEvent) => {
            const currentY = moveEvent.touches[0].clientY
            const diff = startY - currentY

            if (Math.abs(diff) > 50) {
              if (diff > 0) {
                handleScroll("down")
              } else {
                handleScroll("up")
              }
              document.removeEventListener("touchmove", handleTouchMove)
            }
          }

          document.addEventListener("touchmove", handleTouchMove)
          document.addEventListener(
            "touchend",
            () => {
              document.removeEventListener("touchmove", handleTouchMove)
            },
            { once: true },
          )
        }}
      />
    </div>
  )
}
