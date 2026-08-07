"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { formatCurrency } from "@/lib/format";

export function IncomeExpenseChart({
  data,
}: {
  data: { month: string; income: number; expense: number }[];
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span
            className="size-2.5 rounded-full"
            style={{ background: "var(--chart-1)" }}
          />
          Income
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="size-2.5 rounded-full"
            style={{ background: "var(--chart-2)" }}
          />
          Expenses
        </span>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
          />
          <YAxis hide />
          <Tooltip
            cursor={{ fill: "var(--muted)" }}
            contentStyle={{
              background: "var(--popover)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)",
              fontSize: 12,
              color: "var(--popover-foreground)",
            }}
            formatter={(value, name) => [
              formatCurrency(Number(value)),
              name === "income" ? "Income" : "Expenses",
            ]}
          />
          <Bar dataKey="income" fill="var(--chart-1)" radius={[4, 4, 0, 0]} maxBarSize={28} isAnimationActive={false} />
          <Bar dataKey="expense" fill="var(--chart-2)" radius={[4, 4, 0, 0]} maxBarSize={28} isAnimationActive={false} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
