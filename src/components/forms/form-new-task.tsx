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
import type { Task, Client } from "@/types/entities"
import axiosApi from "@/lib/axios"
import { toast } from "sonner"
import { DialogDescription } from "@radix-ui/react-dialog"

type TaskEditFormFields = {
  theme?: string
  type: "CALL" | "MEET" | "EMAIL" | "OFFER" | "PRESENTATION"
  priority: "LOW" | "MEDIUM" | "HIGH"
  status: "OPEN" | "CLOSED"
  date: string
  contactPhone?: string
  contactEmail?: string
  contactPerson?: string
  address?: string
  urlLink?: string
  clientId?: string
  parentTaskId?: string
}

export default function FormNewTaskDialog({
  clients,
  userId,
  onSuccess,
  triggerLabel,
  parentTaskId,
}: {
  clients: Client[]
  userId: string
  onSuccess: (t: Task) => void
  triggerLabel?: string
  parentTaskId?: string
}) {
  const form = useForm<TaskEditFormFields>({
    defaultValues: {
      status: "OPEN",
      type: "CALL",
      priority: "HIGH",
      theme: "",
      date: new Date().toISOString().slice(0, 10),
      contactPhone: "",
      contactEmail: "",
      contactPerson: "",
      address: "",
      urlLink: "",
      clientId: "",
      parentTaskId: parentTaskId || undefined,
    },
  })

  const [isPending, startTransition] = useTransition()
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = (data: TaskEditFormFields) => {
    setError(null)
    startTransition(async () => {
      const payload = {
        ...data,
        createdById: userId,
        assignedToId: userId,
        parentTaskId: parentTaskId || undefined,
      }

      if (payload.date) {
        payload.date = new Date(payload.date).toISOString()
      }

      try {
        const res = await axiosApi.post(`/api/task/`, payload)
        onSuccess(res.data)
        toast.success("Task created successfully!")
        setOpen(false)
      } catch (err) {
        console.log("Task create error", err)
        setError("Failed to create task")
        toast.error("Failed to create task")
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="">
          {triggerLabel ?? "Add New Task"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Task</DialogTitle>
          {parentTaskId && (
            <DialogDescription className="mt-1 text-xs text-gray-500">
              Parent task ID: {parentTaskId}
            </DialogDescription>
          )}
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
            autoComplete="off"
          >
            <div className="flex flex-row items-center justify-between">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-500">Status</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Task status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="OPEN">OPEN</SelectItem>
                          <SelectItem value="CLOSED">CLOSED</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-500">Type</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Task type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CALL">CALL</SelectItem>
                          <SelectItem value="MEET">MEET</SelectItem>
                          <SelectItem value="EMAIL">EMAIL</SelectItem>
                          <SelectItem value="OFFER">OFFER</SelectItem>
                          <SelectItem value="PRESENTATION">
                            PRESENTATION
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-500">Priority</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Task priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="LOW">LOW</SelectItem>
                          <SelectItem value="MEDIUM">MEDIUM</SelectItem>
                          <SelectItem value="HIGH">HIGH</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="theme"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-500">Theme</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="clientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-500">Client</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ""}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select client" />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-500">Due Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contactPerson"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-500">
                    Contact Person
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-row gap-8">
              <FormField
                control={form.control}
                name="contactEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-500">
                      Contact Email
                    </FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contactPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-500">
                      Contact Phone
                    </FormLabel>
                    <FormControl>
                      <Input type="tel" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-500">Address</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="urlLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-500">T-con URL</FormLabel>
                  <FormControl>
                    <Input type="url" {...field} />
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
                {isPending ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
