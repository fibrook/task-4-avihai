import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowDownCircle, ArrowUpCircle, Landmark, Wallet } from "lucide-react";

interface Operation {
  operation_type: string;
  amount: number;
}

export function StatsCards() {
  const { data: operations, isLoading } = useQuery({
    queryKey: ["operations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("account_operations")
        .select("operation_type, amount");

      if (error) throw error;
      return data as Operation[];
    },
  });

  const stats = {
    deposits: operations
      ?.filter((op) => op.operation_type === "deposit")
      .reduce((sum, op) => sum + op.amount, 0) || 0,
    withdrawals: operations
      ?.filter((op) => op.operation_type === "withdrawal")
      .reduce((sum, op) => sum + op.amount, 0) || 0,
    loans: operations
      ?.filter((op) => op.operation_type === "loan")
      .reduce((sum, op) => sum + op.amount, 0) || 0,
    total: operations?.length || 0,
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}K`;
    }
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="grid gap-2 grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="shadow-card">
            <CardContent className="p-2.5">
              <Skeleton className="h-5 w-14 mb-1" />
              <Skeleton className="h-3 w-10" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-2 grid-cols-2 lg:grid-cols-4">
      <Card className="shadow-card overflow-hidden animate-fade-in card-shine group hover:shadow-card-hover transition-shadow duration-300" style={{ animationDelay: "0ms" }}>
        <CardContent className="p-0">
          <div className="flex items-center gap-2.5 p-3">
            <div className="rounded-lg bg-deposit-muted p-2 ring-1 ring-deposit/10">
              <ArrowDownCircle className="h-4 w-4 text-deposit" />
            </div>
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-0.5">Deposits</p>
              <p className="text-lg font-bold tracking-tight truncate">{formatCurrency(stats.deposits)}</p>
            </div>
          </div>
          <div className="h-0.5 gradient-deposit" />
        </CardContent>
      </Card>

      <Card className="shadow-card overflow-hidden animate-fade-in card-shine group hover:shadow-card-hover transition-shadow duration-300" style={{ animationDelay: "50ms" }}>
        <CardContent className="p-0">
          <div className="flex items-center gap-2.5 p-3">
            <div className="rounded-lg bg-withdrawal-muted p-2 ring-1 ring-withdrawal/10">
              <ArrowUpCircle className="h-4 w-4 text-withdrawal" />
            </div>
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-0.5">Withdrawals</p>
              <p className="text-lg font-bold tracking-tight truncate">{formatCurrency(stats.withdrawals)}</p>
            </div>
          </div>
          <div className="h-0.5 gradient-withdrawal" />
        </CardContent>
      </Card>

      <Card className="shadow-card overflow-hidden animate-fade-in card-shine group hover:shadow-card-hover transition-shadow duration-300" style={{ animationDelay: "100ms" }}>
        <CardContent className="p-0">
          <div className="flex items-center gap-2.5 p-3">
            <div className="rounded-lg bg-loan-muted p-2 ring-1 ring-loan/10">
              <Landmark className="h-4 w-4 text-loan" />
            </div>
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-0.5">Loans</p>
              <p className="text-lg font-bold tracking-tight truncate">{formatCurrency(stats.loans)}</p>
            </div>
          </div>
          <div className="h-0.5 gradient-loan" />
        </CardContent>
      </Card>

      <Card className="shadow-card overflow-hidden animate-fade-in card-shine group hover:shadow-card-hover transition-shadow duration-300" style={{ animationDelay: "150ms" }}>
        <CardContent className="p-0">
          <div className="flex items-center gap-2.5 p-3">
            <div className="rounded-lg bg-secondary p-2 ring-1 ring-primary/10">
              <Wallet className="h-4 w-4 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-0.5">Operations</p>
              <p className="text-lg font-bold tracking-tight">{stats.total}</p>
            </div>
          </div>
          <div className="h-0.5 gradient-primary" />
        </CardContent>
      </Card>
    </div>
  );
}
