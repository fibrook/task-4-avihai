import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { StatsCards } from "@/components/StatsCards";
import { OperationCard } from "@/components/OperationCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, FileSearch, X } from "lucide-react";

interface Operation {
  id: string;
  account_number: string;
  operation_type: string;
  amount: number;
  interest: number | null;
  payments: number | null;
  created_at: string;
}

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearch, setActiveSearch] = useState("");

  const { data: operations, isLoading } = useQuery({
    queryKey: ["operations", activeSearch],
    queryFn: async () => {
      let query = supabase
        .from("account_operations")
        .select("*")
        .order("created_at", { ascending: false });

      if (activeSearch.trim()) {
        query = query.eq("account_number", activeSearch.trim());
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Operation[];
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveSearch(searchQuery);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setActiveSearch("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="gradient-hero hero-pattern text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23d4af37\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
        <div className="container py-5 sm:py-8 relative">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-px w-8 bg-accent/60" />
            <span className="text-accent text-xs uppercase tracking-[0.2em] font-semibold">Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1 gold-shimmer">Account Overview</h1>
          <p className="text-primary-foreground/70 text-sm sm:text-base">
            Your financial portfolio at a glance
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="container py-4 sm:py-6 space-y-4">
        {/* Stats */}
        <StatsCards />

        {/* Compact Search Bar */}
        <div className="flex flex-col sm:flex-row gap-2 items-center">
          <form onSubmit={handleSearch} className="flex gap-1.5 w-full max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
              <Input
                placeholder="Search by account number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-7 h-7 text-xs"
              />
            </div>
            <Button type="submit" size="sm" className="h-7 px-2.5 text-xs gradient-primary text-primary-foreground">
              <Search className="h-3 w-3 mr-1" />
              Search
            </Button>
            {activeSearch && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 px-2"
                onClick={handleClearSearch}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </form>
          {activeSearch && (
            <p className="text-xs text-muted-foreground">
              Showing: <span className="font-medium text-foreground">{activeSearch}</span>
            </p>
          )}
        </div>

        {/* Results Section */}
        <section>
          <h2 className="text-sm font-semibold mb-3 flex items-center gap-1.5">
            <FileSearch className="h-4 w-4 text-primary" />
            {activeSearch ? "Search Results" : "All Operations"}
            {operations && operations.length > 0 && (
              <span className="text-sm font-normal text-muted-foreground">
                ({operations.length})
              </span>
            )}
          </h2>

          {isLoading ? (
            <div className="grid gap-1.5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="shadow-card">
                  <CardContent className="p-2.5 sm:p-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-6 w-6 rounded-md" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                      <Skeleton className="h-4 w-14" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : !operations || operations.length === 0 ? (
            <Card className="shadow-card">
              <CardContent className="flex flex-col items-center justify-center py-12 sm:py-16 text-center px-4">
                <div className="rounded-full bg-muted p-3 sm:p-4 mb-4">
                  <FileSearch className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">No operations found</h3>
                <p className="text-sm sm:text-base text-muted-foreground max-w-sm">
                  {activeSearch
                    ? `No operations found for account "${activeSearch}". Try a different account number.`
                    : "There are no operations recorded yet. Go to Actions to add your first operation."}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-1.5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {operations.map((operation, index) => (
                <OperationCard key={operation.id} operation={operation} index={index} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Index;
