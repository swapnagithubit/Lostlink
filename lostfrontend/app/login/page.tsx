import { AuthForm } from "@/components/auth-form"

export const metadata = {
  title: "Login - FindMyThing",
  description: "Sign in to your FindMyThing account to manage your lost and found items.",
}

export default function LoginPage() {
  return <AuthForm mode="login" />
}
