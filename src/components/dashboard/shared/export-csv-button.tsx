"use client";

import Link from "next/link";
import { Download, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { toCsv, downloadCsv } from "@/lib/csv";

export function ExportCsvButton({
  filename,
  columns,
  data,
  isPremium,
}: {
  filename: string;
  columns: { key: string; label: string }[];
  data: Record<string, string | number>[];
  isPremium: boolean;
}) {
  if (!isPremium) {
    return (
      <Button variant="outline" size="sm" className="gap-1.5" asChild>
        <Link href="/pricing">
          <Lock className="size-3.5" />
          Export CSV
        </Link>
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-1.5"
      onClick={() => downloadCsv(filename, toCsv(columns, data))}
    >
      <Download className="size-3.5" />
      Export CSV
    </Button>
  );
}
