import { Navbar } from "@/components/navbar"
import { Dashboard } from "@/components/dashboard"

export const metadata = {
  title: "Dashboard | LostLink",
  description: "Manage your reported lost and found items",
}

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      <div className="mx-auto max-w-7xl px-4 pb-20 pt-24 sm:px-6 lg:px-8">
        <Dashboard />
      </div>
    </main>
  )
}
