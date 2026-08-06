"use client";

import { useActionState, useState } from "react";
import { Loader2, Pencil } from "lucide-react";

import { updateIncome, type ActionState } from "@/app/dashboard/income/actions";
import { useCloseOnSuccess } from "@/hooks/use-close-on-success";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Income } from "@/lib/types";

const initialState: ActionState = { error: null };

export function EditIncomeDialog({ income }: { income: Income }) {
  const [open, setOpen] = useState(false);
  const [isRecurring, setIsRecurring] = useState(income.is_recurring);
  const boundAction = updateIncome.bind(null, income.id);
  const [state, formAction, isPending] = useActionState(boundAction, initialState);

  useCloseOnSuccess(isPending, !!state.error, () => setOpen(false));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Edit income"
          className="size-8 text-muted-foreground hover:text-foreground"
        >
          <Pencil className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit income</DialogTitle>
        </DialogHeader>

        <form action={formAction} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="edit-source">Source</Label>
            <Input
              id="edit-source"
              name="source"
              defaultValue={income.source}
              placeholder="Salary, freelance, etc."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-amount">Amount ($)</Label>
              <Input
                id="edit-amount"
                name="amount"
                type="number"
                step="0.01"
                min="0"
                required
                defaultValue={income.amount}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-date">Date</Label>
              <Input
                id="edit-date"
                name="date"
                type="date"
                required
                defaultValue={income.date}
              />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2.5">
            <div className="flex flex-col gap-0.5">
              <Label htmlFor="edit-isRecurring">Recurring income</Label>
              <p className="text-xs text-muted-foreground">
                Income that repeats on a regular interval
              </p>
            </div>
            <Switch
              id="edit-isRecurring"
              name="isRecurring"
              checked={isRecurring}
              onCheckedChange={setIsRecurring}
            />
          </div>

          {isRecurring && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-recurrenceInterval">Repeat interval</Label>
              <Select
                name="recurrenceInterval"
                defaultValue={income.recurrence_interval ?? "monthly"}
              >
                <SelectTrigger id="edit-recurrenceInterval" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="biweekly">Every two weeks</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

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
