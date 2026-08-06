import type { LucideIcon } from "lucide-react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  tone = "default",
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  hint?: string;
  tone?: "default" | "good" | "warning" | "critical";
}) {
  return (
    <Card className="gap-3 border-border/60 p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-4" />
        </span>
      </div>
      <p className="text-2xl font-semibold tracking-tight tabular-nums">{value}</p>
      {hint && (
        <p
          className={cn(
            "text-xs",
            tone === "good" && "text-status-good",
            tone === "warning" && "text-status-warning",
            tone === "critical" && "text-status-critical",
            tone === "default" && "text-muted-foreground"
          )}
        >
          {hint}
        </p>
      )}
    </Card>
  );
}
