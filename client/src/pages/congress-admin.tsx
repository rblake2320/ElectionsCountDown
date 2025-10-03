import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, Users, Search, RefreshCw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { apiRequest } from "@/lib/queryClient";

interface CongressMember {
  id: number;
  name: string;
  state: string;
  district: string | null;
  party: string;
  chamber: string;
}

interface CongressStats {
  total: number;
  house: number;
  senate: number;
  partyBreakdown: Record<string, number>;
  stateIssues: string[];
}

export default function CongressAdminPage() {
  const [perplexityResult, setPerplexityResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const queryClient = useQueryClient();

  // Get current congressional data
  const { data: members = [], isLoading } = useQuery<CongressMember[]>({
    queryKey: ["/api/members"],
  });

  // Calculate statistics
  const stats: CongressStats = {
    total: members.length,
    house: members.filter((m) => m.chamber === "House").length,
    senate: members.filter((m) => m.chamber === "Senate").length,
    partyBreakdown: members.reduce(
      (acc, member) => {
        const party = member.party || "Unknown";
        acc[party] = (acc[party] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    ),
    stateIssues: [],
  };

  // Check for state issues
  const senateByState = members
    .filter((m) => m.chamber === "Senate")
    .reduce(
      (acc, senator) => {
        acc[senator.state] = (acc[senator.state] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

  Object.entries(senateByState).forEach(([state, count]) => {
    if (count !== 2) {
      stats.stateIssues.push(`${state}: ${count} senators`);
    }
  });

  // Import mutation
  const importMutation = useMutation({
    mutationFn: () =>
      fetch("/api/congress/import", { method: "POST" }).then((res) =>
        res.json(),
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/members"] });
    },
  });

  // Perplexity analysis mutation
  const perplexityMutation = useMutation({
    mutationFn: () =>
      fetch("/api/congress/find-missing", { method: "POST" }).then((res) =>
        res.json(),
      ),
    onSuccess: (data) => {
      setPerplexityResult(data);
    },
  });

  const handlePerplexityAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      await perplexityMutation.mutateAsync();
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Congressional Data Management</h1>
        <div className="flex gap-2">
          <Button
            onClick={() => importMutation.mutate()}
            disabled={importMutation.isPending}
            variant="outline"
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${importMutation.isPending ? "animate-spin" : ""}`}
            />
            Re-import Data
          </Button>
          <Button
            onClick={handlePerplexityAnalysis}
            disabled={isAnalyzing || perplexityMutation.isPending}
          >
            <Search
              className={`h-4 w-4 mr-2 ${isAnalyzing ? "animate-spin" : ""}`}
            />
            Find Missing Members
          </Button>
        </div>
      </div>

      {/* Current Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              Expected: 535 ({535 - stats.total} missing)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">House</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.house}</div>
            <p className="text-xs text-muted-foreground">
              Expected: 435 ({435 - stats.house} missing)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Senate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.senate}</div>
            <p className="text-xs text-muted-foreground">
              Expected: 100 (
              {stats.senate > 100
                ? `${stats.senate - 100} extra`
                : `${100 - stats.senate} missing`}
              )
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Issues Alert */}
      {stats.stateIssues.length > 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="font-medium">Data Issues Detected:</div>
            <ul className="mt-2 space-y-1">
              {stats.stateIssues.map((issue, index) => (
                <li key={index} className="text-sm">
                  • {issue}
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Party Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Party Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {Object.entries(stats.partyBreakdown).map(([party, count]) => (
              <Badge key={party} variant="outline">
                {party}: {count}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Perplexity Analysis Results */}
      {perplexityResult && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {perplexityResult.success ? (
              <div>
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap text-sm">
                    {perplexityResult.data}
                  </div>
                </div>

                {perplexityResult.citations &&
                  perplexityResult.citations.length > 0 && (
                    <div className="mt-4">
                      <Separator />
                      <h4 className="font-medium mt-4 mb-2">Sources:</h4>
                      <ul className="space-y-1">
                        {perplexityResult.citations.map(
                          (citation: string, index: number) => (
                            <li key={index} className="text-sm">
                              <a
                                href={citation}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                {citation}
                              </a>
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                  )}
              </div>
            ) : (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Error: {perplexityResult.error}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
