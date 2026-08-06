import { Repeat, TrendingUp, Wallet } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/shared/stat-card";
import { AddIncomeDialog } from "@/components/dashboard/income/add-income-dialog";
import { IncomeTable } from "@/components/dashboard/income/income-table";
import { IncomeChart } from "@/components/dashboard/income/income-chart";
import { formatCurrency } from "@/lib/format";
import type { Income } from "@/lib/types";

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

export default async function IncomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data } = await supabase
    .from("incomes")
    .select("*")
    .eq("user_id", user!.id)
    .order("date", { ascending: false });

  const incomes = (data ?? []) as Income[];

  const now = new Date();
  const thisMonthTotal = incomes
    .filter((i) => {
      const d = new Date(i.date);
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    })
    .reduce((sum, i) => sum + Number(i.amount), 0);

  const recurringCount = incomes.filter((i) => i.is_recurring).length;
  const chartData = buildMonthlySeries(incomes);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Income</h1>
          <p className="text-muted-foreground">Track every income source in one place.</p>
        </div>
        <AddIncomeDialog />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          icon={Wallet}
          label="This Month"
          value={formatCurrency(thisMonthTotal)}
        />
        <StatCard
          icon={TrendingUp}
          label="Total Entries"
          value={String(incomes.length)}
        />
        <StatCard
          icon={Repeat}
          label="Recurring Income"
          value={String(recurringCount)}
        />
      </div>

      <Card className="border-border/60 p-5">
        <h2 className="mb-4 text-sm font-medium text-muted-foreground">
          Last 6 months
        </h2>
        <IncomeChart data={chartData} />
      </Card>

      <Card className="border-border/60 p-2 sm:p-4">
        <IncomeTable incomes={incomes} />
      </Card>
    </div>
  );
}
