"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Mail, Lock, User, Loader2, AlertCircle, Eye, EyeOff, ArrowRight, Zap, GraduationCap, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth-context"
import { Navbar } from "./navbar"

interface AuthFormProps {
  mode: "login" | "signup"
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter()
  const { login, signup } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })

  const isLogin = mode === "login"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      if (isLogin) {
        await login(formData.email, formData.password)
      } else {
        await signup(formData.name, formData.email, formData.password)
      }
      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      <div className="relative flex min-h-screen items-center justify-center px-4 pt-20">
        {/* Animated Background */}
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="mesh-gradient absolute inset-0 opacity-60" />
          
          {/* Floating shapes */}
          <motion.div
            animate={{
              x: [0, 50, 0],
              y: [0, -30, 0],
              rotate: [0, 10, 0],
            }}
            transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }}
            className="absolute left-10 top-1/4 h-64 w-64 rounded-full bg-gradient-to-br from-primary/20 to-violet-500/20 blur-3xl"
          />
          <motion.div
            animate={{
              x: [0, -40, 0],
              y: [0, 40, 0],
              rotate: [0, -10, 0],
            }}
            transition={{ repeat: Infinity, duration: 25, ease: "easeInOut", delay: 2 }}
            className="absolute right-10 top-1/3 h-80 w-80 rounded-full bg-gradient-to-bl from-cyan-500/15 to-emerald-500/15 blur-3xl"
          />
          <motion.div
            animate={{
              x: [0, 30, 0],
              y: [0, -20, 0],
            }}
            transition={{ repeat: Infinity, duration: 18, ease: "easeInOut", delay: 4 }}
            className="absolute bottom-1/4 left-1/3 h-72 w-72 rounded-full bg-gradient-to-tr from-amber-500/15 to-orange-500/15 blur-3xl"
          />
        </div>

        {/* Auth Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Glow effect */}
          <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-r from-primary/30 via-violet-500/30 to-cyan-500/30 opacity-50 blur-xl" />
          
          <Card className="relative overflow-hidden rounded-3xl border-0 bg-card/90 shadow-2xl backdrop-blur-xl">
            {/* Gradient border */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary/20 via-violet-500/20 to-cyan-500/20" />
            <div className="absolute inset-[1px] rounded-[23px] bg-card" />
            
            <CardHeader className="relative z-10 pb-4 text-center">
              {/* Logo Animation */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", delay: 0.1, stiffness: 200 }}
                className="mx-auto mb-4"
              >
                <div className="relative">
                  <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-primary to-violet-500 shadow-xl shadow-primary/30">
                    {isLogin ? (
                      <Zap className="h-10 w-10 text-white" />
                    ) : (
                      <GraduationCap className="h-10 w-10 text-white" />
                    )}
                  </div>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute -inset-2 -z-10 rounded-3xl bg-gradient-to-br from-primary to-violet-500 blur-xl"
                  />
                </div>
              </motion.div>
              
              <CardTitle className="text-2xl font-bold sm:text-3xl">
                {isLogin ? "Welcome Back!" : "Join the Community"}
              </CardTitle>
              <CardDescription className="mt-2 text-base">
                {isLogin
                  ? "Sign in to access your lost & found dashboard"
                  : "Create an account to start finding lost items"}
              </CardDescription>
            </CardHeader>

            <CardContent className="relative z-10 px-6 pb-8 pt-2 sm:px-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, y: -10 }}
                      animate={{ opacity: 1, height: "auto", y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -10 }}
                      className="flex items-center gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-600"
                    >
                      <AlertCircle className="h-5 w-5 shrink-0" />
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Name Field (Signup only) */}
                <AnimatePresence>
                  {!isLogin && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-2"
                    >
                      <Label htmlFor="name" className="flex items-center gap-2 text-sm font-medium">
                        <User className="h-4 w-4 text-primary" />
                        Full Name
                      </Label>
                      <div className="relative">
                        <Input
                          id="name"
                          placeholder="Your name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          onFocus={() => setFocusedField("name")}
                          onBlur={() => setFocusedField(null)}
                          required={!isLogin}
                          className={`h-12 rounded-xl border-2 bg-accent/30 pl-11 text-base transition-all ${
                            focusedField === "name" ? "border-primary ring-4 ring-primary/10" : "border-transparent"
                          }`}
                        />
                        <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Email Field */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-2"
                >
                  <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium">
                    <Mail className="h-4 w-4 text-primary" />
                    Email Address
                  </Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@university.edu"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField(null)}
                      required
                      className={`h-12 rounded-xl border-2 bg-accent/30 pl-11 text-base transition-all ${
                        focusedField === "email" ? "border-primary ring-4 ring-primary/10" : "border-transparent"
                      }`}
                    />
                    <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  </div>
                </motion.div>

                {/* Password Field */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-2"
                >
                  <Label htmlFor="password" className="flex items-center gap-2 text-sm font-medium">
                    <Lock className="h-4 w-4 text-primary" />
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      onFocus={() => setFocusedField("password")}
                      onBlur={() => setFocusedField(null)}
                      required
                      minLength={6}
                      className={`h-12 rounded-xl border-2 bg-accent/30 pl-11 pr-11 text-base transition-all ${
                        focusedField === "password" ? "border-primary ring-4 ring-primary/10" : "border-transparent"
                      }`}
                    />
                    <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </motion.button>
                  </div>
                </motion.div>

                {/* Submit Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="pt-2"
                >
                  <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                    <Button
                      type="submit"
                      size="lg"
                      disabled={isSubmitting}
                      className="relative h-12 w-full gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-primary to-violet-500 text-base font-semibold shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          {isLogin ? "Signing in..." : "Creating account..."}
                        </>
                      ) : (
                        <>
                          {isLogin ? "Sign In" : "Create Account"}
                          <motion.div
                            animate={{ x: [0, 4, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                          >
                            <ArrowRight className="h-4 w-4" />
                          </motion.div>
                        </>
                      )}
                    </Button>
                  </motion.div>
                </motion.div>

                {/* Divider */}
                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-card px-4 text-sm text-muted-foreground">or</span>
                  </div>
                </div>

                {/* Toggle Link */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-center"
                >
                  {isLogin ? (
                    <p className="text-muted-foreground">
                      New to LostLink?{" "}
                      <Link href="/signup" className="font-semibold text-primary hover:underline">
                        Create account
                      </Link>
                    </p>
                  ) : (
                    <p className="text-muted-foreground">
                      Already have an account?{" "}
                      <Link href="/login" className="font-semibold text-primary hover:underline">
                        Sign in
                      </Link>
                    </p>
                  )}
                </motion.div>
              </form>
            </CardContent>
          </Card>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6 flex items-center justify-center gap-6 text-xs text-muted-foreground"
          >
            <div className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>500+ items reunited</span>
            </div>
            <div className="flex items-center gap-1.5">
              <GraduationCap className="h-3.5 w-3.5 text-primary" />
              <span>Campus verified</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </main>
  )
}
