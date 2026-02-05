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
      className={`shadow-card hover:shadow-card-hover transition-all duration-200 border-l-3 ${config.borderClass} animate-fade-in h-full`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <CardContent className="p-3 sm:p-4 h-full flex flex-col">
        {/* Header Row */}
        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2.5">
            <div className={`shrink-0 rounded-lg ${config.bgClass} p-2`}>
              <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${config.textClass}`} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <Badge className={`${config.bgClass} ${config.textClass} border-0 font-medium text-xs px-2 py-0.5`}>
                  {config.label}
                </Badge>
                <span className="text-xs font-medium text-muted-foreground">
                  #{operation.account_number}
                </span>
              </div>
            </div>
          </div>
          <p className="text-base sm:text-lg font-bold tracking-tight tabular-nums shrink-0">
            {formatCurrency(operation.amount)}
          </p>
        </div>

        {/* Date */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-auto">
          <Calendar className="h-3 w-3 shrink-0" />
          <span>{format(new Date(operation.created_at), "MMM d, yyyy")}</span>
        </div>

        {/* Loan Details */}
        {operation.operation_type === "loan" && (operation.interest || operation.payments) && (
          <div className="mt-2 pt-2 border-t border-border/40">
            <div className="flex gap-4">
              {operation.interest !== null && (
                <div className="flex items-center gap-1.5 text-xs">
                  <Percent className="h-3 w-3 text-loan" />
                  <span className="text-muted-foreground">Interest:</span>
                  <span className="font-medium">{operation.interest}%</span>
                </div>
              )}
              {operation.payments !== null && (
                <div className="flex items-center gap-1.5 text-xs">
                  <CreditCard className="h-3 w-3 text-loan" />
                  <span className="text-muted-foreground">Payments:</span>
                  <span className="font-medium">{operation.payments} mo</span>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
