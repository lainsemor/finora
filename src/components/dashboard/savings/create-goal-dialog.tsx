"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { Loader2, Lock, Plus } from "lucide-react";

import { createGoal, type ActionState } from "@/app/dashboard/savings/actions";
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

export function CreateGoalDialog({ atLimit = false }: { atLimit?: boolean }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(createGoal, initialState);

  useCloseOnSuccess(isPending, !!state.error, () => setOpen(false));

  if (atLimit) {
    return (
      <Button variant="outline" className="gap-1.5" asChild>
        <Link href="/pricing">
          <Lock className="size-4" />
          Upgrade for More Goals
        </Link>
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-1.5">
          <Plus className="size-4" />
          New Goal
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New savings goal</DialogTitle>
        </DialogHeader>

        <form action={formAction} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Goal name</Label>
            <Input id="name" name="name" placeholder="Vacation, emergency fund, savings..." required />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="targetAmount">Target amount ($)</Label>
            <Input
              id="targetAmount"
              name="targetAmount"
              type="number"
              step="0.01"
              min="0"
              required
              placeholder="0.00"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="targetDate">Target date (optional)</Label>
            <Input id="targetDate" name="targetDate" type="date" />
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
