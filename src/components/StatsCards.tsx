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
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="shadow-card">
            <CardContent className="p-4 sm:p-6">
              <Skeleton className="h-8 sm:h-10 w-16 sm:w-24 mb-2" />
              <Skeleton className="h-4 w-14 sm:w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
      <Card className="shadow-card overflow-hidden animate-fade-in" style={{ animationDelay: "0ms" }}>
        <CardContent className="p-0">
          <div className="flex items-center gap-3 sm:gap-4 p-4 sm:p-6">
            <div className="rounded-lg sm:rounded-xl bg-deposit-muted p-2 sm:p-3">
              <ArrowDownCircle className="h-5 w-5 sm:h-6 sm:w-6 text-deposit" />
            </div>
            <div className="min-w-0">
              <p className="text-lg sm:text-2xl font-bold tracking-tight truncate">
                {formatCurrency(stats.deposits)}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">Deposits</p>
            </div>
          </div>
          <div className="h-1 gradient-deposit" />
        </CardContent>
      </Card>

      <Card className="shadow-card overflow-hidden animate-fade-in" style={{ animationDelay: "50ms" }}>
        <CardContent className="p-0">
          <div className="flex items-center gap-3 sm:gap-4 p-4 sm:p-6">
            <div className="rounded-lg sm:rounded-xl bg-withdrawal-muted p-2 sm:p-3">
              <ArrowUpCircle className="h-5 w-5 sm:h-6 sm:w-6 text-withdrawal" />
            </div>
            <div className="min-w-0">
              <p className="text-lg sm:text-2xl font-bold tracking-tight truncate">
                {formatCurrency(stats.withdrawals)}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">Withdrawals</p>
            </div>
          </div>
          <div className="h-1 gradient-withdrawal" />
        </CardContent>
      </Card>

      <Card className="shadow-card overflow-hidden animate-fade-in" style={{ animationDelay: "100ms" }}>
        <CardContent className="p-0">
          <div className="flex items-center gap-3 sm:gap-4 p-4 sm:p-6">
            <div className="rounded-lg sm:rounded-xl bg-loan-muted p-2 sm:p-3">
              <Landmark className="h-5 w-5 sm:h-6 sm:w-6 text-loan" />
            </div>
            <div className="min-w-0">
              <p className="text-lg sm:text-2xl font-bold tracking-tight truncate">
                {formatCurrency(stats.loans)}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">Loans</p>
            </div>
          </div>
          <div className="h-1 gradient-loan" />
        </CardContent>
      </Card>

      <Card className="shadow-card overflow-hidden animate-fade-in" style={{ animationDelay: "150ms" }}>
        <CardContent className="p-0">
          <div className="flex items-center gap-3 sm:gap-4 p-4 sm:p-6">
            <div className="rounded-lg sm:rounded-xl bg-secondary p-2 sm:p-3">
              <Wallet className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-lg sm:text-2xl font-bold tracking-tight">{stats.total}</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Operations</p>
            </div>
          </div>
          <div className="h-1 gradient-primary" />
        </CardContent>
      </Card>
    </div>
  );
}
