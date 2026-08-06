import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatCurrency, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Budget } from "@/lib/types";

export function BudgetCard({
  budget,
  spent,
}: {
  budget: Budget;
  spent: number;
}) {
  const pct = budget.total_amount > 0 ? Math.min(100, (spent / budget.total_amount) * 100) : 0;
  const overBudget = spent > budget.total_amount;

  return (
    <Link href={`/dashboard/budget/${budget.id}`}>
      <Card className="group gap-4 border-border/60 p-5 transition-colors hover:border-primary/40">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold">{budget.name}</h3>
            <p className="text-xs text-muted-foreground">
              {formatDate(budget.period_start)} – {formatDate(budget.period_end)}
            </p>
          </div>
          <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-baseline justify-between text-sm">
            <span
              className={cn(
                "font-medium tabular-nums",
                overBudget ? "text-status-critical" : "text-foreground"
              )}
            >
              {formatCurrency(spent)}
            </span>
            <span className="text-muted-foreground tabular-nums">
              / {formatCurrency(budget.total_amount)}
            </span>
          </div>
          <Progress
            value={pct}
            indicatorClassName={overBudget ? "bg-status-critical" : undefined}
          />
        </div>
      </Card>
    </Link>
  );
}
