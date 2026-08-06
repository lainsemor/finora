import { MailCheck } from "lucide-react";

import { AuthShell } from "@/components/auth/auth-shell";

export const metadata = { title: "Check Your Email — Finora" };

export default function CheckEmailPage() {
  return (
    <AuthShell
      title="Check your email"
      description="We've sent you a link to confirm your account"
    >
      <div className="flex flex-col items-center gap-3 py-2 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
          <MailCheck className="size-6" />
        </span>
        <p className="text-sm text-muted-foreground">
          Check your inbox (and spam folder) — you&apos;ll be logged in
          automatically once you click the confirmation link.
        </p>
      </div>
    </AuthShell>
  );
}
