export type Task = {
  id: string
  type: "CALL" | "MEET" | "EMAIL" | "OFFER" | "PRESENTATION"
  priority: "LOW" | "MEDIUM" | "HIGH"
  status: "OPEN" | "CLOSED"
  theme?: string | null
  date?: string | Date | null
  contactPhone?: string | null
  contactEmail?: string | null
  contactPerson?: string | null
  address?: string | null
  urlLink?: string | null
  clientId?: string | null
  client?: {
    id: string
    name: string
    email?: string | null
    phone?: string | null
    address?: string | null
    createdAt: string | Date
    updatedAt: string | Date
  } | null
  createdById: string
  assignedToId?: string | null
  createdAt: string | Date
  updatedAt: string | Date
}
