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
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="shadow-card">
            <CardContent className="p-6">
              <Skeleton className="h-10 w-24 mb-2" />
              <Skeleton className="h-4 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="shadow-card overflow-hidden animate-fade-in" style={{ animationDelay: "0ms" }}>
        <CardContent className="p-0">
          <div className="flex items-center gap-4 p-6">
            <div className="rounded-xl bg-deposit-muted p-3">
              <ArrowDownCircle className="h-6 w-6 text-deposit" />
            </div>
            <div>
              <p className="text-2xl font-bold tracking-tight">
                {formatCurrency(stats.deposits)}
              </p>
              <p className="text-sm text-muted-foreground">Total Deposits</p>
            </div>
          </div>
          <div className="h-1 gradient-deposit" />
        </CardContent>
      </Card>

      <Card className="shadow-card overflow-hidden animate-fade-in" style={{ animationDelay: "50ms" }}>
        <CardContent className="p-0">
          <div className="flex items-center gap-4 p-6">
            <div className="rounded-xl bg-withdrawal-muted p-3">
              <ArrowUpCircle className="h-6 w-6 text-withdrawal" />
            </div>
            <div>
              <p className="text-2xl font-bold tracking-tight">
                {formatCurrency(stats.withdrawals)}
              </p>
              <p className="text-sm text-muted-foreground">Total Withdrawals</p>
            </div>
          </div>
          <div className="h-1 gradient-withdrawal" />
        </CardContent>
      </Card>

      <Card className="shadow-card overflow-hidden animate-fade-in" style={{ animationDelay: "100ms" }}>
        <CardContent className="p-0">
          <div className="flex items-center gap-4 p-6">
            <div className="rounded-xl bg-loan-muted p-3">
              <Landmark className="h-6 w-6 text-loan" />
            </div>
            <div>
              <p className="text-2xl font-bold tracking-tight">
                {formatCurrency(stats.loans)}
              </p>
              <p className="text-sm text-muted-foreground">Total Loans</p>
            </div>
          </div>
          <div className="h-1 gradient-loan" />
        </CardContent>
      </Card>

      <Card className="shadow-card overflow-hidden animate-fade-in" style={{ animationDelay: "150ms" }}>
        <CardContent className="p-0">
          <div className="flex items-center gap-4 p-6">
            <div className="rounded-xl bg-secondary p-3">
              <Wallet className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold tracking-tight">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Total Operations</p>
            </div>
          </div>
          <div className="h-1 gradient-primary" />
        </CardContent>
      </Card>
    </div>
  );
}
