"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Lock, Loader2, AlertCircle, CheckCircle, Eye, EyeOff, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Navbar } from "@/components/navbar"

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (newPassword !== confirmPassword) {
      setError("Passwords don't match!")
      return
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters!")
      return
    }

    setIsSubmitting(true)

    try {
      const res = await fetch(`${API_BASE}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Something went wrong")

      setSuccess(true)
      setTimeout(() => router.push("/login"), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!token) {
    return (
      <div className="flex flex-col items-center gap-4 py-6 text-center">
        <AlertCircle className="h-12 w-12 text-rose-500" />
        <h3 className="text-lg font-semibold">Invalid Reset Link</h3>
        <p className="text-muted-foreground">This reset link is invalid or has expired.</p>
        <Link href="/forgot-password">
          <Button variant="outline" className="rounded-xl">Request New Link</Button>
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-600"
          >
            <AlertCircle className="h-5 w-5 shrink-0" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {success ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4 py-6 text-center"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
            <CheckCircle className="h-8 w-8 text-emerald-500" />
          </div>
          <h3 className="text-lg font-semibold">Password Reset!</h3>
          <p className="text-muted-foreground">
            Your password has been reset successfully. Redirecting to login...
          </p>
        </motion.div>
      ) : (
        <>
          <div className="space-y-2">
            <Label htmlFor="newPassword" className="flex items-center gap-2 text-sm font-medium">
              <Lock className="h-4 w-4 text-primary" />
              New Password
            </Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                onFocus={() => setFocusedField("newPassword")}
                onBlur={() => setFocusedField(null)}
                required
                minLength={6}
                className={`h-12 rounded-xl border-2 bg-accent/30 pl-11 pr-11 text-base transition-all ${
                  focusedField === "newPassword" ? "border-primary ring-4 ring-primary/10" : "border-transparent"
                }`}
              />
              <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="flex items-center gap-2 text-sm font-medium">
              <Lock className="h-4 w-4 text-primary" />
              Confirm Password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onFocus={() => setFocusedField("confirmPassword")}
                onBlur={() => setFocusedField(null)}
                required
                className={`h-12 rounded-xl border-2 bg-accent/30 pl-11 text-base transition-all ${
                  focusedField === "confirmPassword" ? "border-primary ring-4 ring-primary/10" : "border-transparent"
                }`}
              />
              <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="h-12 w-full gap-2 rounded-xl bg-gradient-to-r from-primary to-violet-500 text-base font-semibold shadow-lg shadow-primary/25"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Resetting...
              </>
            ) : (
              <>
                <Lock className="h-4 w-4" />
                Reset Password
              </>
            )}
          </Button>
        </>
      )}
    </form>
  )
}

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="relative flex min-h-screen items-center justify-center px-4 pt-20">
        <div className="mesh-gradient pointer-events-none fixed inset-0 -z-10 opacity-60" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-r from-primary/30 via-violet-500/30 to-cyan-500/30 opacity-50 blur-xl" />

          <Card className="relative overflow-hidden rounded-3xl border-0 bg-card/90 shadow-2xl backdrop-blur-xl">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary/20 via-violet-500/20 to-cyan-500/20" />
            <div className="absolute inset-[1px] rounded-[23px] bg-card" />

            <CardHeader className="relative z-10 pb-4 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.1 }}
                className="mx-auto mb-4"
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-primary to-violet-500 shadow-xl shadow-primary/30">
                  <Zap className="h-10 w-10 text-white" />
                </div>
              </motion.div>
              <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
              <CardDescription className="mt-2 text-base">
                Enter your new password below
              </CardDescription>
            </CardHeader>

            <CardContent className="relative z-10 px-6 pb-8 pt-2 sm:px-8">
              <Suspense fallback={<Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />}>
                <ResetPasswordForm />
              </Suspense>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </main>
  )
}