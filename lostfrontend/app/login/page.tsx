import { AuthForm } from "@/components/auth-form"

export const metadata = {
  title: "Login - LostLink",
  description: "Sign in to your LostLink account to manage your lost and found items.",
}

export default function LoginPage() {
  return <AuthForm mode="login" />
}
