"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { Loader2, Lock, Plus } from "lucide-react";

import { createBudget, type ActionState } from "@/app/dashboard/budget/actions";
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

function firstDayOfMonth() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10);
}

function lastDayOfMonth() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth() + 1, 0).toISOString().slice(0, 10);
}

export function CreateBudgetDialog({ atLimit = false }: { atLimit?: boolean }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(createBudget, initialState);

  if (atLimit) {
    return (
      <Button variant="outline" className="gap-1.5" asChild>
        <Link href="/pricing">
          <Lock className="size-4" />
          Upgrade for More Budgets
        </Link>
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-1.5">
          <Plus className="size-4" />
          New Budget
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new budget</DialogTitle>
        </DialogHeader>

        <form action={formAction} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Budget name</Label>
            <Input id="name" name="name" placeholder="August Paycheck" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="periodStart">Start date</Label>
              <Input
                id="periodStart"
                name="periodStart"
                type="date"
                required
                defaultValue={firstDayOfMonth()}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="periodEnd">End date</Label>
              <Input
                id="periodEnd"
                name="periodEnd"
                type="date"
                required
                defaultValue={lastDayOfMonth()}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="totalAmount">Total budget ($)</Label>
            <Input
              id="totalAmount"
              name="totalAmount"
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
            Create
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
