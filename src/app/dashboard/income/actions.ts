"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ActionState = { error: string | null };

export async function addIncome(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const source = String(formData.get("source") ?? "").trim();
  const amount = Number(formData.get("amount"));
  const date = String(formData.get("date") ?? "");
  const isRecurring = formData.get("isRecurring") === "on";
  const recurrenceInterval = isRecurring
    ? String(formData.get("recurrenceInterval") ?? "monthly")
    : null;

  if (!source || !Number.isFinite(amount) || amount <= 0 || !date) {
    return { error: "Please fill in all fields correctly." };
  }

  const { error } = await supabase.from("incomes").insert({
    user_id: user.id,
    source,
    amount,
    date,
    is_recurring: isRecurring,
    recurrence_interval: recurrenceInterval,
  });

  if (error) return { error: "Could not add income. Please try again." };

  revalidatePath("/dashboard/income");
  revalidatePath("/dashboard");
  return { error: null };
}

export async function deleteIncome(id: string) {
  const supabase = await createClient();
  await supabase.from("incomes").delete().eq("id", id);
  revalidatePath("/dashboard/income");
  revalidatePath("/dashboard");
}

export async function updateIncome(
  id: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const source = String(formData.get("source") ?? "").trim();
  const amount = Number(formData.get("amount"));
  const date = String(formData.get("date") ?? "");
  const isRecurring = formData.get("isRecurring") === "on";
  const recurrenceInterval = isRecurring
    ? String(formData.get("recurrenceInterval") ?? "monthly")
    : null;

  if (!source || !Number.isFinite(amount) || amount <= 0 || !date) {
    return { error: "Please fill in all fields correctly." };
  }

  const { error } = await supabase
    .from("incomes")
    .update({
      source,
      amount,
      date,
      is_recurring: isRecurring,
      recurrence_interval: recurrenceInterval,
    })
    .eq("id", id);

  if (error) return { error: "Could not update income. Please try again." };

  revalidatePath("/dashboard/income");
  revalidatePath("/dashboard");
  return { error: null };
}
