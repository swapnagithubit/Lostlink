"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion"
import { Menu, X, Search, MapPin, Plus, LayoutDashboard, LogIn, LogOut, User, Sparkles, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/", label: "Home", icon: Sparkles },
  { href: "/items", label: "Browse", icon: Search },
  { href: "/report/lost", label: "Lost", icon: MapPin, highlight: true },
  { href: "/report/found", label: "Found", icon: Plus, highlight: true },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, protected: true },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const { isAuthenticated, user, logout } = useAuth()
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50)
  })

  const filteredLinks = navLinks.filter(link => !link.protected || isAuthenticated)

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled 
            ? "border-b border-border/50 bg-background/80 backdrop-blur-xl shadow-lg shadow-black/5" 
            : "bg-transparent"
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-violet-500 text-white shadow-lg shadow-primary/30 lg:h-11 lg:w-11">
                  <Zap className="h-5 w-5 lg:h-6 lg:w-6" />
                </div>
                <motion.div
                  className="absolute -inset-1 -z-10 rounded-xl bg-gradient-to-br from-primary to-violet-500 opacity-30 blur-lg"
                  animate={{ opacity: [0.3, 0.5, 0.3] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
              </motion.div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight lg:text-xl">
                  Lost<span className="bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">Link</span>
                </span>
                <span className="hidden text-[10px] text-muted-foreground lg:block">Campus Lost & Found</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden items-center gap-1 lg:flex">
              {filteredLinks.map((link) => {
                const Icon = link.icon
                const isActive = pathname === link.href
                const isHighlight = link.highlight
                return (
                  <Link key={link.href} href={link.href}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={cn(
                        "relative flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all",
                        isActive
                          ? "text-white"
                          : isHighlight
                          ? "text-primary hover:bg-primary/10"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground"
                      )}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="navbar-active"
                          className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary to-violet-500"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                      <span className="relative flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {link.label}
                      </span>
                    </motion.div>
                  </Link>
                )
              })}
            </div>

            {/* Auth Buttons - Desktop */}
            <div className="hidden items-center gap-3 lg:flex">
              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-2 rounded-full border border-border bg-accent/50 px-4 py-2"
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-primary to-violet-500 text-xs text-white">
                      {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
                    </div>
                    <span className="max-w-[100px] truncate text-sm font-medium">{user?.name || user?.email}</span>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={logout}
                      className="gap-2 text-muted-foreground hover:text-foreground"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </Button>
                  </motion.div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/login">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button variant="ghost" size="sm" className="gap-2">
                        <LogIn className="h-4 w-4" />
                        Login
                      </Button>
                    </motion.div>
                  </Link>
                  <Link href="/signup">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button size="sm" className="gap-2 bg-gradient-to-r from-primary to-violet-500 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30">
                        Get Started
                        <Sparkles className="h-3.5 w-3.5" />
                      </Button>
                    </motion.div>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(!isOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/50 transition-colors hover:bg-accent lg:hidden"
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <X className="h-5 w-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Menu className="h-5 w-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 z-50 h-full w-80 max-w-[85vw] bg-background shadow-2xl lg:hidden"
            >
              {/* Close button */}
              <div className="flex h-16 items-center justify-between border-b border-border px-4">
                <span className="font-semibold">Menu</span>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl hover:bg-accent"
                >
                  <X className="h-5 w-5" />
                </motion.button>
              </div>

              {/* Navigation Links */}
              <div className="space-y-1 p-4">
                {filteredLinks.map((link, i) => {
                  const Icon = link.icon
                  const isActive = pathname === link.href
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        className={cn(
                          "flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium transition-all",
                          isActive
                            ? "bg-gradient-to-r from-primary to-violet-500 text-white shadow-lg shadow-primary/25"
                            : "text-muted-foreground hover:bg-accent hover:text-foreground"
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        {link.label}
                      </Link>
                    </motion.div>
                  )
                })}
              </div>

              {/* Auth Section */}
              <div className="absolute bottom-0 left-0 right-0 border-t border-border p-4">
                {isAuthenticated ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 rounded-xl bg-accent/50 p-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-violet-500 text-white">
                        {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
                      </div>
                      <div className="flex-1 truncate">
                        <p className="truncate text-sm font-medium">{user?.name || "User"}</p>
                        <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full gap-2"
                      onClick={logout}
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Link href="/login" className="flex-1">
                      <Button variant="outline" className="w-full">Login</Button>
                    </Link>
                    <Link href="/signup" className="flex-1">
                      <Button className="w-full bg-gradient-to-r from-primary to-violet-500">Sign Up</Button>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
