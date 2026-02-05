import { OperationForm } from "@/components/OperationForm";
import { OperationsList } from "@/components/OperationsList";
import { StatsCards } from "@/components/StatsCards";
import { Landmark } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="gradient-hero text-primary-foreground">
        <div className="container py-8">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-primary-foreground/10 p-2.5 backdrop-blur-sm">
              <Landmark className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Bank Account Manager</h1>
              <p className="text-primary-foreground/80 text-sm">
                Track deposits, withdrawals, and loans
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8 space-y-8">
        {/* Stats Overview */}
        <section>
          <StatsCards />
        </section>

        {/* Form and Operations List */}
        <div className="grid gap-8 lg:grid-cols-[400px_1fr]">
          <aside>
            <OperationForm />
          </aside>
          <section>
            <OperationsList />
          </section>
        </div>
      </main>
    </div>
  );
};

export default Index;
