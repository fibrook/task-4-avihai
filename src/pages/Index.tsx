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
        <div className="container py-6 sm:py-10">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1 sm:mb-2">Account Overview</h1>
          <p className="text-primary-foreground/80 text-sm sm:text-base">
            Search and view your account operations
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="container py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Stats */}
        <StatsCards />

        {/* Search Section */}
        <Card className="shadow-card">
          <CardContent className="p-4 sm:p-6">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Enter account number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-11"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1 sm:flex-none h-11 px-4 sm:px-6 gradient-primary text-primary-foreground">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
                {activeSearch && (
                  <Button
                    type="button"
                    variant="outline"
                    className="h-11 px-4"
                    onClick={handleClearSearch}
                  >
                    <X className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Clear</span>
                  </Button>
                )}
              </div>
            </form>
            {activeSearch && (
              <p className="text-sm text-muted-foreground mt-3">
                Showing results for: <span className="font-semibold text-foreground">{activeSearch}</span>
              </p>
            )}
          </CardContent>
        </Card>

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
            <div className="grid gap-4 lg:grid-cols-2">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="shadow-card">
                  <CardContent className="p-4 sm:p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <Skeleton className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl" />
                        <div className="space-y-2">
                          <Skeleton className="h-5 w-20" />
                          <Skeleton className="h-4 w-24 sm:w-32" />
                        </div>
                      </div>
                      <Skeleton className="h-6 sm:h-8 w-20 sm:w-24" />
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
            <div className="grid gap-4 lg:grid-cols-2">
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
