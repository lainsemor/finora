"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ActionState = { error: string | null };

export async function createGoal(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const name = String(formData.get("name") ?? "").trim();
  const targetAmount = Number(formData.get("targetAmount"));
  const targetDate = String(formData.get("targetDate") ?? "") || null;

  if (!name || !Number.isFinite(targetAmount) || targetAmount <= 0) {
    return { error: "Please fill in all fields correctly." };
  }

  const { error } = await supabase.from("savings_goals").insert({
    user_id: user.id,
    name,
    target_amount: targetAmount,
    target_date: targetDate,
  });

  if (error) return { error: "Could not create goal. Please try again." };

  revalidatePath("/dashboard/savings");
  revalidatePath("/dashboard");
  return { error: null };
}

export async function deleteGoal(id: string) {
  const supabase = await createClient();
  await supabase.from("savings_goals").delete().eq("id", id);
  revalidatePath("/dashboard/savings");
  revalidatePath("/dashboard");
}

export async function addContribution(
  goalId: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const amount = Number(formData.get("amount"));
  const date = String(formData.get("date") ?? "");

  if (!Number.isFinite(amount) || amount <= 0 || !date) {
    return { error: "Please fill in all fields correctly." };
  }

  const { error } = await supabase.from("savings_contributions").insert({
    goal_id: goalId,
    user_id: user.id,
    amount,
    date,
  });

  if (error) return { error: "Could not add contribution. Please try again." };

  revalidatePath("/dashboard/savings");
  revalidatePath("/dashboard");
  return { error: null };
}
