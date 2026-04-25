"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import {
  ArrowLeft,
  MapPin,
  Clock,
  Tag,
  User,
  Mail,
  Package,
  Search,
  CheckCircle,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Item } from "@/lib/api"

interface ItemDetailProps {
  item: Item | null
  isLoading: boolean
  error: Error | null
}

export function ItemDetail({ item, isLoading, error }: ItemDetailProps) {
  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !item) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex min-h-[60vh] flex-col items-center justify-center text-center"
      >
        <div className="rounded-full bg-destructive/10 p-4">
          <Package className="h-12 w-12 text-destructive" />
        </div>
        <h2 className="mt-6 text-2xl font-semibold">Item Not Found</h2>
        <p className="mt-2 text-muted-foreground">
          This item may have been removed or doesn&apos;t exist.
        </p>
        <Link href="/items" className="mt-6">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Items
          </Button>
        </Link>
      </motion.div>
    )
  }

  const isLost = item.type === "lost"
  const isResolved = item.status !== "open"

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="mx-auto max-w-4xl">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-6"
      >
        <Link href="/items">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Items
          </Button>
        </Link>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Image Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm">
            <div className="relative aspect-square">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-accent to-accent/50">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 4 }}
                  >
                    {isLost ? (
                      <Search className="h-24 w-24 text-muted-foreground/30" />
                    ) : (
                      <Package className="h-24 w-24 text-muted-foreground/30" />
                    )}
                  </motion.div>
                </div>
              )}

              {/* Status Badge */}
              <div className="absolute left-4 top-4">
                <Badge
                  variant={isLost ? "destructive" : "default"}
                  className={`flex items-center gap-1.5 px-3 py-1 text-sm ${
                    isLost
                      ? "bg-red-500/10 text-red-600 hover:bg-red-500/20"
                      : "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
                  }`}
                >
                  {isLost ? <Search className="h-4 w-4" /> : <Package className="h-4 w-4" />}
                  {isLost ? "Lost Item" : "Found Item"}
                </Badge>
              </div>

              {/* Resolved Badge */}
              {isResolved && (
                <div className="absolute right-4 top-4">
                  <Badge className="flex items-center gap-1.5 bg-blue-500/10 px-3 py-1 text-blue-600">
                    <CheckCircle className="h-4 w-4" />
                    Resolved
                  </Badge>
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Details Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Title */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{item.title}</h1>
            {item.description && (
              <p className="mt-4 text-muted-foreground">{item.description}</p>
            )}
          </div>

          {/* Info Cards */}
          <div className="grid gap-3 sm:grid-cols-2">
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="rounded-lg bg-primary/10 p-2">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="font-medium">{item.location}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Tag className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Community</p>
                  <p className="font-medium capitalize">{item.community}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Reported</p>
                  <p className="font-medium">{formatDate(item.createdAt)}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="rounded-lg bg-primary/10 p-2">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <p className="font-medium capitalize">{item.status}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Section */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {isLost
                  ? "If you found this item, please contact the owner."
                  : "If this is your item, please contact the finder."}
              </p>
              <Button className="w-full gap-2">
                <Mail className="h-4 w-4" />
                Contact {isLost ? "Owner" : "Finder"}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
