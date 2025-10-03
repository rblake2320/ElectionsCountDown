import { useState, useMemo } from "react";
import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Settings,
  Bell,
  Grid3X3,
  List,
  Loader2,
  Users,
  User,
  LogOut,
} from "lucide-react";
import FilterSidebar from "@/components/filter-sidebar-new";
import { ElectionCard } from "@/components/election-card";
import { VoterInfoLookup } from "@/components/voter-info-lookup";
import { AIElectionSearch } from "@/components/ai-election-search";
import { AuthModal } from "@/components/auth-modal";
import { UserWatchlist } from "@/components/user-watchlist";
import { VersionSwitcher } from "@/components/version-switcher";
import { useElections, useElectionStats } from "@/hooks/use-elections";
import { useAuth } from "@/hooks/use-auth";
import { type ElectionFilters } from "@shared/schema";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export default function Home() {
  const [filters, setFilters] = useState<ElectionFilters>({
    state: undefined,
    type: undefined,
    level: undefined,
    timeframe: undefined,
    timeRange: undefined,
    party: undefined,
    electionType: undefined,
    search: undefined,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const {
    user,
    isAuthenticated,
    isLoading: authLoading,
    login,
    logout,
  } = useAuth();

  const queryFilters = useMemo(
    () => ({
      state: filters.state,
      type: filters.type,
      level: filters.level,
      timeframe: filters.timeframe,
      timeRange: filters.timeRange,
      electionType: filters.electionType,
      party: filters.party,
      search: searchQuery || undefined,
    }),
    [filters, searchQuery],
  );

  const { data: elections = [], isLoading, error } = useElections(queryFilters);

  const { data: stats } = useElectionStats();

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  const handleFiltersChange = (newFilters: ElectionFilters) => {
    setFilters(newFilters);
  };

  const removeFilter = (filterType: keyof ElectionFilters, value?: string) => {
    const newFilters = { ...filters };
    newFilters[filterType] = undefined;
    setFilters(newFilters);
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-destructive mb-2">
            Error Loading Elections
          </h2>
          <p className="text-muted-foreground">
            Unable to load election data. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">E</span>
                </div>
                <h1 className="text-xl font-bold">ElectionTracker</h1>
              </div>
              <div className="hidden md:block bg-muted px-3 py-1 rounded-full">
                <span className="text-sm font-medium text-muted-foreground">
                  Live Dashboard
                </span>
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full ml-2 animate-pulse"></span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search elections, candidates..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-64 pl-10"
                />
              </div>
              <Link href="/congress">
                <Button variant="outline" size="sm">
                  <Users className="h-4 w-4 mr-1" />
                  Congress
                </Button>
              </Link>
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <User className="h-4 w-4 mr-1" />
                      {user.email?.split("@")[0] || "User"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={logout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAuthModal(true)}
                >
                  <User className="h-4 w-4 mr-1" />
                  Sign In
                </Button>
              )}

              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6 w-full">
          {/* Filter Sidebar */}
          <aside className="w-full lg:w-80 space-y-6 flex-shrink-0">
            <VersionSwitcher compact={false} />
            <FilterSidebar
              filters={filters}
              onFiltersChange={handleFiltersChange}
            />
            <VoterInfoLookup />
            <UserWatchlist />
            <AIElectionSearch />
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Dashboard Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold">Upcoming Elections</h2>
                  <p className="text-muted-foreground">
                    {isLoading
                      ? "Loading elections..."
                      : `Showing ${elections.length} of ${stats?.total || 0} elections`}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid3X3 className="h-4 w-4 mr-1" />
                    Grid
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4 mr-1" />
                    List
                  </Button>
                </div>
              </div>

              {/* Active Filters Display */}
              {activeFiltersCount > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {filters.timeframe && (
                    <Badge variant="secondary" className="gap-1">
                      Time: {filters.timeframe}
                      <button
                        onClick={() => removeFilter("timeframe")}
                        className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                      >
                        ×
                      </button>
                    </Badge>
                  )}
                  {filters.state && filters.state !== "all" && (
                    <Badge variant="secondary" className="gap-1">
                      State: {filters.state}
                      <button
                        onClick={() => removeFilter("state")}
                        className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                      >
                        ×
                      </button>
                    </Badge>
                  )}
                  {filters.type && (
                    <Badge variant="secondary" className="gap-1">
                      Type: {filters.type}
                      <button
                        onClick={() => removeFilter("type")}
                        className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                      >
                        ×
                      </button>
                    </Badge>
                  )}
                  {filters.level && (
                    <Badge variant="secondary" className="gap-1">
                      Level: {filters.level}
                      <button
                        onClick={() => removeFilter("level")}
                        className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                      >
                        ×
                      </button>
                    </Badge>
                  )}
                  {filters.party && (
                    <Badge variant="secondary" className="gap-1">
                      Party: {filters.party}
                      <button
                        onClick={() => removeFilter("party")}
                        className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                      >
                        ×
                      </button>
                    </Badge>
                  )}
                </div>
              )}
            </div>

            {/* Elections Grid/List */}
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading elections...</span>
              </div>
            ) : elections.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-semibold mb-2">
                  No Elections Found
                </h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or search criteria to find
                  elections.
                </p>
                <Button
                  onClick={() =>
                    setFilters({
                      state: undefined,
                      type: undefined,
                      level: undefined,
                      timeframe: undefined,
                      timeRange: undefined,
                      party: undefined,
                      electionType: undefined,
                      search: undefined,
                    })
                  }
                >
                  Clear All Filters
                </Button>
              </div>
            ) : (
              <div
                className={cn(
                  "w-full",
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-fr"
                    : "space-y-4 flex flex-col",
                )}
              >
                {elections.map((election) => (
                  <ElectionCard
                    key={election.id}
                    election={election}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            )}

            {/* Load More */}
            {elections.length > 0 &&
              stats &&
              elections.length < stats.total && (
                <div className="text-center py-8">
                  <Button variant="outline">
                    Load More Elections ({stats.total - elections.length}{" "}
                    remaining)
                  </Button>
                </div>
              )}
          </main>
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuth={login}
      />
    </div>
  );
}
