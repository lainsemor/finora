import Link from "next/link";
import { ArrowRight, PiggyBank, TrendingUp, Wallet2 } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { StatCard } from "@/components/dashboard/shared/stat-card";
import { IncomeChart } from "@/components/dashboard/income/income-chart";
import { EmptyState } from "@/components/dashboard/shared/empty-state";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Budget, BudgetCategory, Expense, Income, SavingsGoal } from "@/lib/types";

const monthLabel = new Intl.DateTimeFormat("en-US", { month: "short" });

function buildMonthlySeries(incomes: Income[]) {
  const now = new Date();
  const months: { key: string; month: string; total: number }[] = [];

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      key: `${d.getFullYear()}-${d.getMonth()}`,
      month: monthLabel.format(d),
      total: 0,
    });
  }

  for (const income of incomes) {
    const d = new Date(income.date);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const bucket = months.find((m) => m.key === key);
    if (bucket) bucket.total += Number(income.amount);
  }

  return months;
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [
    { data: incomes },
    { data: budgets },
    { data: categories },
    { data: expenses },
    { data: goals },
  ] = await Promise.all([
    supabase.from("incomes").select("*").eq("user_id", user!.id),
    supabase
      .from("budgets")
      .select("*")
      .eq("user_id", user!.id)
      .order("period_start", { ascending: false }),
    supabase.from("budget_categories").select("*").eq("user_id", user!.id),
    supabase.from("expenses").select("*").eq("user_id", user!.id),
    supabase
      .from("savings_goals")
      .select("*")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false }),
  ]);

  const incomeList = (incomes ?? []) as Income[];
  const budgetList = (budgets ?? []) as Budget[];
  const categoryList = (categories ?? []) as BudgetCategory[];
  const expenseList = (expenses ?? []) as Expense[];
  const goalList = (goals ?? []) as SavingsGoal[];

  const now = new Date();
  const thisMonthIncome = incomeList
    .filter((i) => {
      const d = new Date(i.date);
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    })
    .reduce((sum, i) => sum + Number(i.amount), 0);

  const currentBudget = budgetList.find((b) => {
    const start = new Date(b.period_start);
    const end = new Date(b.period_end);
    return now >= start && now <= end;
  }) ?? budgetList[0];

  const currentBudgetCategoryIds = new Set(
    categoryList.filter((c) => c.budget_id === currentBudget?.id).map((c) => c.id)
  );
  const currentBudgetSpent = expenseList
    .filter((e) => currentBudgetCategoryIds.has(e.budget_category_id))
    .reduce((sum, e) => sum + Number(e.amount), 0);

  const totalSaved = goalList.reduce((sum, g) => sum + Number(g.current_amount), 0);

  const chartData = buildMonthlySeries(incomeList);
  const hasAnyData = incomeList.length > 0 || budgetList.length > 0 || goalList.length > 0;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
        <p className="text-muted-foreground">
          Your income, budget, and savings at a glance.
        </p>
      </div>

      {!hasAnyData ? (
        <EmptyState
          icon={TrendingUp}
          title="No data yet"
          description="Add income, create a budget, or set a savings goal to get started."
          action={
            <div className="flex gap-2">
              <Button asChild size="sm">
                <Link href="/dashboard/income">Add Income</Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href="/dashboard/savings">Create Goal</Link>
              </Button>
            </div>
          }
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard icon={TrendingUp} label="This Month's Income" value={formatCurrency(thisMonthIncome)} />
            <StatCard
              icon={Wallet2}
              label={currentBudget ? `Budget: ${currentBudget.name}` : "Budget"}
              value={
                currentBudget
                  ? `${formatCurrency(currentBudgetSpent)} / ${formatCurrency(currentBudget.total_amount)}`
                  : "—"
              }
              tone={
                currentBudget && currentBudgetSpent > currentBudget.total_amount
                  ? "critical"
                  : "default"
              }
            />
            <StatCard icon={PiggyBank} label="Total Savings" value={formatCurrency(totalSaved)} />
          </div>

          <div className="grid gap-4 lg:grid-cols-5">
            <Card className="border-border/60 p-5 lg:col-span-3">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-medium text-muted-foreground">
                  Income — last 6 months
                </h2>
                <Button asChild variant="ghost" size="sm" className="h-auto gap-1 p-0 text-xs">
                  <Link href="/dashboard/income">
                    View all <ArrowRight className="size-3" />
                  </Link>
                </Button>
              </div>
              <IncomeChart data={chartData} />
            </Card>

            <Card className="flex flex-col border-border/60 p-5 lg:col-span-2">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-medium text-muted-foreground">
                  Savings Goals
                </h2>
                <Button asChild variant="ghost" size="sm" className="h-auto gap-1 p-0 text-xs">
                  <Link href="/dashboard/savings">
                    View all <ArrowRight className="size-3" />
                  </Link>
                </Button>
              </div>

              {goalList.length === 0 ? (
                <p className="flex flex-1 items-center justify-center text-center text-sm text-muted-foreground">
                  No goals yet
                </p>
              ) : (
                <div className="flex flex-1 flex-col justify-center gap-4">
                  {goalList.slice(0, 3).map((goal) => {
                    const pct =
                      goal.target_amount > 0
                        ? Math.min(100, (goal.current_amount / goal.target_amount) * 100)
                        : 0;
                    const reached = goal.current_amount >= goal.target_amount;
                    return (
                      <div key={goal.id} className="flex flex-col gap-1.5">
                        <div className="flex items-baseline justify-between text-sm">
                          <span className="font-medium">{goal.name}</span>
                          <span
                            className={cn(
                              "text-xs tabular-nums",
                              reached ? "text-status-good" : "text-muted-foreground"
                            )}
                          >
                            {pct.toFixed(0)}%
                          </span>
                        </div>
                        <Progress
                          value={pct}
                          indicatorClassName={reached ? "bg-status-good" : undefined}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
