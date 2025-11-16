"use client"

import { useEffect, useState, useTransition } from "react"
import { useForm, useWatch } from "react-hook-form"
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
import type { Task, Client, Contact } from "@/types/entities"
import axiosApi from "@/lib/axios"
import { toast } from "sonner"

type TaskEditFormFields = {
  theme?: string
  type: "CALL" | "MEET" | "EMAIL" | "OFFER" | "PRESENTATION"
  priority: "LOW" | "MEDIUM" | "HIGH"
  status: "OPEN" | "CLOSED" | "DELETED"
  date: string
  contactPhone?: string
  contactEmail?: string
  contactPerson?: string
  address?: string
  urlLink?: string
  statusChangeReason?: string
  clientId?: string
  contactId?: string
}

export default function FormTaskEditDialog({
  task,
  clients,
  contacts,
  onSuccess,
  triggerLabel = "Edit Task",
}: {
  task: Task
  clients: Client[]
  contacts: Contact[]
  onSuccess: (t: Task) => void
  triggerLabel?: string
}) {
  const form = useForm<TaskEditFormFields>({
    defaultValues: {
      status: task.status,
      type: task.type,
      priority: task.priority,
      theme: task.theme || undefined,
      date: task.date
        ? typeof task.date === "string"
          ? task.date.slice(0, 10)
          : new Date(task.date).toISOString().slice(0, 10)
        : "",
      contactPhone: task.contactPhone || "",
      contactEmail: task.contactEmail || "",
      contactPerson: task.contactPerson || "",
      address: task.address || "",
      urlLink: task.urlLink || "",
      statusChangeReason: task.statusChangeReason || "",
      clientId: task.clientId || "",
      contactId: task.contactId || "",
    },
  })

  const { control, setValue } = form

  // Watch for changes to the contactId field
  const selectedContactId = useWatch({
    control,
    name: "contactId",
  })

  // Autofill clientId based on the selected contactId
  useEffect(() => {
    const selectedContact = contacts.find(
      (contact) => contact.id === selectedContactId,
    )

    if (selectedContact?.clientId) {
      // Only update if the clientId is different
      if (form.getValues("clientId") !== selectedContact.clientId) {
        setValue("clientId", selectedContact.clientId) // Autofill clientId
      }
    } else {
      // Fallback to task.clientId if no client reference
      if (form.getValues("clientId") !== (task.clientId || undefined)) {
        setValue("clientId", task.clientId || undefined)
      }
    }
  }, [selectedContactId, contacts, setValue, task.clientId, form])

  const [isPending, startTransition] = useTransition()
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = (data: TaskEditFormFields) => {
    setError(null)
    startTransition(async () => {
      const payload = {
        ...data,
        clientId: data.clientId === "No client" ? null : data.clientId, // Convert "No client" to null
        contactId:
          data.contactId === "No contact" || !data.contactId
            ? null
            : data.contactId, // Convert "No contact" to null
      }

      if (payload.date) {
        payload.date = new Date(payload.date).toISOString()
      }

      try {
        const res = await axiosApi.patch(`/api/task/${task.id}`, payload)
        onSuccess(res.data)
        toast.success("Task updated successfully")
        setOpen(false)
      } catch (err) {
        console.log("Task update error", err)
        setError("Failed to update task")
        toast.error("Failed to update task")
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="mx-auto">
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
            autoComplete="off"
          >
            <div className="flex flex-row gap-8">
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
                name="statusChangeReason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-500">
                      Status Change Reason
                    </FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-row gap-8">
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

            <div className="flex items-center justify-between">
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
                          <SelectItem value="No client">No client</SelectItem>
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
                name="contactId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-500">Contact</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ""}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select contact" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="No contact">No contact</SelectItem>
                          {contacts.map((contact) => (
                            <SelectItem key={contact.id} value={contact.id}>
                              {contact.name}
                            </SelectItem>
                          ))}
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

/*
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
*/
