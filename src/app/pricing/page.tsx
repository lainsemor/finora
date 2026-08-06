import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MarketingNavbar } from "@/components/marketing/navbar";
import { MarketingFooter } from "@/components/marketing/footer";

const freeFeatures = [
  "1 active savings goal",
  "One budget, up to 5 categories",
  "Manual income entry",
  "Basic summary charts",
];

const premiumFeatures = [
  "Unlimited savings goals",
  "Unlimited budgets and custom categories",
  "Recurring income automation",
  "Advanced analytics and insight charts",
  "Export to CSV",
  "Priority support",
];

export default function PricingPage() {
  return (
    <div className="flex flex-1 flex-col">
      <MarketingNavbar />

      <main className="flex-1">
        <section className="mx-auto max-w-5xl px-6 py-20 text-center">
          <Badge
            variant="secondary"
            className="rounded-full border border-border/60 bg-accent px-4 py-1.5 text-accent-foreground"
          >
            Pricing
          </Badge>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            Choose the plan that fits you
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Start free, upgrade to premium whenever you&apos;re ready. No hidden fees.
          </p>

          <div className="mt-14 grid gap-6 text-left sm:grid-cols-2">
            <Card className="flex flex-col gap-6 border-border/60 p-8">
              <div>
                <h2 className="text-lg font-semibold">Free</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Get started with financial tracking
                </p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-semibold tracking-tight">$0</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <Button variant="outline" asChild>
                <Link href="/signup">Get Started Free</Link>
              </Button>
              <ul className="flex flex-col gap-3 text-sm">
                {freeFeatures.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <div className="relative">
              <Badge className="absolute -top-3 left-8 z-10 rounded-full px-3 py-1">
                Recommended
              </Badge>
              <Card className="flex flex-col gap-6 border-primary/40 bg-gradient-to-br from-primary/5 via-card to-accent/5 p-8 shadow-lg shadow-primary/10">
              <div>
                <h2 className="text-lg font-semibold">Premium</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Full control over your financial goals
                </p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-semibold tracking-tight">$9.99</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <Button asChild className="group">
                <Link href="/signup">
                  Upgrade to Premium
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
              <ul className="flex flex-col gap-3 text-sm">
                {premiumFeatures.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
