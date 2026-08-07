import { BarChart3, PiggyBank, TrendingDown, TrendingUp } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { getIsPremium } from "@/lib/premium";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/shared/stat-card";
import { PremiumLockedPage } from "@/components/dashboard/shared/premium-locked-page";
import { IncomeExpenseChart } from "@/components/dashboard/analytics/income-expense-chart";
import { SavingsTrendChart } from "@/components/dashboard/analytics/savings-trend-chart";
import { BudgetDonutChart } from "@/components/dashboard/budget/budget-donut-chart";
import { formatCurrency } from "@/lib/format";
import type {
  BudgetCategory,
  Expense,
  Income,
  SavingsContribution,
} from "@/lib/types";

const monthLabel = new Intl.DateTimeFormat("en-US", { month: "short" });

function lastSixMonths() {
  const now = new Date();
  const months: { key: string; month: string }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ key: `${d.getFullYear()}-${d.getMonth()}`, month: monthLabel.format(d) });
  }
  return months;
}

function monthKey(date: string) {
  const d = new Date(date);
  return `${d.getFullYear()}-${d.getMonth()}`;
}

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isPremium = await getIsPremium(supabase, user!.id);

  if (!isPremium) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Deeper insight into your income, spending, and savings.
          </p>
        </div>
        <PremiumLockedPage
          title="Advanced analytics is a premium feature"
          description="Upgrade to see income vs. expense trends, category breakdowns, and your savings growth over time."
        />
      </div>
    );
  }

  const [
    { data: incomes },
    { data: categories },
    { data: expenses },
    { data: contributions },
  ] = await Promise.all([
    supabase.from("incomes").select("*").eq("user_id", user!.id),
    supabase.from("budget_categories").select("*").eq("user_id", user!.id),
    supabase.from("expenses").select("*").eq("user_id", user!.id),
    supabase
      .from("savings_contributions")
      .select("*, savings_goals!inner(user_id)")
      .eq("savings_goals.user_id", user!.id),
  ]);

  const incomeList = (incomes ?? []) as Income[];
  const categoryList = (categories ?? []) as BudgetCategory[];
  const expenseList = (expenses ?? []) as Expense[];
  const contributionList = (contributions ?? []) as SavingsContribution[];

  const months = lastSixMonths();

  const incomeVsExpense = months.map(({ key, month }) => ({
    month,
    income: incomeList
      .filter((i) => monthKey(i.date) === key)
      .reduce((sum, i) => sum + Number(i.amount), 0),
    expense: expenseList
      .filter((e) => monthKey(e.date) === key)
      .reduce((sum, e) => sum + Number(e.amount), 0),
  }));

  const savingsTrend = months.map(({ key, month }) => ({
    month,
    total: contributionList
      .filter((c) => monthKey(c.date) === key)
      .reduce((sum, c) => sum + Number(c.amount), 0),
  }));

  const categoryNameById = new Map(categoryList.map((c) => [c.id, c.name]));
  const spendByCategoryName = new Map<string, number>();
  for (const expense of expenseList) {
    const name = categoryNameById.get(expense.budget_category_id) ?? "Other";
    spendByCategoryName.set(
      name,
      (spendByCategoryName.get(name) ?? 0) + Number(expense.amount)
    );
  }
  const categoryBreakdown = Array.from(spendByCategoryName.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const totalIncome = incomeList.reduce((sum, i) => sum + Number(i.amount), 0);
  const totalExpenses = expenseList.reduce((sum, e) => sum + Number(e.amount), 0);
  const totalSaved = contributionList.reduce((sum, c) => sum + Number(c.amount), 0);
  const savingsRate = totalIncome > 0 ? (totalSaved / totalIncome) * 100 : 0;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Deeper insight into your income, spending, and savings.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={TrendingUp} label="Total Income" value={formatCurrency(totalIncome)} />
        <StatCard
          icon={TrendingDown}
          label="Total Expenses"
          value={formatCurrency(totalExpenses)}
        />
        <StatCard icon={PiggyBank} label="Total Saved" value={formatCurrency(totalSaved)} />
        <StatCard
          icon={BarChart3}
          label="Savings Rate"
          value={`${savingsRate.toFixed(0)}%`}
          hint="of total income"
        />
      </div>

      <Card className="border-border/60 p-5">
        <h2 className="mb-4 text-sm font-medium text-muted-foreground">
          Income vs. expenses — last 6 months
        </h2>
        <IncomeExpenseChart data={incomeVsExpense} />
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-border/60 p-5">
          <h2 className="mb-4 text-sm font-medium text-muted-foreground">
            Top spending categories
          </h2>
          <BudgetDonutChart data={categoryBreakdown} />
        </Card>

        <Card className="border-border/60 p-5">
          <h2 className="mb-4 text-sm font-medium text-muted-foreground">
            Savings contributions — last 6 months
          </h2>
          <SavingsTrendChart data={savingsTrend} />
        </Card>
      </div>
    </div>
  );
}
