import { AuthForm } from "@/components/auth-form"

export const metadata = {
  title: "Sign Up - FindMyThing",
  description: "Create a FindMyThing account to start reporting and finding lost items on campus.",
}

export default function SignupPage() {
  return <AuthForm mode="signup" />
}
