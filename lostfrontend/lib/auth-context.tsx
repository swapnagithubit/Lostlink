"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  name: string
  email: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing token on mount
    const storedToken = localStorage.getItem("FindMyThing_token")
    const storedUser = localStorage.getItem("FindMyThing_user")
    
    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        const contentType = res.headers.get("content-type")
        if (contentType?.includes("application/json")) {
          const error = await res.json()
          throw new Error(error.msg || error.message || "Login failed")
        } else {
          throw new Error(`Server error: ${res.status} ${res.statusText}. Is the backend running?`)
        }
      }

      const data = await res.json()
      const newToken = data.token

      // Decode JWT to get user info (simple decode, not verification)
      const payload = JSON.parse(atob(newToken.split(".")[1]))
      const newUser = { id: payload.id, name: email.split("@")[0], email }

      setToken(newToken)
      setUser(newUser)
      localStorage.setItem("FindMyThing_token", newToken)
      localStorage.setItem("FindMyThing_user", JSON.stringify(newUser))
    } catch (err) {
      if (err instanceof Error) {
        throw err
      }
      throw new Error("Network error. Is the backend running at http://localhost:5000?")
    }
  }

  const signup = async (name: string, email: string, password: string) => {
    try {
      const res = await fetch(`${API_BASE}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })

      if (!res.ok) {
        const contentType = res.headers.get("content-type")
        if (contentType?.includes("application/json")) {
          const error = await res.json()
          throw new Error(error.error || error.message || "Signup failed")
        } else {
          throw new Error(`Server error: ${res.status} ${res.statusText}. Is the backend running?`)
        }
      }

      const data = await res.json()
      
      // If token is in signup response, use it directly
      if (data.token) {
        const newToken = data.token
        const payload = JSON.parse(atob(newToken.split(".")[1]))
        const newUser = { id: payload.id, name: data.user?.name || email.split("@")[0], email: data.user?.email || email }

        setToken(newToken)
        setUser(newUser)
        localStorage.setItem("FindMyThing_token", newToken)
        localStorage.setItem("FindMyThing_user", JSON.stringify(newUser))
      } else {
        // Fallback: auto login after signup
        await login(email, password)
      }
    } catch (err) {
      if (err instanceof Error) {
        throw err
      }
      throw new Error("Network error. Is the backend running?")
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem("FindMyThing_token")
    localStorage.removeItem("FindMyThing_user")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        signup,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
