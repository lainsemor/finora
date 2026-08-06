import Link from "next/link";
import { ArrowRight, PiggyBank, TrendingUp, Wallet2, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MarketingNavbar } from "@/components/marketing/navbar";
import { MarketingFooter } from "@/components/marketing/footer";

const features = [
  {
    icon: TrendingUp,
    title: "Income Tracking",
    description:
      "Bring every income source together in one place, automate recurring income, and see how it changes over time at a glance.",
  },
  {
    icon: Wallet2,
    title: "Paycheck Budget",
    description:
      "Split every paycheck into categories and see exactly how close you are to your budget goals, all in one view.",
  },
  {
    icon: PiggyBank,
    title: "Savings Planner",
    description:
      "Set a target amount and date for each goal, log your contributions, and watch your progress build visual momentum.",
  },
];

const highlights = [
  "Automatic sync across all your devices",
  "Bank-level secure data storage",
  "Light / dark theme support",
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <MarketingNavbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -top-40 -z-10 flex justify-center blur-3xl"
          >
            <div className="h-[420px] w-[720px] rounded-full bg-primary/20" />
          </div>

          <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 pb-20 pt-20 text-center sm:pt-28">
            <Badge
              variant="secondary"
              className="rounded-full border border-border/60 bg-accent px-4 py-1.5 text-accent-foreground"
            >
              A modern way to manage your money
            </Badge>

            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
              Your income, budget, and savings{" "}
              <span className="text-primary">in one app</span>
            </h1>

            <p className="max-w-xl text-lg text-muted-foreground text-balance">
              Finora helps you budget your paycheck, track your income, and
              hit your savings goals — all in one clean, modern interface.
            </p>

            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" asChild className="group">
                <Link href="/signup">
                  Get Started Free
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/pricing">See Pricing</Link>
              </Button>
            </div>

            <ul className="mt-6 flex flex-col items-center gap-2 text-sm text-muted-foreground sm:flex-row sm:gap-6">
              {highlights.map((item) => (
                <li key={item} className="flex items-center gap-1.5">
                  <Check className="size-4 text-accent-foreground" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="mx-auto max-w-6xl px-6 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight">
              Three powerful modules for your financial life
            </h2>
            <p className="mt-3 text-muted-foreground">
              Stop juggling separate apps — manage your income, budget, and
              savings from a single dashboard.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="gap-4 border-border/60 p-6 transition-shadow hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <feature.icon className="size-5" />
                </div>
                <h3 className="text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-6xl px-6 pb-24">
          <Card className="flex flex-col items-center gap-6 border-border/60 bg-gradient-to-br from-primary/10 via-card to-accent/10 p-10 text-center sm:p-16">
            <h2 className="max-w-lg text-3xl font-semibold tracking-tight text-balance">
              Start hitting your financial goals today
            </h2>
            <p className="max-w-md text-muted-foreground">
              Create a free account with no credit card required, upgrade to
              premium whenever you&apos;re ready.
            </p>
            <Button size="lg" asChild>
              <Link href="/signup">
                Get Started Free
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </Card>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
