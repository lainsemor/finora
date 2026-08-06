"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { Loader2, Lock, Plus } from "lucide-react";

import { addCategory, type ActionState } from "@/app/dashboard/budget/actions";
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

const initialState: ActionState = { error: null };

export function AddCategoryDialog({
  budgetId,
  atLimit = false,
}: {
  budgetId: string;
  atLimit?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const boundAction = addCategory.bind(null, budgetId);
  const [state, formAction, isPending] = useActionState(boundAction, initialState);

  useCloseOnSuccess(isPending, !!state.error, () => setOpen(false));

  if (atLimit) {
    return (
      <Button variant="outline" className="gap-1.5" asChild>
        <Link href="/pricing">
          <Lock className="size-4" />
          Upgrade for More Categories
        </Link>
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-1.5">
          <Plus className="size-4" />
          Add Category
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New category</DialogTitle>
        </DialogHeader>

        <form action={formAction} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Category name</Label>
            <Input id="name" name="name" placeholder="Rent, groceries, transport..." required />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="allocatedAmount">Allocated amount ($)</Label>
            <Input
              id="allocatedAmount"
              name="allocatedAmount"
              type="number"
              step="0.01"
              min="0"
              required
              placeholder="0.00"
            />
          </div>

          {state.error && <p className="text-sm text-destructive">{state.error}</p>}

          <Button type="submit" disabled={isPending} className="mt-1">
            {isPending && <Loader2 className="size-4 animate-spin" />}
            Add
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
