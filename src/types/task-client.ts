export type Task = {
  id: string
  type: "CALL" | "MEET" | "EMAIL" | "OFFER" | "PRESENTATION"
  priority: "LOW" | "MEDIUM" | "HIGH"
  status: "OPEN" | "CLOSED" | "DELETED"
  theme?: string | null
  date?: string | Date | null
  contactPhone?: string | null
  contactEmail?: string | null
  contactPerson?: string | null
  address?: string | null
  urlLink?: string | null
  statusChangeReason?: string | null
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

export type Client = {
  id: string
  name: string
  email?: string | null
  phone?: string | null
  address?: string | null
  createdAt: string | Date
  updatedAt: string | Date
}

export enum FeedType {
  RECOMMENDATION = "RECOMMENDATION",
  CLIENT_ACTIVITY = "CLIENT_ACTIVITY",
  INDUSTRY_INFO = "INDUSTRY_INFO",
  COLLEAGUES_UPDATE = "COLLEAGUES_UPDATE",
}

export enum FeedStatus {
  NEW = "NEW",
  CANCELLED = "CANCELLED",
  IN_PROGRESS = "IN_PROGRESS",
  ACTION_COMPLETED = "ACTION_COMPLETED",
  CLOSED = "CLOSED",
}

export interface Feed {
  id: string
  type: FeedType
  status: FeedStatus
  actionCall?: boolean
  actionEmail?: boolean
  actionBooking?: boolean
  actionTask?: boolean
  metadata?: string
  clientId?: string
  client?: Client // Assuming Client is defined elsewhere
  taskId?: string
  task?: Task // Assuming Task is defined elsewhere
  createdAt: Date
  updatedAt: Date
}
