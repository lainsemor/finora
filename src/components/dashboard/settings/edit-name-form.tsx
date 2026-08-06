"use client";

import { useActionState, useState } from "react";
import { Check, Loader2, Pencil } from "lucide-react";

import { updateProfile, type ActionState } from "@/app/dashboard/settings/actions";
import { useCloseOnSuccess } from "@/hooks/use-close-on-success";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const initialState: ActionState = { error: null };

export function EditNameForm({ initialName }: { initialName: string }) {
  const [editing, setEditing] = useState(false);
  const [state, formAction, isPending] = useActionState(updateProfile, initialState);

  useCloseOnSuccess(isPending, !!state.error, () => setEditing(false));

  if (!editing) {
    return (
      <div className="flex items-center gap-2">
        <span className="font-medium">{initialName || "—"}</span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Edit name"
          className="size-6 text-muted-foreground hover:text-foreground"
          onClick={() => setEditing(true)}
        >
          <Pencil className="size-3.5" />
        </Button>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex items-center gap-2">
      <Input
        name="displayName"
        defaultValue={initialName}
        autoFocus
        required
        className="h-8 w-44"
      />
      <Button type="submit" size="icon" disabled={isPending} className="size-8">
        {isPending ? (
          <Loader2 className="size-3.5 animate-spin" />
        ) : (
          <Check className="size-3.5" />
        )}
      </Button>
      {state.error && <p className="text-xs text-destructive">{state.error}</p>}
    </form>
  );
}
