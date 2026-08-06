import type { SupabaseClient } from "@supabase/supabase-js";

export const FREE_LIMITS = {
  savingsGoals: 1,
  budgets: 1,
  categoriesPerBudget: 5,
} as const;

export async function getIsPremium(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: SupabaseClient<any>,
  userId: string
) {
  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_status")
    .eq("user_id", userId)
    .single();

  return ["active", "trialing"].includes(profile?.subscription_status ?? "free");
}
