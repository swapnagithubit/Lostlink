"use client"

import { motion } from "framer-motion"
import { MapPin, Clock, Tag, ChevronRight, Package, Search, Sparkles, Eye } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Item } from "@/lib/api"
import Link from "next/link"

interface ItemCardProps {
  item: Item
  index?: number
}

export function ItemCard({ item, index = 0 }: ItemCardProps) {
  const isLost = item.type === "lost"
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return "Today"
    if (diffDays === 1) return "Yesterday"
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4, ease: "easeOut" }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="group relative"
    >
      {/* Glow effect on hover */}
      <div className={`absolute -inset-0.5 rounded-3xl bg-gradient-to-r ${
        isLost 
          ? "from-rose-500/50 to-orange-500/50" 
          : "from-emerald-500/50 to-teal-500/50"
      } opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-30`} />
      
      <Card className="relative h-full overflow-hidden rounded-2xl border-0 bg-card/80 shadow-xl shadow-black/5 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
        {/* Animated gradient border */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-border via-border/50 to-border" />
        <div className="absolute inset-[1px] rounded-[15px] bg-card" />

        {/* Type Badge with animation */}
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: index * 0.08 + 0.2, type: "spring" }}
          className="absolute right-4 top-4 z-20"
        >
          <Badge
            className={`flex items-center gap-1.5 rounded-full border-0 px-3 py-1.5 font-medium shadow-lg ${
              isLost
                ? "bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-rose-500/30"
                : "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-emerald-500/30"
            }`}
          >
            {isLost ? <Search className="h-3.5 w-3.5" /> : <Package className="h-3.5 w-3.5" />}
            {isLost ? "Lost" : "Found"}
          </Badge>
        </motion.div>

        {/* Image Section */}
        <div className="relative h-48 overflow-hidden">
          {item.image ? (
            <motion.img
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6 }}
              src={item.image}
              alt={item.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${
              isLost 
                ? "from-rose-500/10 to-orange-500/10" 
                : "from-emerald-500/10 to-teal-500/10"
            }`}>
              <motion.div
                animate={{ 
                  y: [0, -8, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ repeat: Infinity, duration: 4 }}
              >
                {isLost ? (
                  <Search className="h-20 w-20 text-rose-500/30" />
                ) : (
                  <Package className="h-20 w-20 text-emerald-500/30" />
                )}
              </motion.div>
            </div>
          )}
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
          
          {/* View count mock */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-black/30 px-2 py-1 text-xs text-white backdrop-blur-sm"
          >
            <Eye className="h-3 w-3" />
            {Math.floor(Math.random() * 50 + 10)}
          </motion.div>
        </div>

        <CardHeader className="relative z-10 -mt-6 pb-2">
          <motion.h3 
            className="line-clamp-1 text-lg font-bold tracking-tight"
            whileHover={{ x: 3 }}
            transition={{ duration: 0.2 }}
          >
            {item.title}
          </motion.h3>
        </CardHeader>

        <CardContent className="relative z-10 space-y-3 pb-4">
          {item.description && (
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {item.description}
            </p>
          )}

          <div className="flex flex-wrap gap-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-accent to-accent/50 px-3 py-1.5 text-xs font-medium"
            >
              <MapPin className="h-3 w-3 text-primary" />
              <span className="max-w-20 truncate">{item.location}</span>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-accent to-accent/50 px-3 py-1.5 text-xs font-medium"
            >
              <Tag className="h-3 w-3 text-violet-500" />
              <span className="capitalize">{item.community}</span>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-accent to-accent/50 px-3 py-1.5 text-xs font-medium"
            >
              <Clock className="h-3 w-3 text-amber-500" />
              <span>{formatDate(item.createdAt)}</span>
            </motion.div>
          </div>
        </CardContent>

        <CardFooter className="relative z-10 pt-0">
          <Link href={`/items/${item._id}`} className="w-full">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="ghost"
                className={`w-full gap-2 rounded-xl border-2 border-transparent bg-accent/50 font-medium transition-all ${
                  isLost
                    ? "hover:border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-600"
                    : "hover:border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-600"
                }`}
              >
                <Sparkles className="h-4 w-4" />
                View Details
                <motion.div
                  animate={{ x: [0, 4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <ChevronRight className="h-4 w-4" />
                </motion.div>
              </Button>
            </motion.div>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
