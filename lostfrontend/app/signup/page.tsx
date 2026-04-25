import { AuthForm } from "@/components/auth-form"

export const metadata = {
  title: "Sign Up - LostLink",
  description: "Create a LostLink account to start reporting and finding lost items on campus.",
}

export default function SignupPage() {
  return <AuthForm mode="signup" />
}
