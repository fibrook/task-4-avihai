import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowDownCircle, ArrowUpCircle, Landmark, History } from "lucide-react";
import { format } from "date-fns";

interface Operation {
  id: string;
  account_number: string;
  operation_type: string;
  amount: number;
  interest: number | null;
  payments: number | null;
  created_at: string;
}

export function OperationsList() {
  const { data: operations, isLoading } = useQuery({
    queryKey: ["operations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("account_operations")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Operation[];
    },
  });

  const getOperationIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return <ArrowDownCircle className="h-4 w-4 text-deposit" />;
      case "withdrawal":
        return <ArrowUpCircle className="h-4 w-4 text-withdrawal" />;
      case "loan":
        return <Landmark className="h-4 w-4 text-loan" />;
      default:
        return null;
    }
  };

  const getOperationBadge = (type: string) => {
    switch (type) {
      case "deposit":
        return (
          <Badge className="bg-deposit-muted text-deposit border-0 font-medium">
            <ArrowDownCircle className="mr-1 h-3 w-3" />
            Deposit
          </Badge>
        );
      case "withdrawal":
        return (
          <Badge className="bg-withdrawal-muted text-withdrawal border-0 font-medium">
            <ArrowUpCircle className="mr-1 h-3 w-3" />
            Withdrawal
          </Badge>
        );
      case "loan":
        return (
          <Badge className="bg-loan-muted text-loan border-0 font-medium">
            <Landmark className="mr-1 h-3 w-3" />
            Loan
          </Badge>
        );
      default:
        return <Badge>{type}</Badge>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  if (isLoading) {
    return (
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <History className="h-5 w-5 text-primary" />
            Recent Operations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-card animate-fade-in">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <History className="h-5 w-5 text-primary" />
          Recent Operations
          {operations && operations.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {operations.length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!operations || operations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted p-4 mb-4">
              <History className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-1">No operations yet</h3>
            <p className="text-sm text-muted-foreground">
              Create your first operation using the form above.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-6">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-6">Account</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-center">Details</TableHead>
                  <TableHead className="pr-6 text-right">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {operations.map((operation, index) => (
                  <TableRow
                    key={operation.id}
                    className="animate-slide-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <TableCell className="pl-6 font-medium">
                      {operation.account_number}
                    </TableCell>
                    <TableCell>{getOperationBadge(operation.operation_type)}</TableCell>
                    <TableCell className="text-right font-semibold tabular-nums">
                      {formatCurrency(operation.amount)}
                    </TableCell>
                    <TableCell className="text-center text-sm text-muted-foreground">
                      {operation.operation_type === "loan" &&
                      (operation.interest || operation.payments) ? (
                        <span className="inline-flex items-center gap-2">
                          {operation.interest && (
                            <span>{operation.interest}% APR</span>
                          )}
                          {operation.payments && (
                            <span>{operation.payments} payments</span>
                          )}
                        </span>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell className="pr-6 text-right text-sm text-muted-foreground">
                      {format(new Date(operation.created_at), "MMM d, yyyy h:mm a")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
