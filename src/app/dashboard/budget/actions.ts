"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type ActionState = { error: string | null };

export async function createBudget(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const name = String(formData.get("name") ?? "").trim();
  const periodStart = String(formData.get("periodStart") ?? "");
  const periodEnd = String(formData.get("periodEnd") ?? "");
  const totalAmount = Number(formData.get("totalAmount"));

  if (!name || !periodStart || !periodEnd || !Number.isFinite(totalAmount) || totalAmount < 0) {
    return { error: "Please fill in all fields correctly." };
  }

  const { data, error } = await supabase
    .from("budgets")
    .insert({
      user_id: user.id,
      name,
      period_start: periodStart,
      period_end: periodEnd,
      total_amount: totalAmount,
    })
    .select("id")
    .single();

  if (error || !data) return { error: "Could not create budget. Please try again." };

  revalidatePath("/dashboard/budget");
  redirect(`/dashboard/budget/${data.id}`);
}

export async function deleteBudget(id: string) {
  const supabase = await createClient();
  await supabase.from("budgets").delete().eq("id", id);
  revalidatePath("/dashboard/budget");
  redirect("/dashboard/budget");
}

export async function addCategory(
  budgetId: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const name = String(formData.get("name") ?? "").trim();
  const allocatedAmount = Number(formData.get("allocatedAmount"));

  if (!name || !Number.isFinite(allocatedAmount) || allocatedAmount < 0) {
    return { error: "Please fill in all fields correctly." };
  }

  const { error } = await supabase.from("budget_categories").insert({
    budget_id: budgetId,
    user_id: user.id,
    name,
    allocated_amount: allocatedAmount,
  });

  if (error) return { error: "Could not add category. Please try again." };

  revalidatePath(`/dashboard/budget/${budgetId}`);
  return { error: null };
}

export async function deleteCategory(budgetId: string, categoryId: string) {
  const supabase = await createClient();
  await supabase.from("budget_categories").delete().eq("id", categoryId);
  revalidatePath(`/dashboard/budget/${budgetId}`);
}

export async function addExpense(
  budgetId: string,
  categoryId: string,
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
  const description = String(formData.get("description") ?? "").trim() || null;

  if (!Number.isFinite(amount) || amount <= 0 || !date) {
    return { error: "Please fill in all fields correctly." };
  }

  const { error } = await supabase.from("expenses").insert({
    user_id: user.id,
    budget_category_id: categoryId,
    amount,
    date,
    description,
  });

  if (error) return { error: "Could not add expense. Please try again." };

  revalidatePath(`/dashboard/budget/${budgetId}`);
  revalidatePath("/dashboard");
  return { error: null };
}

export async function deleteExpense(budgetId: string, expenseId: string) {
  const supabase = await createClient();
  await supabase.from("expenses").delete().eq("id", expenseId);
  revalidatePath(`/dashboard/budget/${budgetId}`);
  revalidatePath("/dashboard");
}
