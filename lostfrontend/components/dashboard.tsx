"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import useSWR from "swr"
import {
  Search,
  Package,
  Loader2,
  Trash2,
  MoreVertical,
  CheckCircle,
  XCircle,
  MapPin,
  Clock,
  Plus,
  RefreshCw,
  AlertTriangle,
  Zap,
  Sparkles,
  TrendingUp,
  Eye,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useAuth } from "@/lib/auth-context"
import { fetchItems, deleteItem, updateItemStatus, type Item } from "@/lib/api"
import Link from "next/link"
import { Navbar } from "./navbar"

export function Dashboard() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const { data: allItems, error, isLoading, mutate } = useSWR<Item[]>(
    isAuthenticated ? "items" : null,
    fetchItems,
    { refreshInterval: 30000 }
  )

  const userItems = allItems?.filter((item) => item.user === user?.id)

  const lostItems = userItems?.filter((item) => item.type === "lost") ?? []
  const foundItems = userItems?.filter((item) => item.type === "found") ?? []
  const resolvedItems = userItems?.filter((item) => item.status !== "open") ?? []

  const handleDelete = async () => {
    if (!deleteItemId) return
    setIsDeleting(true)

    try {
      await deleteItem(deleteItemId)
      mutate()
    } catch (err) {
      console.error("Failed to delete:", err)
    } finally {
      setIsDeleting(false)
      setDeleteItemId(null)
    }
  }

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await updateItemStatus(id, status)
      mutate()
    } catch (err) {
      console.error("Failed to update status:", err)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  if (authLoading) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="flex min-h-[80vh] items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          >
            <Loader2 className="h-10 w-10 text-primary" />
          </motion.div>
        </div>
      </main>
    )
  }

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="relative flex min-h-[80vh] items-center justify-center px-4 pt-20">
          <div className="mesh-gradient pointer-events-none fixed inset-0 -z-10 opacity-50" />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center text-center"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="rounded-3xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 p-6"
            >
              <AlertTriangle className="h-12 w-12 text-amber-500" />
            </motion.div>
            <h2 className="mt-6 text-2xl font-bold">Sign In Required</h2>
            <p className="mt-2 max-w-md text-muted-foreground">
              Please sign in to access your dashboard and manage your reported items.
            </p>
            <Link href="/login" className="mt-6">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button size="lg" className="gap-2 bg-gradient-to-r from-primary to-violet-500 shadow-lg shadow-primary/25">
                  Sign In
                  <Zap className="h-4 w-4" />
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      <div className="relative min-h-screen px-4 pb-16 pt-24 lg:pt-28">
        <div className="mesh-gradient pointer-events-none fixed inset-0 -z-10 opacity-30" />
        
        <div className="mx-auto max-w-7xl space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <div className="flex items-center gap-3">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring" }}
                  className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-violet-500 shadow-lg shadow-primary/25"
                >
                  <Sparkles className="h-6 w-6 text-white" />
                </motion.div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                    Welcome back, {user?.name?.split(" ")[0] || "there"}!
                  </h1>
                  <p className="text-muted-foreground">Here&apos;s what&apos;s happening with your items</p>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button variant="outline" onClick={() => mutate()} disabled={isLoading} className="gap-2 rounded-xl">
                  <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
              </motion.div>
              <Link href="/report/lost">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button className="gap-2 rounded-xl bg-gradient-to-r from-primary to-violet-500 shadow-lg shadow-primary/25">
                    <Plus className="h-4 w-4" />
                    Report Item
                  </Button>
                </motion.div>
              </Link>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            {[
              { label: "Total Items", value: userItems?.length ?? 0, icon: Package, gradient: "from-primary to-violet-500", shadow: "shadow-primary/20" },
              { label: "Lost Items", value: lostItems.length, icon: Search, gradient: "from-rose-500 to-orange-500", shadow: "shadow-rose-500/20" },
              { label: "Found Items", value: foundItems.length, icon: Eye, gradient: "from-emerald-500 to-teal-500", shadow: "shadow-emerald-500/20" },
              { label: "Resolved", value: resolvedItems.length, icon: TrendingUp, gradient: "from-cyan-500 to-blue-500", shadow: "shadow-cyan-500/20" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.05 }}
                whileHover={{ y: -4 }}
                className="group relative"
              >
                <div className={`absolute -inset-0.5 rounded-2xl bg-gradient-to-r ${stat.gradient} opacity-0 blur-lg transition-opacity group-hover:opacity-30`} />
                <Card className="relative overflow-hidden rounded-2xl border-0 bg-card/80 shadow-xl backdrop-blur-sm">
                  <CardContent className="flex items-center gap-4 p-6">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${stat.gradient} ${stat.shadow} shadow-lg`}>
                      <stat.icon className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-3xl font-bold">{stat.value}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Items List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="overflow-hidden rounded-2xl border-0 bg-card/80 shadow-xl backdrop-blur-sm">
              <CardHeader className="border-b border-border/50">
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  Your Reported Items
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    >
                      <Loader2 className="h-10 w-10 text-primary" />
                    </motion.div>
                    <p className="mt-4 text-sm text-muted-foreground">Loading your items...</p>
                  </div>
                ) : error ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="rounded-2xl bg-rose-500/10 p-4">
                      <XCircle className="h-10 w-10 text-rose-500" />
                    </div>
                    <p className="mt-4 font-medium">Failed to load items</p>
                    <Button variant="outline" className="mt-4 rounded-xl" onClick={() => mutate()}>
                      Retry
                    </Button>
                  </div>
                ) : userItems && userItems.length > 0 ? (
                  <div className="space-y-3">
                    <AnimatePresence mode="popLayout">
                      {userItems.map((item, index) => (
                        <motion.div
                          key={item._id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ delay: index * 0.05 }}
                          layout
                          className="group relative"
                        >
                          <div className={`absolute -inset-0.5 rounded-xl bg-gradient-to-r ${
                            item.type === "lost" 
                              ? "from-rose-500/50 to-orange-500/50" 
                              : "from-emerald-500/50 to-teal-500/50"
                          } opacity-0 blur transition-opacity group-hover:opacity-20`} />
                          <div className="relative flex items-center justify-between rounded-xl border border-border/50 bg-background/80 p-4 transition-all hover:shadow-lg">
                            <div className="flex items-center gap-4">
                              <div
                                className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${
                                  item.type === "lost"
                                    ? "from-rose-500 to-orange-500 shadow-rose-500/25"
                                    : "from-emerald-500 to-teal-500 shadow-emerald-500/25"
                                } shadow-lg`}
                              >
                                {item.type === "lost" ? (
                                  <Search className="h-5 w-5 text-white" />
                                ) : (
                                  <Package className="h-5 w-5 text-white" />
                                )}
                              </div>

                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-semibold">{item.title}</h3>
                                  <Badge
                                    className={`rounded-full border-0 text-xs ${
                                      item.status === "open"
                                        ? "bg-amber-500/10 text-amber-600"
                                        : "bg-emerald-500/10 text-emerald-600"
                                    }`}
                                  >
                                    {item.status}
                                  </Badge>
                                </div>
                                <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {item.location}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {formatDate(item.createdAt)}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="rounded-xl opacity-0 transition-opacity group-hover:opacity-100">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="rounded-xl">
                                <DropdownMenuItem onClick={() => router.push(`/items/${item._id}`)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {item.status === "open" ? (
                                  <DropdownMenuItem onClick={() => handleStatusUpdate(item._id, "resolved")}>
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Mark as Resolved
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem onClick={() => handleStatusUpdate(item._id, "open")}>
                                    <RefreshCw className="mr-2 h-4 w-4" />
                                    Reopen
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => setDeleteItemId(item._id)}
                                  className="text-rose-600 focus:text-rose-600"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-16 text-center"
                  >
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ repeat: Infinity, duration: 3 }}
                      className="rounded-2xl bg-gradient-to-br from-primary/20 to-violet-500/20 p-6"
                    >
                      <Package className="h-10 w-10 text-primary" />
                    </motion.div>
                    <h3 className="mt-6 text-lg font-semibold">No items yet</h3>
                    <p className="mt-2 max-w-sm text-muted-foreground">
                      Start by reporting a lost or found item to help your campus community
                    </p>
                    <div className="mt-6 flex gap-3">
                      <Link href="/report/lost">
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button variant="outline" className="gap-2 rounded-xl">
                            <Search className="h-4 w-4" />
                            Report Lost
                          </Button>
                        </motion.div>
                      </Link>
                      <Link href="/report/found">
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button className="gap-2 rounded-xl bg-gradient-to-r from-primary to-violet-500">
                            <Package className="h-4 w-4" />
                            Report Found
                          </Button>
                        </motion.div>
                      </Link>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Delete Dialog */}
      <AlertDialog open={!!deleteItemId} onOpenChange={() => setDeleteItemId(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this item? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting} className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="rounded-xl bg-rose-500 hover:bg-rose-600"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  )
}
