"use client"
import { useForm } from "react-hook-form"
import { useTransition, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { TicketsPlane } from "lucide-react"
import type { Feed } from "@/types/task-client"
import axios from "axios"
import { toast } from "sonner"

type BookingRequestFormFields = {
  travellersNumber: number
  datesFrom: string
  datesTo: string
  country: string
  city: string
  travelOption: string
  isHotelRequired: boolean
  otherPreferences: string
}

export default function BookingRequestDialog({
  feedId,
  onSuccess,
}: {
  feedId: string
  onSuccess: (t: Feed) => void
}) {
  const form = useForm<BookingRequestFormFields>({
    defaultValues: {
      travellersNumber: 1,
      datesFrom: "",
      datesTo: "",
      country: "Austria",
      city: "",
      travelOption: "Plane",
      isHotelRequired: false,
      otherPreferences: "",
    },
  })

  const [isPending, startTransition] = useTransition()
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = (data: BookingRequestFormFields) => {
    setError(null)
    startTransition(async () => {
      const payload = {
        ...data,
      }

      // Assemble prompt
      // Call openAI to emulate booking request answer in a structured format
      // Save the result to the feed item as below

      try {
        const res = await axios.patch(`/api/feed/${feedId}`, payload)
        onSuccess(res.data)
        setOpen(false)
        toast.success("Booking options are saved!")
      } catch (err) {
        console.log("Client create error", err)
        setError("Failed to create client")
        toast.error("Failed to save booking options")
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="">
          <TicketsPlane />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Booking Request Form</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
            autoComplete="off"
          >
            <div className="flex flex-row items-center justify-between gap-2">
              <FormField
                control={form.control}
                name="travellersNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-500">
                      Number of Travellers
                    </FormLabel>
                    <FormControl>
                      <Input {...field} className="w-[50px]" type="number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="travelOption"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-500">
                      Travel Options
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value || "plane"}
                      >
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="Select travel options" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Plane">Plane</SelectItem>
                          <SelectItem value="Train">Train</SelectItem>
                          <SelectItem value="Car">Car</SelectItem>
                          <SelectItem value="Taxi">Taxi</SelectItem>
                          <SelectItem value="Public Transport">
                            Public Transport
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-row items-center justify-between gap-2">
              <FormField
                control={form.control}
                name="datesFrom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-500">Date From</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="datesTo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-500">Date To</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-500">
                    Destination Country
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-500">
                    Destination City
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isHotelRequired"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        id="isHotelRequired"
                      />
                      <FormLabel
                        htmlFor="isHotelRequired"
                        className="text-gray-500"
                      >
                        Is Hotel Required?
                      </FormLabel>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="otherPreferences"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-500">
                    Other Preferences
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Provide any other preferences"
                      className="resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && <div className="text-sm text-red-500">{error}</div>}

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
