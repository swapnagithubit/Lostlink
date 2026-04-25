"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import useSWR from "swr"
import { Search, Filter, MapPin, Package, Loader2, RefreshCw, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ItemCard } from "@/components/item-card"
import { fetchItems, type Item } from "@/lib/api"

const communities = [
  "all",
  "university",
  "office",
  "neighborhood",
  "gym",
  "mall",
  "park",
  "transit",
  "other",
]

const types = [
  { value: "all", label: "All Items", icon: Package },
  { value: "lost", label: "Lost", icon: Search },
  { value: "found", label: "Found", icon: Package },
]

export function ItemsList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedCommunity, setSelectedCommunity] = useState("all")
  const [showFilters, setShowFilters] = useState(false)

  const { data: items, error, isLoading, mutate } = useSWR<Item[]>("items", fetchItems, {
    refreshInterval: 30000, // Refresh every 30 seconds
  })

  const filteredItems = items?.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesType = selectedType === "all" || item.type === selectedType
    const matchesCommunity = selectedCommunity === "all" || item.community === selectedCommunity
    
    return matchesSearch && matchesType && matchesCommunity
  })

  const activeFiltersCount =
    (selectedType !== "all" ? 1 : 0) + (selectedCommunity !== "all" ? 1 : 0)

  const clearFilters = () => {
    setSelectedType("all")
    setSelectedCommunity("all")
    setSearchQuery("")
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex flex-col gap-4 sm:flex-row">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search items by title, description, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 transition-all focus:ring-2 focus:ring-primary/20"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Filter Toggle */}
          <div className="flex gap-2">
            <Button
              variant={showFilters ? "default" : "outline"}
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
              {activeFiltersCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-foreground text-xs text-primary">
                  {activeFiltersCount}
                </span>
              )}
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              onClick={() => mutate()}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>

        {/* Expandable Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 overflow-hidden rounded-lg border border-border/50 bg-card/50 p-4 backdrop-blur-sm"
            >
              {/* Type Filter */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <Package className="h-4 w-4 text-primary" />
                  Item Type
                </label>
                <div className="flex flex-wrap gap-2">
                  {types.map((type) => {
                    const Icon = type.icon
                    return (
                      <motion.button
                        key={type.value}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedType(type.value)}
                        className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                          selectedType === type.value
                            ? "bg-primary text-primary-foreground"
                            : "bg-accent text-accent-foreground hover:bg-accent/80"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {type.label}
                      </motion.button>
                    )
                  })}
                </div>
              </div>

              {/* Community Filter */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <MapPin className="h-4 w-4 text-primary" />
                  Community
                </label>
                <div className="flex flex-wrap gap-2">
                  {communities.map((community) => (
                    <motion.button
                      key={community}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedCommunity(community)}
                      className={`rounded-full px-4 py-2 text-sm font-medium capitalize transition-all ${
                        selectedCommunity === community
                          ? "bg-primary text-primary-foreground"
                          : "bg-accent text-accent-foreground hover:bg-accent/80"
                      }`}
                    >
                      {community}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              {activeFiltersCount > 0 && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-2">
                  <X className="h-4 w-4" />
                  Clear all filters
                </Button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Results Summary */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-between text-sm text-muted-foreground"
      >
        <span>
          {filteredItems?.length ?? 0} item{(filteredItems?.length ?? 0) !== 1 ? "s" : ""} found
        </span>
        {activeFiltersCount > 0 && (
          <span className="text-primary">
            {activeFiltersCount} filter{activeFiltersCount !== 1 ? "s" : ""} active
          </span>
        )}
      </motion.div>

      {/* Items Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="rounded-full bg-destructive/10 p-4">
            <X className="h-8 w-8 text-destructive" />
          </div>
          <h3 className="mt-4 font-semibold">Failed to load items</h3>
          <p className="mt-1 text-sm text-muted-foreground">Please try again later</p>
          <Button variant="outline" className="mt-4" onClick={() => mutate()}>
            Retry
          </Button>
        </motion.div>
      ) : filteredItems && filteredItems.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item, index) => (
            <ItemCard key={item._id} item={item} index={index} />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="rounded-full bg-accent p-4"
          >
            <Search className="h-8 w-8 text-muted-foreground" />
          </motion.div>
          <h3 className="mt-4 font-semibold">No items found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Try adjusting your search or filters
          </p>
          {activeFiltersCount > 0 && (
            <Button variant="outline" className="mt-4" onClick={clearFilters}>
              Clear filters
            </Button>
          )}
        </motion.div>
      )}
    </div>
  )
}
