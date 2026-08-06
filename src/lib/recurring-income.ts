import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

// All arithmetic runs in UTC since incomes.date is a plain calendar date
// with no timezone — mixing in local-time Date methods here would shift
// occurrences by a day depending on the server's timezone.
function advance(date: Date, interval: "weekly" | "biweekly" | "monthly") {
  const next = new Date(date);
  if (interval === "weekly") next.setUTCDate(next.getUTCDate() + 7);
  else if (interval === "biweekly") next.setUTCDate(next.getUTCDate() + 14);
  else next.setUTCMonth(next.getUTCMonth() + 1);
  return next;
}

function toISODate(date: Date) {
  return date.toISOString().slice(0, 10);
}

/**
 * Lazily backfills any recurring-income occurrences that are due as of today
 * but haven't been generated yet. Runs on every dashboard load for premium
 * users — cheap given the small per-user row counts involved.
 */
export async function generateRecurringIncomeOccurrences(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: SupabaseClient<any>,
  userId: string
) {
  const { data: templates } = await supabase
    .from("incomes")
    .select("id, source, amount, date, recurrence_interval")
    .eq("user_id", userId)
    .eq("is_recurring", true)
    .is("recurring_parent_id", null);

  if (!templates || templates.length === 0) return;

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  for (const template of templates) {
    const interval = template.recurrence_interval as
      | "weekly"
      | "biweekly"
      | "monthly"
      | null;
    if (!interval) continue;

    const { data: existing } = await supabase
      .from("incomes")
      .select("date")
      .eq("recurring_parent_id", template.id);

    const existingDates = new Set((existing ?? []).map((e) => e.date));

    const rowsToInsert: { user_id: string; source: string; amount: number; date: string; recurring_parent_id: string }[] = [];
    let cursor = advance(new Date(template.date), interval);

    while (cursor <= today) {
      const isoDate = toISODate(cursor);
      if (!existingDates.has(isoDate)) {
        rowsToInsert.push({
          user_id: userId,
          source: template.source,
          amount: template.amount,
          date: isoDate,
          recurring_parent_id: template.id,
        });
      }
      cursor = advance(cursor, interval);
    }

    if (rowsToInsert.length > 0) {
      await supabase.from("incomes").insert(rowsToInsert);
    }
  }
}
