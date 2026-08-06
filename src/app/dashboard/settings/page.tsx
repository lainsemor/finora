import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Profile } from "@/lib/types";

const planLabel: Record<string, string> = {
  free: "Free",
  trialing: "Trial (Premium)",
  active: "Premium",
  canceled: "Canceled",
  past_due: "Payment Due",
};

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user!.id)
    .single();

  const typedProfile = profile as Profile | null;
  const status = typedProfile?.subscription_status ?? "free";
  const isPremium = ["active", "trialing"].includes(status);

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Your account and subscription details.</p>
      </div>

      <Card className="border-border/60 p-6">
        <h2 className="mb-4 text-sm font-medium text-muted-foreground">Account</h2>
        <div className="flex flex-col gap-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Name</span>
            <span className="font-medium">{typedProfile?.display_name || "—"}</span>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Email</span>
            <span className="font-medium">{user?.email}</span>
          </div>
        </div>
      </Card>

      <Card className="border-border/60 p-6">
        <h2 className="mb-4 text-sm font-medium text-muted-foreground">Subscription</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Current Plan</p>
            <p className="text-sm text-muted-foreground">
              {isPremium
                ? "You have access to all premium features."
                : "You're on the free plan — upgrade for more."}
            </p>
          </div>
          <Badge variant={isPremium ? "default" : "secondary"} className="rounded-full">
            {planLabel[status]}
          </Badge>
        </div>
      </Card>
    </div>
  );
}
