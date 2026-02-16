import { OperationForm } from "@/components/OperationForm";
import { Navbar } from "@/components/Navbar";

const Actions = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="gradient-hero hero-pattern text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23d4af37\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
        <div className="container py-6 sm:py-10 relative">
          <div className="flex items-center gap-2 mb-1">
            <div className="h-px w-8 bg-accent/50" />
            <span className="text-accent text-xs uppercase tracking-[0.2em] font-medium">Transaction</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1 sm:mb-2">New Operation</h1>
          <p className="text-primary-foreground/70 text-sm sm:text-base">
            Record a deposit, withdrawal, or loan
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="container py-6 sm:py-8">
        <div className="max-w-lg mx-auto">
          <OperationForm />
        </div>
      </main>
    </div>
  );
};

export default Actions;
