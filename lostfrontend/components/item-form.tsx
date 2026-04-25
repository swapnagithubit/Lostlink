"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Package, Search, MapPin, FileText, Tag, ImageIcon, Loader2, CheckCircle, AlertCircle, Sparkles, Zap, PartyPopper, Building2, Coffee, BookOpen, Dumbbell, Bus, ShoppingBag, TreePine, Upload, X, Image as ImageComponent } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { addItem, type Item } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import { Navbar } from "./navbar"
import Link from "next/link"

interface ItemFormProps {
  type: "lost" | "found"
}

const communities = [
  { id: "library", label: "Library", icon: BookOpen },
  { id: "student-union", label: "Student Union", icon: Coffee },
  { id: "gym", label: "Gym", icon: Dumbbell },
  { id: "dorms", label: "Dorms", icon: Building2 },
  { id: "bus-stop", label: "Bus Stop", icon: Bus },
  { id: "cafeteria", label: "Cafeteria", icon: ShoppingBag },
  { id: "parking", label: "Parking", icon: TreePine },
  { id: "other", label: "Other", icon: MapPin },
]

export function ItemForm({ type }: ItemFormProps) {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [matches, setMatches] = useState<Item[]>([])
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageMethod, setImageMethod] = useState<"file" | "url">("file")

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    community: "library",
    image: "",
  })

  const isLost = type === "lost"

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be less than 5MB")
      return
    }

    try {
      const reader = new FileReader()
      reader.onload = (event) => {
        const result = event.target?.result as string
        setImagePreview(result)
        // Note: We show preview locally but won't send base64 to backend to avoid size issues
        setError(null)
      }
      reader.readAsDataURL(file)
    } catch (err) {
      setError("Failed to read image file")
    }
  }

  const handleRemoveImage = () => {
    setImagePreview(null)
    setFormData({ ...formData, image: "" })
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleUrlInput = (url: string) => {
    setFormData({ ...formData, image: url })
    setImagePreview(url)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const result = await addItem({
        type,
        ...formData,
      })

      setSuccess(true)
      setMatches(result.matches || [])

      setTimeout(() => {
        router.push("/dashboard")
      }, 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="relative flex min-h-screen items-center justify-center px-4 pt-20">
          <div className="mesh-gradient pointer-events-none fixed inset-0 -z-10 opacity-50" />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mx-auto w-full max-w-lg"
          >
            <Card className="overflow-hidden rounded-3xl border-0 bg-gradient-to-br from-emerald-500/10 via-card to-teal-500/10 shadow-2xl">
              <CardContent className="py-16 text-center">
                {/* Success Animation */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2, stiffness: 200 }}
                  className="relative mx-auto mb-6"
                >
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 shadow-xl shadow-emerald-500/30">
                    <CheckCircle className="h-12 w-12 text-white" />
                  </div>
                  <motion.div
                    animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute -inset-3 -z-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 blur-xl"
                  />
                </motion.div>

                {/* Confetti effect */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mb-4 flex items-center justify-center gap-2 text-emerald-600"
                >
                  <PartyPopper className="h-5 w-5" />
                  <span className="font-medium">Success!</span>
                  <PartyPopper className="h-5 w-5" />
                </motion.div>

                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-2xl font-bold"
                >
                  Item Reported!
                </motion.h3>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="mx-auto mt-3 max-w-sm text-muted-foreground"
                >
                  {isLost
                    ? "We'll notify you instantly when someone finds a matching item."
                    : "Thanks for helping! We'll connect you with the owner soon."}
                </motion.p>

                {matches.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="mx-auto mt-8 max-w-sm"
                  >
                    <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5">
                      <div className="flex items-center justify-center gap-2 text-amber-600">
                        <motion.div
                          animate={{ rotate: [0, 15, -15, 0] }}
                          transition={{ repeat: Infinity, duration: 1 }}
                        >
                          <Zap className="h-5 w-5" />
                        </motion.div>
                        <span className="font-semibold">{matches.length} Potential Match{matches.length > 1 ? "es" : ""}!</span>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Check your dashboard to see the details
                      </p>
                    </div>
                  </motion.div>
                )}

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="mt-8 text-sm text-muted-foreground"
                >
                  Redirecting to dashboard...
                </motion.p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      <div className="relative min-h-screen px-4 pb-16 pt-24 lg:pt-28">
        {/* Animated Background */}
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="mesh-gradient absolute inset-0 opacity-50" />
          <motion.div
            animate={{
              x: [0, 50, 0],
              y: [0, -30, 0],
            }}
            transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }}
            className={`absolute left-0 top-1/4 h-72 w-72 rounded-full ${
              isLost ? "bg-rose-500/20" : "bg-emerald-500/20"
            } blur-3xl`}
          />
          <motion.div
            animate={{
              x: [0, -40, 0],
              y: [0, 40, 0],
            }}
            transition={{ repeat: Infinity, duration: 25, ease: "easeInOut", delay: 2 }}
            className={`absolute right-0 bottom-1/4 h-80 w-80 rounded-full ${
              isLost ? "bg-orange-500/15" : "bg-teal-500/15"
            } blur-3xl`}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-2xl"
        >
          {/* Glow effect */}
          <div className={`absolute -inset-1 rounded-[2rem] bg-gradient-to-r ${
            isLost 
              ? "from-rose-500/30 via-orange-500/30 to-amber-500/30" 
              : "from-emerald-500/30 via-teal-500/30 to-cyan-500/30"
          } opacity-40 blur-xl`} />
          
          <Card className="relative overflow-hidden rounded-3xl border-0 bg-card/90 shadow-2xl backdrop-blur-xl">
            {/* Gradient border */}
            <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${
              isLost 
                ? "from-rose-500/20 via-orange-500/20 to-amber-500/20"
                : "from-emerald-500/20 via-teal-500/20 to-cyan-500/20"
            }`} />
            <div className="absolute inset-[1px] rounded-[23px] bg-card" />

            <CardHeader className="relative z-10 pb-4 text-center">
              {/* Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="mx-auto mb-4"
              >
                <div className="relative">
                  <div className={`flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br ${
                    isLost 
                      ? "from-rose-500 to-orange-500 shadow-rose-500/30" 
                      : "from-emerald-500 to-teal-500 shadow-emerald-500/30"
                  } shadow-xl`}>
                    {isLost ? (
                      <Search className="h-10 w-10 text-white" />
                    ) : (
                      <Package className="h-10 w-10 text-white" />
                    )}
                  </div>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className={`absolute -inset-2 -z-10 rounded-3xl bg-gradient-to-br ${
                      isLost ? "from-rose-500 to-orange-500" : "from-emerald-500 to-teal-500"
                    } blur-xl`}
                  />
                </div>
              </motion.div>
              
              <CardTitle className="text-2xl font-bold sm:text-3xl">
                Report {isLost ? "Lost" : "Found"} Item
              </CardTitle>
              <CardDescription className="mt-2 text-base">
                {isLost
                  ? "Tell us what you lost and we'll help find it"
                  : "Help reunite someone with their belongings"}
              </CardDescription>
            </CardHeader>

            <CardContent className="relative z-10 px-6 pb-8 sm:px-8">
              <form onSubmit={handleSubmit} className="space-y-6">
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

                {/* Title */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-2"
                >
                  <Label htmlFor="title" className="flex items-center gap-2 text-sm font-medium">
                    <FileText className="h-4 w-4 text-primary" />
                    What is it?
                  </Label>
                  <Input
                    id="title"
                    placeholder={isLost ? "e.g., Blue Nike Backpack" : "e.g., Found AirPods Pro"}
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    onFocus={() => setFocusedField("title")}
                    onBlur={() => setFocusedField(null)}
                    required
                    className={`h-12 rounded-xl border-2 bg-accent/30 text-base transition-all ${
                      focusedField === "title" ? "border-primary ring-4 ring-primary/10" : "border-transparent"
                    }`}
                  />
                </motion.div>

                {/* Description */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-2"
                >
                  <Label htmlFor="description" className="flex items-center gap-2 text-sm font-medium">
                    <FileText className="h-4 w-4 text-primary" />
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Add any details that would help identify it (color, brand, unique marks...)"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    onFocus={() => setFocusedField("description")}
                    onBlur={() => setFocusedField(null)}
                    rows={3}
                    className={`resize-none rounded-xl border-2 bg-accent/30 text-base transition-all ${
                      focusedField === "description" ? "border-primary ring-4 ring-primary/10" : "border-transparent"
                    }`}
                  />
                </motion.div>

                {/* Location */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-2"
                >
                  <Label htmlFor="location" className="flex items-center gap-2 text-sm font-medium">
                    <MapPin className="h-4 w-4 text-primary" />
                    {isLost ? "Last seen at?" : "Where did you find it?"}
                  </Label>
                  <Input
                    id="location"
                    placeholder="e.g., Near the fountain in front of Smith Hall"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    onFocus={() => setFocusedField("location")}
                    onBlur={() => setFocusedField(null)}
                    required
                    className={`h-12 rounded-xl border-2 bg-accent/30 text-base transition-all ${
                      focusedField === "location" ? "border-primary ring-4 ring-primary/10" : "border-transparent"
                    }`}
                  />
                </motion.div>

                {/* Community / Area */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-3"
                >
                  <Label className="flex items-center gap-2 text-sm font-medium">
                    <Tag className="h-4 w-4 text-primary" />
                    Campus Area
                  </Label>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {communities.map((community) => {
                      const Icon = community.icon
                      const isSelected = formData.community === community.id
                      return (
                        <motion.button
                          key={community.id}
                          type="button"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setFormData({ ...formData, community: community.id })}
                          className={`flex flex-col items-center gap-2 rounded-xl p-3 text-sm font-medium transition-all ${
                            isSelected
                              ? isLost
                                ? "bg-gradient-to-br from-rose-500 to-orange-500 text-white shadow-lg shadow-rose-500/25"
                                : "bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25"
                              : "bg-accent/50 text-muted-foreground hover:bg-accent hover:text-foreground"
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                          <span className="text-xs">{community.label}</span>
                        </motion.button>
                      )
                    })}
                  </div>
                </motion.div>

                {/* Image Upload */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-3"
                >
                  <Label className="flex items-center gap-2 text-sm font-medium">
                    <ImageIcon className="h-4 w-4 text-primary" />
                    Add Image <span className="text-muted-foreground">(optional)</span>
                  </Label>

                  {/* Image Preview */}
                  <AnimatePresence>
                    {imagePreview && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="relative overflow-hidden rounded-xl border-2 border-primary/30 bg-accent/50"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="h-48 w-full object-cover"
                        />
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={handleRemoveImage}
                          className="absolute right-2 top-2 rounded-lg bg-rose-500/90 p-1.5 text-white transition-all hover:bg-rose-600"
                        >
                          <X className="h-4 w-4" />
                        </motion.button>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/40 to-transparent p-3">
                          <p className="text-xs text-white">Image preview</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Image Method Selector */}
                  <div className="flex gap-2">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setImageMethod("file")}
                      className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 font-medium transition-all ${
                        imageMethod === "file"
                          ? isLost
                            ? "bg-rose-500/20 text-rose-600 ring-2 ring-rose-500/50"
                            : "bg-emerald-500/20 text-emerald-600 ring-2 ring-emerald-500/50"
                          : "bg-accent/50 text-muted-foreground hover:bg-accent"
                      }`}
                    >
                      <Upload className="h-4 w-4" />
                      <span className="text-sm">Upload</span>
                    </motion.button>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setImageMethod("url")}
                      className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 font-medium transition-all ${
                        imageMethod === "url"
                          ? isLost
                            ? "bg-rose-500/20 text-rose-600 ring-2 ring-rose-500/50"
                            : "bg-emerald-500/20 text-emerald-600 ring-2 ring-emerald-500/50"
                          : "bg-accent/50 text-muted-foreground hover:bg-accent"
                      }`}
                    >
                      <ImageComponent className="h-4 w-4" />
                      <span className="text-sm">URL</span>
                    </motion.button>
                  </div>

                  {/* File Input */}
                  {imageMethod === "file" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden space-y-3"
                    >
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed border-primary/40 bg-primary/5 p-6 transition-all hover:border-primary/60 hover:bg-primary/10"
                      >
                        <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${
                          isLost ? "bg-rose-500/20" : "bg-emerald-500/20"
                        }`}>
                          <Upload className={`h-6 w-6 ${isLost ? "text-rose-500" : "text-emerald-500"}`} />
                        </div>
                        <div className="text-center">
                          <p className="font-medium">Tap to select an image</p>
                          <p className="text-xs text-muted-foreground">or take a photo from your camera</p>
                        </div>
                        <p className="text-xs text-muted-foreground">Max 5MB • JPG, PNG, GIF</p>
                      </div>
                      <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3">
                        <p className="text-xs text-amber-700">
                          💡 <strong>Tip:</strong> For best results, use an image URL. You can upload your image to <a href="https://imgur.com" target="_blank" rel="noopener noreferrer" className="underline font-semibold hover:text-amber-800">Imgur</a> or <a href="https://imgbb.com" target="_blank" rel="noopener noreferrer" className="underline font-semibold hover:text-amber-800">ImgBB</a> (free), then paste the URL below.
                        </p>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                        capture="environment"
                      />
                    </motion.div>
                  )}

                  {/* URL Input */}
                  {imageMethod === "url" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <Input
                        type="url"
                        placeholder="https://example.com/image.jpg"
                        value={imageMethod === "url" ? formData.image : ""}
                        onChange={(e) => handleUrlInput(e.target.value)}
                        onFocus={() => setFocusedField("image")}
                        onBlur={() => setFocusedField(null)}
                        className={`h-12 rounded-xl border-2 bg-accent/30 text-base transition-all ${
                          focusedField === "image" ? "border-primary ring-4 ring-primary/10" : "border-transparent"
                        }`}
                      />
                    </motion.div>
                  )}
                </motion.div>

                {/* Submit Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="pt-4"
                >
                  <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                    <Button
                      type="submit"
                      size="lg"
                      disabled={isSubmitting}
                      className={`relative h-14 w-full gap-2 overflow-hidden rounded-xl bg-gradient-to-r ${
                        isLost
                          ? "from-rose-500 to-orange-500 shadow-rose-500/25"
                          : "from-emerald-500 to-teal-500 shadow-emerald-500/25"
                      } text-base font-semibold shadow-xl transition-all hover:shadow-2xl`}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          {isLost ? <Search className="h-5 w-5" /> : <Package className="h-5 w-5" />}
                          Submit Report
                          <Sparkles className="h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </motion.div>
                </motion.div>

                {!isAuthenticated && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="text-center text-sm text-muted-foreground"
                  >
                    You&apos;ll need to{" "}
                    <Link href="/login" className="font-semibold text-primary hover:underline">
                      log in
                    </Link>{" "}
                    to submit this report.
                  </motion.p>
                )}
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </main>
  )
}
