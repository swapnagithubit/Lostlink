"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

interface ItemSkeletonProps {
  index?: number
}

export function ItemSkeleton({ index = 0 }: ItemSkeletonProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Card className="h-full overflow-hidden border-border/50 bg-card/50">
        {/* Image Skeleton */}
        <div className="relative h-48 animate-pulse bg-accent">
          <div className="absolute right-3 top-3">
            <div className="h-6 w-16 rounded-full bg-muted" />
          </div>
        </div>

        <CardHeader className="pb-2">
          <div className="h-6 w-3/4 animate-pulse rounded bg-muted" />
        </CardHeader>

        <CardContent className="space-y-3 pb-4">
          <div className="space-y-2">
            <div className="h-4 w-full animate-pulse rounded bg-muted" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="h-6 w-20 animate-pulse rounded-full bg-muted" />
            <div className="h-6 w-24 animate-pulse rounded-full bg-muted" />
            <div className="h-6 w-16 animate-pulse rounded-full bg-muted" />
          </div>
        </CardContent>

        <CardFooter className="pt-0">
          <div className="h-10 w-full animate-pulse rounded bg-muted" />
        </CardFooter>
      </Card>
    </motion.div>
  )
}

export function ItemSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <ItemSkeleton key={i} index={i} />
      ))}
    </div>
  )
}
