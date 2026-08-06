import { PiggyBank } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { StatCard } from "@/components/dashboard/shared/stat-card";
import { CreateGoalDialog } from "@/components/dashboard/savings/create-goal-dialog";
import { GoalCard } from "@/components/dashboard/savings/goal-card";
import { EmptyState } from "@/components/dashboard/shared/empty-state";
import { formatCurrency } from "@/lib/format";
import type { SavingsGoal } from "@/lib/types";

export default async function SavingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data } = await supabase
    .from("savings_goals")
    .select("*")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  const goals = (data ?? []) as SavingsGoal[];
  const totalSaved = goals.reduce((sum, g) => sum + Number(g.current_amount), 0);
  const totalTarget = goals.reduce((sum, g) => sum + Number(g.target_amount), 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Savings</h1>
          <p className="text-muted-foreground">
            Set a target amount and date for your goals, and track your progress.
          </p>
        </div>
        <CreateGoalDialog />
      </div>

      {goals.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          <StatCard
            icon={PiggyBank}
            label="Total Saved"
            value={formatCurrency(totalSaved)}
          />
          <StatCard
            icon={PiggyBank}
            label="Total Target"
            value={formatCurrency(totalTarget)}
          />
        </div>
      )}

      {goals.length === 0 ? (
        <EmptyState
          icon={PiggyBank}
          title="No savings goals yet"
          description="Create your first goal to start tracking your savings."
          action={<CreateGoalDialog />}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {goals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </div>
      )}
    </div>
  );
}
