import { AuthShell } from "@/components/auth/auth-shell";
import { SignupForm } from "@/components/auth/signup-form";

export const metadata = { title: "Sign Up — Finora" };

export default function SignupPage() {
  return (
    <AuthShell
      title="Create your account"
      description="Start free, upgrade to premium whenever you're ready"
    >
      <SignupForm />
    </AuthShell>
  );
}
