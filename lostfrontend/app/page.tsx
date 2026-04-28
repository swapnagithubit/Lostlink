"use client"

import { motion } from "framer-motion"
import useSWR from "swr"
import { ArrowRight, Loader2, Zap, Shield, Bell, MessageCircle, Building2, Coffee, BookOpen, Dumbbell, Bus, Sparkles, ChevronRight } from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { ItemCard } from "@/components/item-card"
import { Button } from "@/components/ui/button"
import { fetchItems, type Item } from "@/lib/api"

const features = [
  {
    icon: Zap,
    title: "Instant Matching",
    description: "Our smart algorithm automatically matches lost items with found reports within seconds.",
    color: "from-amber-500 to-orange-500",
    shadowColor: "shadow-amber-500/20"
  },
  {
    icon: Bell,
    title: "Real-time Alerts",
    description: "Get notified immediately when someone reports a match for your lost item.",
    color: "from-violet-500 to-purple-500",
    shadowColor: "shadow-violet-500/20"
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your contact info stays private until you choose to connect with a match.",
    color: "from-emerald-500 to-teal-500",
    shadowColor: "shadow-emerald-500/20"
  },
  {
    icon: MessageCircle,
    title: "Easy Communication",
    description: "Built-in messaging to coordinate item pickup without sharing personal details.",
    color: "from-cyan-500 to-blue-500",
    shadowColor: "shadow-cyan-500/20"
  },
]

const locations = [
  { name: "Library", icon: BookOpen, count: 45 },
  { name: "Student Union", icon: Coffee, count: 38 },
  { name: "Gym", icon: Dumbbell, count: 27 },
  { name: "Dorms", icon: Building2, count: 52 },
  { name: "Bus Stop", icon: Bus, count: 19 },
]

export default function HomePage() {
  const { data: items, isLoading } = useSWR<Item[]>("items", fetchItems)

  const recentItems = items?.slice(0, 6) ?? []

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-16 lg:pt-20">
        <HeroSection />

        {/* Recent Items Section */}
        <section className="relative overflow-hidden border-t border-border/40 py-24">
          {/* Background gradient */}
          <div className="absolute inset-0 -z-10 mesh-gradient opacity-50" />
          
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-violet-500/20"
              >
                <Sparkles className="h-7 w-7 text-primary" />
              </motion.div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Recent Reports
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                Check out the latest lost and found items from your campus community
              </p>
            </motion.div>

            <div className="mt-12">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  >
                    <Loader2 className="h-10 w-10 text-primary" />
                  </motion.div>
                  <p className="mt-4 text-sm text-muted-foreground">Loading items...</p>
                </div>
              ) : recentItems.length > 0 ? (
                <>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {recentItems.map((item, index) => (
                      <ItemCard key={item._id} item={item} index={index} />
                    ))}
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-12 text-center"
                  >
                    <Link href="/items">
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button size="lg" variant="outline" className="gap-2 rounded-xl border-2 px-8">
                          View All Items
                          <motion.div
                            animate={{ x: [0, 4, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                          >
                            <ArrowRight className="h-4 w-4" />
                          </motion.div>
                        </Button>
                      </motion.div>
                    </Link>
                  </motion.div>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-3xl border border-dashed border-border bg-accent/30 py-20 text-center"
                >
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                    className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-accent"
                  >
                    <Sparkles className="h-10 w-10 text-muted-foreground" />
                  </motion.div>
                  <h3 className="text-xl font-semibold">No items yet</h3>
                  <p className="mt-2 text-muted-foreground">Be the first to report an item!</p>
                  <Link href="/report/lost" className="mt-6 inline-block">
                    <Button className="gap-2 bg-gradient-to-r from-primary to-violet-500">
                      Report an Item
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </motion.div>
              )}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="relative py-24">
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-accent/20 to-background" />
          
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Why Students{" "}
                <span className="bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
                  Love Us
                </span>
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                Built specifically for campus life, with features that make finding lost items a breeze
              </p>
            </motion.div>

            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="group relative"
                >
                  <div className={`absolute -inset-0.5 rounded-3xl bg-gradient-to-r ${feature.color} opacity-0 blur-xl transition-opacity group-hover:opacity-30`} />
                  <div className="relative h-full rounded-2xl border border-border/50 bg-card/80 p-6 backdrop-blur-sm transition-shadow hover:shadow-xl">
                    <motion.div
                      whileHover={{ rotate: [0, -10, 10, 0] }}
                      className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.color} shadow-lg ${feature.shadowColor}`}
                    >
                      <feature.icon className="h-7 w-7 text-white" />
                    </motion.div>
                    <h3 className="text-lg font-semibold">{feature.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Locations */}
        <section className="relative overflow-hidden py-24">
          <div className="absolute inset-0 -z-10 mesh-gradient opacity-30" />
          
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Popular Campus Spots
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                Most items are found at these locations - check here first!
              </p>
            </motion.div>

            <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
              {locations.map((location, i) => (
                <motion.div
                  key={location.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="group relative"
                >
                  <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-primary/50 to-violet-500/50 opacity-0 blur-lg transition-opacity group-hover:opacity-50" />
                  <div className="relative flex items-center gap-3 rounded-xl border border-border bg-card/80 px-5 py-3 backdrop-blur-sm transition-shadow hover:shadow-lg">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent">
                      <location.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{location.name}</p>
                      <p className="text-xs text-muted-foreground">{location.count} items found</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative overflow-hidden py-24">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-violet-500/5 to-cyan-500/10" />
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_30%_30%,rgba(var(--primary),0.1),transparent_50%)]" />
          
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-primary to-violet-500 shadow-2xl shadow-primary/30"
              >
                <Zap className="h-10 w-10 text-white" />
              </motion.div>
              
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Ready to Find{" "}
                <span className="bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
                  What&apos;s Lost?
                </span>
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
                Join thousands of students who&apos;ve reunited with their belongings through FindMyThing.
              </p>
              
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link href="/signup">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button size="lg" className="gap-2 bg-gradient-to-r from-primary to-violet-500 px-8 py-6 text-base font-semibold shadow-xl shadow-primary/25">
                      Get Started Free
                      <motion.div
                        animate={{ x: [0, 4, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      >
                        <ArrowRight className="h-4 w-4" />
                      </motion.div>
                    </Button>
                  </motion.div>
                </Link>
                <Link href="/items">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button size="lg" variant="outline" className="gap-2 border-2 px-8 py-6 text-base font-semibold">
                      Browse Items
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border/40 bg-card/50 py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-violet-500">
                  <Zap className="h-4 w-4 text-white" />
                </div>
                <span className="font-semibold">FindMyThing</span>
              </div>
              <p className="text-center text-sm text-muted-foreground">
                Made with care for students, by students.
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <Link href="/items" className="hover:text-foreground">Browse</Link>
                <Link href="/report/lost" className="hover:text-foreground">Report</Link>
                <Link href="/login" className="hover:text-foreground">Login</Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </main>
  )
}
