"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import Link from "next/link"
import { Search, Package, ArrowRight, Zap, MapPin, Users, Sparkles, GraduationCap, Coffee, Headphones, Smartphone, Key, Wallet, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRef, useState, useEffect } from "react"

const floatingItems = [
  { Icon: Headphones, color: "from-pink-500 to-rose-500", delay: 0 },
  { Icon: Smartphone, color: "from-violet-500 to-purple-500", delay: 0.5 },
  { Icon: Key, color: "from-amber-500 to-orange-500", delay: 1 },
  { Icon: Wallet, color: "from-emerald-500 to-teal-500", delay: 1.5 },
  { Icon: Coffee, color: "from-cyan-500 to-blue-500", delay: 2 },
  { Icon: BookOpen, color: "from-fuchsia-500 to-pink-500", delay: 2.5 },
]

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })
  
  const y = useTransform(scrollYProgress, [0, 1], [0, 200])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  const [positions, setPositions] = useState<Array<{ left: string; top: string }> | null>(null)

  useEffect(() => {
    // Generate random positions only on client
    setPositions(
      floatingItems.map((_, i) => ({
        left: `${10 + (i % 3) * 30 + Math.random() * 10}%`,
        top: `${15 + Math.floor(i / 3) * 40 + Math.random() * 20}%`,
      }))
    )
  }, [])

  return (
    <section ref={containerRef} className="relative min-h-screen overflow-hidden">
      {/* Animated Mesh Background */}
      <div className="absolute inset-0 -z-10 mesh-gradient noise" />
      
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }}
          className="absolute -left-32 top-0 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-primary/30 to-transparent blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 80, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{ repeat: Infinity, duration: 25, ease: "easeInOut", delay: 2 }}
          className="absolute -right-32 top-1/4 h-[600px] w-[600px] rounded-full bg-gradient-to-bl from-violet-500/20 to-transparent blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, 60, 0],
            y: [0, -40, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ repeat: Infinity, duration: 18, ease: "easeInOut", delay: 4 }}
          className="absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-gradient-to-tr from-cyan-500/20 to-transparent blur-3xl"
        />
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]" />

      {/* Floating items around the hero */}
      <div className="absolute inset-0 -z-10 hidden lg:block">
        {positions && floatingItems.map(({ Icon, color, delay }, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              y: [0, -30, 0],
              rotate: [0, 10, -10, 0]
            }}
            transition={{ 
              opacity: { delay: delay + 0.5 },
              scale: { delay: delay + 0.5 },
              y: { repeat: Infinity, duration: 4 + i, ease: "easeInOut", delay },
              rotate: { repeat: Infinity, duration: 6 + i, ease: "easeInOut", delay }
            }}
            className="absolute"
            style={{
              left: positions[i].left,
              top: positions[i].top,
            }}
          >
            <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${color} shadow-lg shadow-black/10`}>
              <Icon className="h-7 w-7 text-white" />
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div 
        style={{ y, opacity }}
        className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32"
      >
        <div className="flex flex-col items-center text-center">
          {/* College Badge */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-gradient-to-r from-primary/10 via-violet-500/10 to-cyan-500/10 px-5 py-2 shadow-lg shadow-primary/5"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
              >
                <GraduationCap className="h-5 w-5 text-primary" />
              </motion.div>
              <span className="bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-sm font-semibold text-transparent">
                Built for Campus Life
              </span>
              <Sparkles className="h-4 w-4 text-amber-500" />
            </motion.div>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-4xl text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl"
          >
            <span className="block text-balance">Lost Something on</span>
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="relative mt-2 block"
            >
              <span className="relative z-10 bg-gradient-to-r from-primary via-violet-500 to-cyan-500 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                Campus?
              </span>
              <motion.span
                className="absolute -inset-x-4 -inset-y-2 -z-10 rounded-2xl bg-gradient-to-r from-primary/20 via-violet-500/20 to-cyan-500/20 blur-xl"
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ repeat: Infinity, duration: 3 }}
              />
            </motion.span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-8 max-w-2xl text-pretty text-lg text-muted-foreground sm:text-xl"
          >
            Your campus community&apos;s go-to spot for finding lost items. 
            Quick reports, smart matching, instant notifications.{" "}
            <span className="font-medium text-foreground">No more stress.</span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
          >
            <Link href="/report/lost">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button size="lg" className="group relative gap-2 overflow-hidden bg-gradient-to-r from-primary to-violet-500 px-8 py-6 text-base font-semibold shadow-xl shadow-primary/25 transition-all hover:shadow-2xl hover:shadow-primary/30">
                  <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-violet-500 to-primary"
                    initial={{ x: "100%" }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                  <span className="relative flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    I Lost Something
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ repeat: Infinity, duration: 1.2 }}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </motion.span>
                  </span>
                </Button>
              </motion.div>
            </Link>
            
            <Link href="/report/found">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button size="lg" variant="outline" className="group gap-2 border-2 px-8 py-6 text-base font-semibold transition-all hover:border-primary hover:bg-primary/5">
                  <Package className="h-5 w-5 transition-transform group-hover:rotate-12" />
                  I Found Something
                </Button>
              </motion.div>
            </Link>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 grid grid-cols-3 gap-4 sm:gap-8"
          >
            {[
              { value: "500+", label: "Items Reunited", icon: Zap, color: "text-amber-500" },
              { value: "12", label: "Campus Buildings", icon: MapPin, color: "text-emerald-500" },
              { value: "2K+", label: "Active Students", icon: Users, color: "text-violet-500" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group relative"
              >
                <div className="glass rounded-2xl p-4 text-center transition-all sm:p-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.6 + i * 0.1, type: "spring" }}
                    className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent/50"
                  >
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </motion.div>
                  <motion.div
                    className="text-2xl font-bold sm:text-3xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 + i * 0.1 }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-xs text-muted-foreground sm:text-sm">{stat.label}</div>
                </div>
                <div className="absolute -inset-px -z-10 rounded-2xl bg-gradient-to-br from-primary/20 to-violet-500/20 opacity-0 blur-lg transition-opacity group-hover:opacity-100" />
              </motion.div>
            ))}
          </motion.div>

          {/* Interactive Demo Card */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-20 w-full max-w-3xl"
          >
            <motion.div
              whileHover={{ y: -5 }}
              className="relative overflow-hidden rounded-3xl border border-border/50 bg-card/80 p-1 shadow-2xl backdrop-blur-xl"
            >
              {/* Gradient border effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary via-violet-500 to-cyan-500 opacity-20" />
              
              <div className="relative rounded-[22px] bg-card p-6 sm:p-8">
                <div className="flex items-start gap-4">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 4 }}
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/30"
                  >
                    <Package className="h-7 w-7 text-white" />
                  </motion.div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-600">
                        Just Found
                      </span>
                      <span className="text-xs text-muted-foreground">2 min ago</span>
                    </div>
                    <h3 className="mt-2 text-lg font-semibold">AirPods Pro Case</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Found near the Student Union Building entrance. Black case with initials &quot;JK&quot;.
                    </p>
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs">
                        <MapPin className="h-3 w-3 text-primary" />
                        Student Union
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs">
                        <Users className="h-3 w-3 text-primary" />
                        5 interested
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Match notification */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.5 }}
                  className="mt-6 flex items-center gap-3 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4"
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10"
                  >
                    <Zap className="h-5 w-5 text-amber-500" />
                  </motion.div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-amber-600">Potential Match Found!</p>
                    <p className="text-xs text-muted-foreground">Someone reported similar lost AirPods yesterday</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="flex flex-col items-center gap-2 text-muted-foreground"
        >
          <span className="text-xs">Scroll to explore</span>
          <div className="h-10 w-6 rounded-full border-2 border-muted-foreground/30 p-1">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="h-2 w-2 rounded-full bg-primary"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
