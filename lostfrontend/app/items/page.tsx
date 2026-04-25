import { Navbar } from "@/components/navbar"
import { ItemsList } from "@/components/items-list"

export const metadata = {
  title: "Browse Items | LostLink",
  description: "Browse all lost and found items reported by the community",
}

export default function ItemsPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      <div className="mx-auto max-w-7xl px-4 pb-20 pt-24 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Browse Items</h1>
          <p className="mt-2 text-muted-foreground">
            Search and filter through all reported lost and found items
          </p>
        </div>

        <ItemsList />
      </div>
    </main>
  )
}
