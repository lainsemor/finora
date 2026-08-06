import { MailCheck } from "lucide-react";

import { AuthShell } from "@/components/auth/auth-shell";

export const metadata = { title: "Check Your Email — Finora" };

export default function ForgotPasswordCheckEmailPage() {
  return (
    <AuthShell
      title="Check your email"
      description="If an account exists for that email, we've sent a reset link"
    >
      <div className="flex flex-col items-center gap-3 py-2 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
          <MailCheck className="size-6" />
        </span>
        <p className="text-sm text-muted-foreground">
          Check your inbox (and spam folder) for a link to reset your password.
        </p>
      </div>
    </AuthShell>
  );
}
