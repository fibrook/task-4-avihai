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
      <section className="gradient-hero text-primary-foreground">
        <div className="container py-4 sm:py-6">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight mb-0.5">Account Overview</h1>
          <p className="text-primary-foreground/80 text-xs sm:text-sm">
            Search and view your account operations
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="container py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Stats */}
        <StatsCards />

        {/* Compact Search Bar */}
        <div className="flex flex-col sm:flex-row gap-2 items-center">
          <form onSubmit={handleSearch} className="flex gap-2 w-full">
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
          <h2 className="text-lg sm:text-xl font-semibold mb-4 flex items-center gap-2">
            <FileSearch className="h-5 w-5 text-primary" />
            {activeSearch ? "Search Results" : "All Operations"}
            {operations && operations.length > 0 && (
              <span className="text-sm font-normal text-muted-foreground">
                ({operations.length})
              </span>
            )}
          </h2>

          {isLoading ? (
            <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
              {[...Array(6)].map((_, i) => (
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
            <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
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
