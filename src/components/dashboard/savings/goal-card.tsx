import { CalendarDays } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DeleteIconButton } from "@/components/dashboard/shared/delete-icon-button";
import { AddContributionDialog } from "@/components/dashboard/savings/add-contribution-dialog";
import { deleteGoal } from "@/app/dashboard/savings/actions";
import { formatCurrency, formatDate } from "@/lib/format";
import type { SavingsGoal } from "@/lib/types";

export function GoalCard({ goal }: { goal: SavingsGoal }) {
  const pct =
    goal.target_amount > 0
      ? Math.min(100, (goal.current_amount / goal.target_amount) * 100)
      : 0;
  const reached = goal.current_amount >= goal.target_amount;

  return (
    <Card className="gap-4 border-border/60 p-5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold">{goal.name}</h3>
          {goal.target_date && (
            <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
              <CalendarDays className="size-3" />
              {formatDate(goal.target_date)}
            </p>
          )}
        </div>
        <DeleteIconButton label="Delete goal" action={deleteGoal.bind(null, goal.id)} />
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-baseline justify-between text-sm">
          <span
            className={
              reached ? "font-semibold text-status-good tabular-nums" : "font-medium tabular-nums"
            }
          >
            {formatCurrency(goal.current_amount)}
          </span>
          <span className="text-muted-foreground tabular-nums">
            / {formatCurrency(goal.target_amount)}
          </span>
        </div>
        <Progress
          value={pct}
          indicatorClassName={reached ? "bg-status-good" : undefined}
        />
        <span className="text-xs text-muted-foreground">{pct.toFixed(0)}% complete</span>
      </div>

      <AddContributionDialog goalId={goal.id} goalName={goal.name} />
    </Card>
  );
}
