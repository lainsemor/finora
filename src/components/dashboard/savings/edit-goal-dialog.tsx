"use client";

import { useActionState, useState } from "react";
import { Loader2, Pencil } from "lucide-react";

import { updateGoal, type ActionState } from "@/app/dashboard/savings/actions";
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
import type { SavingsGoal } from "@/lib/types";

const initialState: ActionState = { error: null };

export function EditGoalDialog({ goal }: { goal: SavingsGoal }) {
  const [open, setOpen] = useState(false);
  const boundAction = updateGoal.bind(null, goal.id);
  const [state, formAction, isPending] = useActionState(boundAction, initialState);

  useCloseOnSuccess(isPending, !!state.error, () => setOpen(false));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Edit goal"
          className="size-8 text-muted-foreground hover:text-foreground"
        >
          <Pencil className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit savings goal</DialogTitle>
        </DialogHeader>

        <form action={formAction} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="edit-goal-name">Goal name</Label>
            <Input
              id="edit-goal-name"
              name="name"
              defaultValue={goal.name}
              placeholder="Vacation, emergency fund, savings..."
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="edit-goal-targetAmount">Target amount ($)</Label>
            <Input
              id="edit-goal-targetAmount"
              name="targetAmount"
              type="number"
              step="0.01"
              min="0"
              required
              defaultValue={goal.target_amount}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="edit-goal-targetDate">Target date (optional)</Label>
            <Input
              id="edit-goal-targetDate"
              name="targetDate"
              type="date"
              defaultValue={goal.target_date ?? ""}
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
