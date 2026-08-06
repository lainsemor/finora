"use client";

import { useTransition } from "react";
import { Loader2, Trash2 } from "lucide-react";

import { deleteBudget } from "@/app/dashboard/budget/actions";
import { Button } from "@/components/ui/button";

export function DeleteBudgetButton({ budgetId }: { budgetId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      disabled={isPending}
      className="gap-1.5 text-muted-foreground hover:text-destructive"
      onClick={() => {
        if (confirm("Are you sure you want to delete this budget? All categories and expenses will be deleted too.")) {
          startTransition(() => deleteBudget(budgetId));
        }
      }}
    >
      {isPending ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <Trash2 className="size-4" />
      )}
      Delete Budget
    </Button>
  );
}
