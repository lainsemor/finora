import { Progress } from "@/components/ui/progress";
import { DeleteIconButton } from "@/components/dashboard/shared/delete-icon-button";
import { AddExpenseDialog } from "@/components/dashboard/budget/add-expense-dialog";
import { deleteCategory, deleteExpense } from "@/app/dashboard/budget/actions";
import { formatCurrency, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { BudgetCategory, Expense } from "@/lib/types";

export function CategoryCard({
  budgetId,
  category,
  expenses,
}: {
  budgetId: string;
  category: BudgetCategory;
  expenses: Expense[];
}) {
  const spent = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const pct =
    category.allocated_amount > 0
      ? Math.min(100, (spent / category.allocated_amount) * 100)
      : 0;
  const overBudget = spent > category.allocated_amount;

  return (
    <div className="rounded-xl border border-border/60 p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <h3 className="font-medium">{category.name}</h3>
          <div className="mt-1.5 flex items-baseline gap-1.5 text-sm">
            <span
              className={cn(
                "font-medium tabular-nums",
                overBudget ? "text-status-critical" : "text-foreground"
              )}
            >
              {formatCurrency(spent)}
            </span>
            <span className="text-muted-foreground tabular-nums">
              / {formatCurrency(category.allocated_amount)}
            </span>
          </div>
          <Progress
            value={pct}
            className="mt-2"
            indicatorClassName={overBudget ? "bg-status-critical" : undefined}
          />
        </div>
        <DeleteIconButton
          label="Delete category"
          action={deleteCategory.bind(null, budgetId, category.id)}
        />
      </div>

      {expenses.length > 0 && (
        <ul className="mt-3 flex flex-col divide-y divide-border/60 border-t border-border/60">
          {expenses.map((expense) => (
            <li
              key={expense.id}
              className="flex items-center justify-between gap-2 py-2 text-sm"
            >
              <div className="flex flex-col">
                <span>{expense.description || "Expense"}</span>
                <span className="text-xs text-muted-foreground">
                  {formatDate(expense.date)}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="tabular-nums">{formatCurrency(expense.amount)}</span>
                <DeleteIconButton
                  label="Delete expense"
                  action={deleteExpense.bind(null, budgetId, expense.id)}
                />
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-3">
        <AddExpenseDialog
          budgetId={budgetId}
          categoryId={category.id}
          categoryName={category.name}
        />
      </div>
    </div>
  );
}
