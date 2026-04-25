"use client"

import { use } from "react"
import useSWR from "swr"
import { Navbar } from "@/components/navbar"
import { ItemDetail } from "@/components/item-detail"
import { fetchItems, type Item } from "@/lib/api"

interface ItemPageProps {
  params: Promise<{ id: string }>
}

export default function ItemPage({ params }: ItemPageProps) {
  const { id } = use(params)
  const { data: items, error, isLoading } = useSWR<Item[]>("items", fetchItems)
  
  const item = items?.find((i) => i._id === id) ?? null

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      <div className="mx-auto max-w-7xl px-4 pb-20 pt-24 sm:px-6 lg:px-8">
        <ItemDetail item={item} isLoading={isLoading} error={error} />
      </div>
    </main>
  )
}
