import Link from "next/link";
import { Lock } from "lucide-react";

import { Button } from "@/components/ui/button";

export function PremiumLockedPage({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-border/70 px-6 py-20 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Lock className="size-5" />
      </span>
      <div className="flex flex-col gap-1">
        <p className="text-lg font-semibold">{title}</p>
        <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      </div>
      <Button asChild className="mt-2">
        <Link href="/pricing">Upgrade to Premium</Link>
      </Button>
    </div>
  );
}
