"use client";

import { useActionState, useState } from "react";
import { Loader2, Pencil } from "lucide-react";

import { updateCategory, type ActionState } from "@/app/dashboard/budget/actions";
import { useCloseOnSuccess } from "@/hooks/use-close-on-success";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { BudgetCategory } from "@/lib/types";

const initialState: ActionState = { error: null };

export function EditCategoryDialog({
  budgetId,
  category,
}: {
  budgetId: string;
  category: BudgetCategory;
}) {
  const [open, setOpen] = useState(false);
  const boundAction = updateCategory.bind(null, budgetId, category.id);
  const [state, formAction, isPending] = useActionState(boundAction, initialState);

  useCloseOnSuccess(isPending, !!state.error, () => setOpen(false));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Edit category"
          className="size-8 text-muted-foreground hover:text-foreground"
        >
          <Pencil className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit category</DialogTitle>
        </DialogHeader>

        <form action={formAction} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="edit-cat-name">Category name</Label>
            <Input
              id="edit-cat-name"
              name="name"
              defaultValue={category.name}
              placeholder="Rent, groceries, transport..."
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="edit-cat-allocatedAmount">Allocated amount ($)</Label>
            <Input
              id="edit-cat-allocatedAmount"
              name="allocatedAmount"
              type="number"
              step="0.01"
              min="0"
              required
              defaultValue={category.allocated_amount}
            />
          </div>

          {state.error && <p className="text-sm text-destructive">{state.error}</p>}

          <Button type="submit" disabled={isPending} className="mt-1">
            {isPending && <Loader2 className="size-4 animate-spin" />}
            Save
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
