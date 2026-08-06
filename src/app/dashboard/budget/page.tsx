import { Wallet2 } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { getIsPremium, FREE_LIMITS } from "@/lib/premium";
import { CreateBudgetDialog } from "@/components/dashboard/budget/create-budget-dialog";
import { BudgetCard } from "@/components/dashboard/budget/budget-card";
import { EmptyState } from "@/components/dashboard/shared/empty-state";
import type { Budget, BudgetCategory, Expense } from "@/lib/types";

export default async function BudgetPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: budgets }, { data: categories }, { data: expenses }] = await Promise.all([
    supabase
      .from("budgets")
      .select("*")
      .eq("user_id", user!.id)
      .order("period_start", { ascending: false }),
    supabase.from("budget_categories").select("*").eq("user_id", user!.id),
    supabase.from("expenses").select("*").eq("user_id", user!.id),
  ]);

  const budgetList = (budgets ?? []) as Budget[];
  const categoryList = (categories ?? []) as BudgetCategory[];
  const expenseList = (expenses ?? []) as Expense[];
  const isPremium = await getIsPremium(supabase, user!.id);
  const atBudgetLimit = !isPremium && budgetList.length >= FREE_LIMITS.budgets;

  const spentByBudget = new Map<string, number>();
  for (const category of categoryList) {
    const categorySpent = expenseList
      .filter((e) => e.budget_category_id === category.id)
      .reduce((sum, e) => sum + Number(e.amount), 0);
    spentByBudget.set(
      category.budget_id,
      (spentByBudget.get(category.budget_id) ?? 0) + categorySpent
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Budget</h1>
          <p className="text-muted-foreground">
            Split your spending into categories and stay on budget.
          </p>
        </div>
        <CreateBudgetDialog atLimit={atBudgetLimit} />
      </div>

      {budgetList.length === 0 ? (
        <EmptyState
          icon={Wallet2}
          title="No budgets yet"
          description="Create your first budget to start splitting your spending into categories."
          action={<CreateBudgetDialog />}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {budgetList.map((budget) => (
            <BudgetCard
              key={budget.id}
              budget={budget}
              spent={spentByBudget.get(budget.id) ?? 0}
            />
          ))}
        </div>
      )}
    </div>
  );
}
