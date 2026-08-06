import Link from "next/link";
import { Wallet } from "lucide-react";

export function MarketingFooter() {
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-10 text-sm text-muted-foreground sm:flex-row">
        <div className="flex items-center gap-2 font-medium text-foreground">
          <span className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Wallet className="size-3.5" />
          </span>
          Finora
        </div>
        <p>© {new Date().getFullYear()} Finora. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <Link href="/pricing" className="transition-colors hover:text-foreground">
            Pricing
          </Link>
          <Link href="/login" className="transition-colors hover:text-foreground">
            Log In
          </Link>
        </div>
      </div>
    </footer>
  );
}
