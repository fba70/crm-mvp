"use client"

import { useState, useEffect } from "react"
import { useSession } from "@/lib/auth-client"
import { unauthorized } from "next/navigation"
import type { Client } from "@/types/task-client"
import axiosApi from "@/lib/axios"
import ClientsLoading from "./loading"
import FormNewClientDialog from "@/components/forms/form-new-client"
import FormClientEditDialog from "@/components/forms/form-client-edit"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPinHouse, AtSign, Phone } from "lucide-react"
import Link from "next/link"

export default function ClientsPage() {
  const { data: user, isPending } = useSession()

  if (!user && !isPending) {
    unauthorized()
  }

  const [clients, setClients] = useState<Client[]>([])
  const [clientsLoading, setClientsLoading] = useState(true)
  const [search, setSearch] = useState("")

  const fetchClients = () => {
    setClientsLoading(true)
    axiosApi
      .get("/api/client")
      .then((res) => setClients(res.data))
      .finally(() => setClientsLoading(false))
  }

  useEffect(() => {
    fetchClients()
  }, [])

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(search.toLowerCase()),
  )

  // console.log("Clients:", clients)

  if (clientsLoading) return <ClientsLoading />

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col px-0 pt-5">
      <div className="space-y-6">
        <div className="flex flex-row justify-between px-4">
          <h1 className="pl-2 text-2xl font-semibold">Clients</h1>
          {user && (
            <FormNewClientDialog
              clients={clients}
              userId={user?.user.id}
              onSuccess={() => fetchClients()}
            />
          )}
        </div>

        <div className="ml-6 w-full">
          <input
            type="text"
            placeholder="Search clients by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded border px-4 py-2 text-sm"
          />
        </div>

        {clients.length === 0 ? (
          <p className="text-muted-foreground py-8 text-center">
            No clients found.
          </p>
        ) : (
          <ClientCards
            clients={filteredClients}
            onClientUpdated={fetchClients}
          />
        )}
      </div>
    </main>
  )
}

function ClientCards({
  clients,
  onClientUpdated,
}: {
  clients: Client[]
  onClientUpdated: () => void
}) {
  const CARDS_PER_PAGE = 4
  const [page, setPage] = useState(1)
  const totalPages = Math.ceil(clients.length / CARDS_PER_PAGE)
  const startIdx = (page - 1) * CARDS_PER_PAGE
  const endIdx = startIdx + CARDS_PER_PAGE
  const pageClients = clients.slice(startIdx, endIdx)

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <div className="grid w-[90%] grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
        {pageClients.map((client) => (
          <Card key={client.id} className="pt-4 pb-6">
            <CardContent className="flex flex-col gap-2 px-6 py-0">
              <div className="flex flex-row items-center justify-between gap-2">
                <div className="text-lg font-semibold">{client.name}</div>
                <FormClientEditDialog
                  client={client}
                  onSuccess={onClientUpdated}
                />
              </div>

              {client.address && (
                <Link
                  href={`https://www.google.com/maps/search/?api=1&query=${client.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  <div className="flex flex-row items-center gap-3 text-sm">
                    <MapPinHouse size={18} />
                    {client.address}
                  </div>
                </Link>
              )}
              <div className="flex flex-row gap-6">
                {client.email && (
                  <div className="flex flex-row items-center gap-3 text-sm">
                    {" "}
                    <AtSign size={18} /> {client.email}
                  </div>
                )}
                {client.phone && (
                  <div className="flex flex-row items-center gap-3 text-sm">
                    <Phone size={18} /> {client.phone}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            className="bg-muted text-foreground rounded px-3 py-1 disabled:opacity-50"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Prev
          </button>
          <span className="text-sm">
            Page {page} of {totalPages}
          </span>
          <button
            className="bg-muted text-foreground rounded px-3 py-1 disabled:opacity-50"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
