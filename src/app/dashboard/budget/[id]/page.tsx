import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Layers } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { getIsPremium, FREE_LIMITS } from "@/lib/premium";
import { Card } from "@/components/ui/card";
import { AddCategoryDialog } from "@/components/dashboard/budget/add-category-dialog";
import { CategoryCard } from "@/components/dashboard/budget/category-card";
import { BudgetDonutChart } from "@/components/dashboard/budget/budget-donut-chart";
import { DeleteBudgetButton } from "@/components/dashboard/budget/delete-budget-button";
import { EmptyState } from "@/components/dashboard/shared/empty-state";
import { ExportCsvButton } from "@/components/dashboard/shared/export-csv-button";
import { formatCurrency, formatDate } from "@/lib/format";
import type { Budget, BudgetCategory, Expense } from "@/lib/types";

export default async function BudgetDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: budget } = await supabase
    .from("budgets")
    .select("*")
    .eq("id", id)
    .eq("user_id", user!.id)
    .single();

  if (!budget) notFound();

  const [{ data: categories }, { data: expenses }] = await Promise.all([
    supabase
      .from("budget_categories")
      .select("*")
      .eq("budget_id", id)
      .order("created_at", { ascending: true }),
    supabase
      .from("expenses")
      .select("*, budget_categories!inner(budget_id)")
      .eq("budget_categories.budget_id", id),
  ]);

  const categoryList = (categories ?? []) as BudgetCategory[];
  const expenseList = (expenses ?? []) as Expense[];
  const typedBudget = budget as Budget;
  const isPremium = await getIsPremium(supabase, user!.id);
  const atCategoryLimit = !isPremium && categoryList.length >= FREE_LIMITS.categoriesPerBudget;

  const categoryNameById = new Map(categoryList.map((c) => [c.id, c.name]));
  const totalSpent = expenseList.reduce((sum, e) => sum + Number(e.amount), 0);

  const chartData = categoryList.map((c) => ({
    name: c.name,
    value: expenseList
      .filter((e) => e.budget_category_id === c.id)
      .reduce((sum, e) => sum + Number(e.amount), 0),
  }));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          href="/dashboard/budget"
          className="mb-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Back to budgets
        </Link>
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{typedBudget.name}</h1>
            <p className="text-muted-foreground">
              {formatDate(typedBudget.period_start)} – {formatDate(typedBudget.period_end)} ·{" "}
              {formatCurrency(totalSpent)} / {formatCurrency(typedBudget.total_amount)} spent
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ExportCsvButton
              filename={`${typedBudget.name}-expenses.csv`}
              isPremium={isPremium}
              columns={[
                { key: "category", label: "Category" },
                { key: "description", label: "Description" },
                { key: "date", label: "Date" },
                { key: "amount", label: "Amount" },
              ]}
              data={expenseList.map((e) => ({
                category: categoryNameById.get(e.budget_category_id) ?? "",
                description: e.description ?? "",
                date: formatDate(e.date),
                amount: e.amount,
              }))}
            />
            <AddCategoryDialog budgetId={id} atLimit={atCategoryLimit} />
            <DeleteBudgetButton budgetId={id} />
          </div>
        </div>
      </div>

      {categoryList.length > 0 && (
        <Card className="border-border/60 p-5">
          <h2 className="mb-4 text-sm font-medium text-muted-foreground">
            Spending by category
          </h2>
          <BudgetDonutChart data={chartData} />
        </Card>
      )}

      {categoryList.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="No categories yet"
          description="Split your budget into categories to track your spending more clearly."
          action={<AddCategoryDialog budgetId={id} />}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {categoryList.map((category) => (
            <CategoryCard
              key={category.id}
              budgetId={id}
              category={category}
              expenses={expenseList.filter((e) => e.budget_category_id === category.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
