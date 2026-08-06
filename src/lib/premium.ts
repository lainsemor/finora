import type { SupabaseClient } from "@supabase/supabase-js";

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
