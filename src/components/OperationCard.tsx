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
      className={`shadow-card hover:shadow-card-hover transition-all duration-300 border-l-4 ${config.borderClass} animate-fade-in`}
      style={{ animationDelay: `${index * 75}ms` }}
    >
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3 sm:gap-4">
          {/* Left: Icon and Type */}
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <div className={`shrink-0 rounded-lg sm:rounded-xl ${config.bgClass} p-2 sm:p-3`}>
              <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${config.textClass}`} />
            </div>
            <div className="min-w-0">
              <Badge className={`${config.bgClass} ${config.textClass} border-0 font-semibold mb-1 text-xs sm:text-sm`}>
                {config.label}
              </Badge>
              <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground mt-1">
                <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" />
                <span className="truncate">
                  {format(new Date(operation.created_at), "MMM d, yyyy")}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Amount */}
          <div className="text-right shrink-0">
            <p className="text-lg sm:text-2xl font-bold tracking-tight tabular-nums">
              {formatCurrency(operation.amount)}
            </p>
          </div>
        </div>

        {/* Loan Details */}
        {operation.operation_type === "loan" && (operation.interest || operation.payments) && (
          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-border/50">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {operation.interest !== null && (
                <div className="flex items-center gap-2 text-xs sm:text-sm">
                  <div className="rounded-md sm:rounded-lg bg-loan-muted p-1 sm:p-1.5">
                    <Percent className="h-3 w-3 sm:h-4 sm:w-4 text-loan" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-muted-foreground text-[10px] sm:text-xs">Interest</p>
                    <p className="font-semibold truncate">{operation.interest}% APR</p>
                  </div>
                </div>
              )}
              {operation.payments !== null && (
                <div className="flex items-center gap-2 text-xs sm:text-sm">
                  <div className="rounded-md sm:rounded-lg bg-loan-muted p-1 sm:p-1.5">
                    <CreditCard className="h-3 w-3 sm:h-4 sm:w-4 text-loan" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-muted-foreground text-[10px] sm:text-xs">Payments</p>
                    <p className="font-semibold truncate">{operation.payments} mo</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
