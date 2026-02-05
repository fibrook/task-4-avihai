import { OperationForm } from "@/components/OperationForm";
import { Navbar } from "@/components/Navbar";

const Actions = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="gradient-hero text-primary-foreground">
        <div className="container py-6 sm:py-10">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1 sm:mb-2">New Operation</h1>
          <p className="text-primary-foreground/80 text-sm sm:text-base">
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
