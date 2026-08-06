import { Repeat, TrendingUp } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DeleteIconButton } from "@/components/dashboard/shared/delete-icon-button";
import { EmptyState } from "@/components/dashboard/shared/empty-state";
import { AddIncomeDialog } from "@/components/dashboard/income/add-income-dialog";
import { EditIncomeDialog } from "@/components/dashboard/income/edit-income-dialog";
import { deleteIncome } from "@/app/dashboard/income/actions";
import { formatCurrency, formatDate } from "@/lib/format";
import type { Income } from "@/lib/types";

const intervalLabel: Record<string, string> = {
  weekly: "Weekly",
  biweekly: "Every two weeks",
  monthly: "Monthly",
};

export function IncomeTable({ incomes }: { incomes: Income[] }) {
  if (incomes.length === 0) {
    return (
      <EmptyState
        icon={TrendingUp}
        title="No income yet"
        description="Add your first income entry to start tracking."
        action={<AddIncomeDialog />}
      />
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Source</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Repeat</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead className="w-20" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {incomes.map((income) => (
          <TableRow key={income.id}>
            <TableCell className="font-medium">{income.source}</TableCell>
            <TableCell className="text-muted-foreground">
              {formatDate(income.date)}
            </TableCell>
            <TableCell>
              {income.recurring_parent_id ? (
                <Badge variant="secondary" className="gap-1">
                  <Repeat className="size-3" />
                  Auto
                </Badge>
              ) : income.is_recurring ? (
                <Badge variant="secondary" className="gap-1">
                  <Repeat className="size-3" />
                  {intervalLabel[income.recurrence_interval ?? "monthly"]}
                </Badge>
              ) : (
                <span className="text-sm text-muted-foreground">One-time</span>
              )}
            </TableCell>
            <TableCell className="text-right font-medium tabular-nums">
              {formatCurrency(income.amount)}
            </TableCell>
            <TableCell>
              <div className="flex items-center justify-end gap-0.5">
                <EditIncomeDialog income={income} />
                <DeleteIconButton
                  label="Delete income"
                  action={deleteIncome.bind(null, income.id)}
                />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
