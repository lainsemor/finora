import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { generateRecurringIncomeOccurrences } from "@/lib/recurring-income";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardTopbar } from "@/components/dashboard/topbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, subscription_status")
    .eq("user_id", user.id)
    .single();

  const isPremium = ["active", "trialing"].includes(
    profile?.subscription_status ?? "free"
  );

  if (isPremium) {
    await generateRecurringIncomeOccurrences(supabase, user.id);
  }

  return (
    <div className="flex min-h-svh">
      <DashboardSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardTopbar
          email={user.email ?? ""}
          displayName={profile?.display_name ?? null}
          isPremium={isPremium}
        />
        <main className="flex-1 overflow-y-auto bg-muted/30 p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
