"use client"

import { use, useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { ItemDetail } from "@/components/item-detail"
import { type Item } from "@/lib/api"

interface ItemPageProps {
  params: Promise<{ id: string }>
}

export default function ItemPage({ params }: ItemPageProps) {
  const { id } = use(params)
  const [item, setItem] = useState<Item | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await fetch(`${API_BASE}/items`)
        if (!res.ok) throw new Error("Failed to fetch items")
        const items: Item[] = await res.json()
        const found = items.find((i) => i._id === id) ?? null
        setItem(found)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"))
      } finally {
        setIsLoading(false)
      }
    }

    fetchItem()
  }, [id])

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 pb-20 pt-24 sm:px-6 lg:px-8">
        <ItemDetail item={item} isLoading={isLoading} error={error} />
      </div>
    </main>
  )
}