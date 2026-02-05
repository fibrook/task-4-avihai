import { ArrowDownCircle, ArrowUpCircle, Landmark, Calendar, DollarSign, Percent, CreditCard } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

interface OperationCardProps {
  operation: Operation;
  index: number;
}

export function OperationCard({ operation, index }: OperationCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getTypeConfig = (type: string) => {
    switch (type) {
      case "deposit":
        return {
          icon: ArrowDownCircle,
          label: "Deposit",
          bgClass: "bg-deposit-muted",
          textClass: "text-deposit",
          borderClass: "border-l-deposit",
        };
      case "withdrawal":
        return {
          icon: ArrowUpCircle,
          label: "Withdrawal",
          bgClass: "bg-withdrawal-muted",
          textClass: "text-withdrawal",
          borderClass: "border-l-withdrawal",
        };
      case "loan":
        return {
          icon: Landmark,
          label: "Loan",
          bgClass: "bg-loan-muted",
          textClass: "text-loan",
          borderClass: "border-l-loan",
        };
      default:
        return {
          icon: DollarSign,
          label: type,
          bgClass: "bg-muted",
          textClass: "text-muted-foreground",
          borderClass: "border-l-muted",
        };
    }
  };

  const config = getTypeConfig(operation.operation_type);
  const Icon = config.icon;

  return (
    <Card
      className={`shadow-card hover:shadow-card-hover transition-all duration-200 border-l-2 ${config.borderClass} animate-fade-in`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <CardContent className="p-2.5 sm:p-3">
        {/* Single Row Layout */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className={`shrink-0 rounded-md ${config.bgClass} p-1.5`}>
              <Icon className={`h-3.5 w-3.5 ${config.textClass}`} />
            </div>
            <div className="min-w-0 flex flex-col">
              <div className="flex items-center gap-1.5">
                <Badge className={`${config.bgClass} ${config.textClass} border-0 font-medium text-[10px] px-1.5 py-0`}>
                  {config.label}
                </Badge>
                <span className="text-[10px] text-muted-foreground">
                  #{operation.account_number}
                </span>
              </div>
              <span className="text-[10px] text-muted-foreground mt-0.5">
                {format(new Date(operation.created_at), "MMM d, yyyy")}
              </span>
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-sm font-bold tracking-tight tabular-nums">
              {formatCurrency(operation.amount)}
            </p>
            {/* Compact Loan Details */}
            {operation.operation_type === "loan" && (operation.interest || operation.payments) && (
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-0.5 justify-end">
                {operation.interest !== null && (
                  <span>{operation.interest}% APR</span>
                )}
                {operation.payments !== null && (
                  <span>{operation.payments}mo</span>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
