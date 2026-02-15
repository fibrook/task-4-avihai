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
      <Card className="shadow-card overflow-hidden animate-fade-in" style={{ animationDelay: "0ms" }}>
        <CardContent className="p-0">
          <div className="flex items-center gap-2 p-2.5">
            <div className="rounded-md bg-deposit-muted p-1.5">
              <ArrowDownCircle className="h-3.5 w-3.5 text-deposit" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold tracking-tight truncate">{formatCurrency(stats.deposits)}</p>
              <p className="text-xs text-muted-foreground">Deposits</p>
            </div>
          </div>
          <div className="h-0.5 gradient-deposit" />
        </CardContent>
      </Card>

      <Card className="shadow-card overflow-hidden animate-fade-in" style={{ animationDelay: "50ms" }}>
        <CardContent className="p-0">
          <div className="flex items-center gap-2 p-2.5">
            <div className="rounded-md bg-withdrawal-muted p-1.5">
              <ArrowUpCircle className="h-3.5 w-3.5 text-withdrawal" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold tracking-tight truncate">{formatCurrency(stats.withdrawals)}</p>
              <p className="text-xs text-muted-foreground">Withdrawals</p>
            </div>
          </div>
          <div className="h-0.5 gradient-withdrawal" />
        </CardContent>
      </Card>

      <Card className="shadow-card overflow-hidden animate-fade-in" style={{ animationDelay: "100ms" }}>
        <CardContent className="p-0">
          <div className="flex items-center gap-2 p-2.5">
            <div className="rounded-md bg-loan-muted p-1.5">
              <Landmark className="h-3.5 w-3.5 text-loan" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold tracking-tight truncate">{formatCurrency(stats.loans)}</p>
              <p className="text-xs text-muted-foreground">Loans</p>
            </div>
          </div>
          <div className="h-0.5 gradient-loan" />
        </CardContent>
      </Card>

      <Card className="shadow-card overflow-hidden animate-fade-in" style={{ animationDelay: "150ms" }}>
        <CardContent className="p-0">
          <div className="flex items-center gap-2 p-2.5">
            <div className="rounded-md bg-secondary p-1.5">
              <Wallet className="h-3.5 w-3.5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold tracking-tight">{stats.total}</p>
              <p className="text-xs text-muted-foreground">Operations</p>
            </div>
          </div>
          <div className="h-0.5 gradient-primary" />
        </CardContent>
      </Card>
    </div>
  );
}
