const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

export interface Item {
  _id: string
  type: "lost" | "found"
  title: string
  description?: string
  location: string
  community: string
  image?: string
  status: string
  user: string
  createdAt: string
  updatedAt: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

function getAuthHeader(): HeadersInit {
  const token = typeof window !== "undefined" ? localStorage.getItem("lostlink_token") : null
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function fetchItems(): Promise<Item[]> {
  const res = await fetch(`${API_BASE}/items`)
  if (!res.ok) throw new Error("Failed to fetch items")
  return res.json()
}

export async function fetchItemsByCommunity(community: string): Promise<Item[]> {
  const res = await fetch(`${API_BASE}/items/community/${community}`)
  if (!res.ok) throw new Error("Failed to fetch items")
  return res.json()
}

export async function addItem(item: Omit<Item, "_id" | "user" | "createdAt" | "updatedAt" | "status">): Promise<{
  success: boolean
  item: Item
  matches: Item[]
}> {
  const res = await fetch(`${API_BASE}/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(item),
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || "Failed to add item")
  }

  return res.json()
}

export async function updateItemStatus(id: string, status: string): Promise<Item> {
  const res = await fetch(`${API_BASE}/items/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify({ status }),
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || "Failed to update item")
  }

  return res.json()
}

export async function deleteItem(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/items/${id}`, {
    method: "DELETE",
    headers: getAuthHeader(),
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || "Failed to delete item")
  }
}
