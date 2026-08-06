export type Income = {
  id: string;
  user_id: string;
  source: string;
  amount: number;
  date: string;
  is_recurring: boolean;
  recurrence_interval: "weekly" | "biweekly" | "monthly" | null;
  created_at: string;
};

export type Budget = {
  id: string;
  user_id: string;
  name: string;
  period_start: string;
  period_end: string;
  total_amount: number;
  created_at: string;
};

export type BudgetCategory = {
  id: string;
  budget_id: string;
  user_id: string;
  name: string;
  allocated_amount: number;
  created_at: string;
};

export type Expense = {
  id: string;
  user_id: string;
  budget_category_id: string;
  amount: number;
  date: string;
  description: string | null;
  created_at: string;
};

export type SavingsGoal = {
  id: string;
  user_id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  target_date: string | null;
  created_at: string;
};

export type SavingsContribution = {
  id: string;
  goal_id: string;
  user_id: string;
  amount: number;
  date: string;
  created_at: string;
};

export type SubscriptionStatus =
  | "free"
  | "trialing"
  | "active"
  | "canceled"
  | "past_due";

export type Profile = {
  user_id: string;
  display_name: string | null;
  subscription_status: SubscriptionStatus;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
};
