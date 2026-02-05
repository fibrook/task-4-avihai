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
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          {/* Left: Icon and Type */}
          <div className="flex items-center gap-4">
            <div className={`rounded-xl ${config.bgClass} p-3`}>
              <Icon className={`h-6 w-6 ${config.textClass}`} />
            </div>
            <div>
              <Badge className={`${config.bgClass} ${config.textClass} border-0 font-semibold mb-1`}>
                {config.label}
              </Badge>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
                <Calendar className="h-3.5 w-3.5" />
                {format(new Date(operation.created_at), "MMM d, yyyy 'at' h:mm a")}
              </div>
            </div>
          </div>

          {/* Right: Amount */}
          <div className="text-right">
            <p className="text-2xl font-bold tracking-tight tabular-nums">
              {formatCurrency(operation.amount)}
            </p>
          </div>
        </div>

        {/* Loan Details */}
        {operation.operation_type === "loan" && (operation.interest || operation.payments) && (
          <div className="mt-4 pt-4 border-t border-border/50">
            <div className="grid grid-cols-2 gap-4">
              {operation.interest !== null && (
                <div className="flex items-center gap-2 text-sm">
                  <div className="rounded-lg bg-loan-muted p-1.5">
                    <Percent className="h-4 w-4 text-loan" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Interest Rate</p>
                    <p className="font-semibold">{operation.interest}% APR</p>
                  </div>
                </div>
              )}
              {operation.payments !== null && (
                <div className="flex items-center gap-2 text-sm">
                  <div className="rounded-lg bg-loan-muted p-1.5">
                    <CreditCard className="h-4 w-4 text-loan" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Payments</p>
                    <p className="font-semibold">{operation.payments} months</p>
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
