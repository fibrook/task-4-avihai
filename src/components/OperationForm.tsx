import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownCircle, ArrowUpCircle, Landmark, Plus } from "lucide-react";
import { toast } from "sonner";

type OperationType = "deposit" | "withdrawal" | "loan";

interface FormData {
  account_number: string;
  operation_type: OperationType;
  amount: string;
  interest: string;
  payments: string;
}

const initialFormData: FormData = {
  account_number: "",
  operation_type: "deposit",
  amount: "",
  interest: "",
  payments: "",
};

export function OperationForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const queryClient = useQueryClient();

  const createOperation = useMutation({
    mutationFn: async (data: FormData) => {
      const payload = {
        account_number: data.account_number,
        operation_type: data.operation_type,
        amount: parseFloat(data.amount),
        interest: data.operation_type === "loan" && data.interest ? parseFloat(data.interest) : null,
        payments: data.operation_type === "loan" && data.payments ? parseFloat(data.payments) : null,
      };

      const { error } = await supabase.from("account_operations").insert(payload);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["operations"] });
      setFormData(initialFormData);
      toast.success("Operation recorded successfully!");
    },
    onError: (error) => {
      toast.error("Failed to record operation: " + error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.account_number || !formData.amount) {
      toast.error("Please fill in all required fields");
      return;
    }
    createOperation.mutate(formData);
  };

  const getOperationIcon = (type: OperationType) => {
    switch (type) {
      case "deposit":
        return <ArrowDownCircle className="h-5 w-5 text-deposit" />;
      case "withdrawal":
        return <ArrowUpCircle className="h-5 w-5 text-withdrawal" />;
      case "loan":
        return <Landmark className="h-5 w-5 text-loan" />;
    }
  };

  return (
    <Card className="shadow-card animate-fade-in">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Plus className="h-5 w-5 text-primary" />
          New Operation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="account_number">Account Number</Label>
            <Input
              id="account_number"
              placeholder="Enter account number"
              value={formData.account_number}
              onChange={(e) =>
                setFormData({ ...formData, account_number: e.target.value })
              }
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="operation_type">Operation Type</Label>
            <Select
              value={formData.operation_type}
              onValueChange={(value: OperationType) =>
                setFormData({ ...formData, operation_type: value })
              }
            >
              <SelectTrigger className="h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="deposit">
                  <div className="flex items-center gap-2">
                    <ArrowDownCircle className="h-4 w-4 text-deposit" />
                    Deposit
                  </div>
                </SelectItem>
                <SelectItem value="withdrawal">
                  <div className="flex items-center gap-2">
                    <ArrowUpCircle className="h-4 w-4 text-withdrawal" />
                    Withdrawal
                  </div>
                </SelectItem>
                <SelectItem value="loan">
                  <div className="flex items-center gap-2">
                    <Landmark className="h-4 w-4 text-loan" />
                    Loan
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              className="h-11"
            />
          </div>

          {formData.operation_type === "loan" && (
            <div className="space-y-4 rounded-lg bg-loan-muted p-4 animate-scale-in">
              <p className="text-sm font-medium text-loan">Loan Details</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="interest">Interest Rate (%)</Label>
                  <Input
                    id="interest"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={formData.interest}
                    onChange={(e) =>
                      setFormData({ ...formData, interest: e.target.value })
                    }
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="payments">Number of Payments</Label>
                  <Input
                    id="payments"
                    type="number"
                    min="1"
                    placeholder="12"
                    value={formData.payments}
                    onChange={(e) =>
                      setFormData({ ...formData, payments: e.target.value })
                    }
                    className="h-11"
                  />
                </div>
              </div>
            </div>
          )}

          <Button
            type="submit"
            className="w-full h-11 gradient-primary text-primary-foreground"
            disabled={createOperation.isPending}
          >
            {createOperation.isPending ? "Recording..." : "Record Operation"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
