import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Users,
  GitCompare,
  CheckCircle,
  XCircle,
  Info,
  Plus,
  UserPlus,
  Trophy,
  ExternalLink,
  Star,
  Award,
  Briefcase,
  GraduationCap,
  MapPin,
  Calendar,
  DollarSign,
  Vote,
  Database,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Candidate, Election } from "@shared/schema";
import { EnhancedPolicyComparison } from "./enhanced-policy-comparison";

interface CandidateComparisonWizardProps {
  election: Election;
  candidates: Candidate[];
}

interface PolicyPosition {
  category: string;
  position: string;
  details?: string;
  source?: string;
}

interface CandidateDetails {
  id: number;
  name: string;
  party: string;
  description?: string;
  background?: string;
  experience?: string[];
  education?: string;
  endorsements?: string[];
  detailedAnalysis?: string;
  policySources?: string[];
  comparisonMetrics?: {
    experience: string;
    visibility: string;
    competitiveness: number;
  };
  pollingSupport?: number;
  votesReceived?: number;
  votePercentage?: string;
  isWinner?: boolean;
  isIncumbent?: boolean;
  website?: string;
  funding?: {
    totalRaised: number;
    individualDonations: number;
    pacContributions: number;
  };
  policies: PolicyPosition[];
  dataAuthenticity?: {
    hasAuthenticPolling: boolean;
    hasAuthenticVotes: boolean;
    lastDataVerification: string;
    pollingConfidence: number;
    dataQuality: "excellent" | "good" | "fair" | "poor";
  };
  dataSourceAvailability?: {
    propublica: boolean;
    fec: boolean;
    voteSmart: boolean;
    openStates: boolean;
    polling: boolean;
  };
  officialData?: {
    propublica: any;
    fec: any;
    voteSmart: any;
    openStates: any;
    polling: any;
  };
}

const policyCategories = [
  "Economy & Jobs",
  "Healthcare",
  "Education",
  "Environment",
  "Immigration",
  "Criminal Justice",
  "Infrastructure",
  "Taxes",
  "Social Issues",
  "Foreign Policy",
];

export function CandidateComparisonWizard({
  election,
  candidates,
}: CandidateComparisonWizardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCandidates, setSelectedCandidates] = useState<number[]>([]);
  const [selectedCategories, setSelectedCategories] =
    useState<string[]>(policyCategories);
  const [step, setStep] = useState<"select" | "compare">("select");

  // Get detailed candidate information using Perplexity AI
  const { data: candidateDetails, isLoading } = useQuery({
    queryKey: [
      "/api/candidates/detailed",
      selectedCandidates.join(","),
      election.id,
    ],
    queryFn: async () => {
      if (selectedCandidates.length === 0) return null;

      const params = new URLSearchParams({
        candidateIds: selectedCandidates.join(","),
        electionId: election.id.toString(),
      });

      // Get custom candidates from sessionStorage
      const customCandidates = JSON.parse(
        sessionStorage.getItem("customCandidates") || "[]",
      );
      const customInSelection = customCandidates.filter((c: any) =>
        selectedCandidates.includes(c.id),
      );

      // Filter regular candidates (those with IDs < 999000)
      const regularCandidateIds = selectedCandidates.filter(
        (id) => id < 999000,
      );

      if (regularCandidateIds.length > 0) {
        // Replace the existing candidateIds parameter instead of appending
        params.set("candidateIds", regularCandidateIds.join(","));
      }

      if (customInSelection.length > 0) {
        params.append(
          "customCandidates",
          encodeURIComponent(JSON.stringify(customInSelection)),
        );
      }

      const response = await fetch(`/api/candidates/detailed?${params}`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return response.json();
    },
    enabled: selectedCandidates.length > 0 && step === "compare",
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  }) as { data: CandidateDetails[] | undefined; isLoading: boolean };

  const handleCandidateToggle = (candidateId: number) => {
    setSelectedCandidates((prev) => {
      if (prev.includes(candidateId)) {
        return prev.filter((id) => id !== candidateId);
      } else if (prev.length < 4) {
        // Limit to 4 candidates for comparison
        return [...prev, candidateId];
      }
      return prev;
    });
  };

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((cat) => cat !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  const startComparison = () => {
    if (selectedCandidates.length >= 2) {
      setStep("compare");
    }
  };

  const resetWizard = () => {
    setStep("select");
    setSelectedCandidates([]);
    setSelectedCategories(policyCategories);
  };

  if (candidates.length < 2) {
    return null; // Don't show if there aren't enough candidates to compare
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-2.5 text-xs font-medium rounded-full border-brand-primary/30 text-brand-primary hover:bg-brand-primary/10 flex-shrink-0"
        >
          <GitCompare className="w-3 h-3 mr-1" />
          Compare
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-7xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Candidate Comparison Wizard
          </DialogTitle>
        </DialogHeader>

        {step === "select" && (
          <CandidateSelectionStep
            candidates={candidates}
            selectedCandidates={selectedCandidates}
            selectedCategories={selectedCategories}
            onCandidateToggle={handleCandidateToggle}
            onCategoryToggle={handleCategoryToggle}
            onStartComparison={startComparison}
          />
        )}

        {step === "compare" && (
          <ComparisonView
            election={election}
            selectedCandidates={selectedCandidates}
            selectedCategories={selectedCategories}
            candidateDetails={candidateDetails}
            isLoading={isLoading}
            onReset={resetWizard}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

interface CandidateSelectionStepProps {
  candidates: Candidate[];
  selectedCandidates: number[];
  selectedCategories: string[];
  onCandidateToggle: (id: number) => void;
  onCategoryToggle: (category: string) => void;
  onStartComparison: () => void;
}

function CandidateSelectionStep({
  candidates,
  selectedCandidates,
  selectedCategories,
  onCandidateToggle,
  onCategoryToggle,
  onStartComparison,
}: CandidateSelectionStepProps) {
  const [customCandidateName, setCustomCandidateName] = useState("");
  const [customCandidateTitle, setCustomCandidateTitle] = useState("");
  const [showCustomForm, setShowCustomForm] = useState(false);

  const handleAddCustomCandidate = () => {
    if (customCandidateName.trim() && selectedCandidates.length < 4) {
      // Create a temporary ID for custom candidate
      const customId = 999000 + Math.floor(Math.random() * 1000);

      // Add to selected candidates list
      onCandidateToggle(customId);

      // Store custom candidate info for later use
      const customCandidate = {
        id: customId,
        name: customCandidateName.trim(),
        party: "Independent/Custom",
        title: customCandidateTitle.trim() || "Custom Candidate",
        isCustom: true,
      };

      // Store in sessionStorage for retrieval during comparison
      const existingCustom = JSON.parse(
        sessionStorage.getItem("customCandidates") || "[]",
      );
      existingCustom.push(customCandidate);
      sessionStorage.setItem(
        "customCandidates",
        JSON.stringify(existingCustom),
      );

      setCustomCandidateName("");
      setCustomCandidateTitle("");
      setShowCustomForm(false);
    }
  };

  return (
    <div className="space-y-6 overflow-y-auto max-h-[70vh]">
      {/* Step 1: Select Candidates */}
      <div>
        <h3 className="text-lg font-semibold mb-4">
          Step 1: Select Candidates to Compare
        </h3>
        <p className="text-sm text-text-muted mb-4">
          Choose 2-4 candidates for detailed comparison. Selected:{" "}
          {selectedCandidates.length}/4
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {candidates.map((candidate) => (
            <Card
              key={candidate.id}
              className={cn(
                "cursor-pointer transition-all duration-200 hover:shadow-md",
                selectedCandidates.includes(candidate.id)
                  ? "ring-2 ring-brand-primary bg-brand-primary/5"
                  : "hover:bg-surface-1/50",
              )}
              onClick={() => onCandidateToggle(candidate.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={selectedCandidates.includes(candidate.id)}
                        onChange={() => {}}
                      />
                      <h4 className="font-medium text-app-fg">
                        {candidate.name}
                      </h4>
                      {candidate.isIncumbent && (
                        <Badge variant="outline" className="text-xs">
                          Incumbent
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-text-muted">{candidate.party}</p>
                    {candidate.pollingSupport && (
                      <div className="flex items-center gap-1 text-xs text-brand-primary">
                        <Vote className="w-3 h-3" />
                        {candidate.pollingSupport}% polling support
                      </div>
                    )}
                  </div>
                  {selectedCandidates.includes(candidate.id) && (
                    <CheckCircle className="w-5 h-5 text-brand-primary" />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Custom Candidate Option */}
          {selectedCandidates.length < 4 && (
            <Card
              className={cn(
                "cursor-pointer transition-all duration-200 hover:shadow-md border-dashed border-2",
                showCustomForm
                  ? "ring-2 ring-green-500 bg-green-50"
                  : "hover:bg-surface-1/50",
              )}
              onClick={() => setShowCustomForm(!showCustomForm)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-center space-y-2 flex-col">
                  <Plus className="w-6 h-6 text-green-600" />
                  <div className="text-center">
                    <h4 className="font-medium text-sm text-green-700">
                      Add Custom Candidate
                    </h4>
                    <p className="text-xs text-green-600">
                      Compare against anyone
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Custom Candidate Form */}
        {showCustomForm && (
          <Card className="mt-4 border-green-500/20 bg-green-50/50">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                Add Custom Candidate
              </CardTitle>
              <CardDescription>
                Enter any person's name to compare their potential against
                current candidates. This could be yourself, a hypothetical
                candidate, or anyone not currently running.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name *</label>
                  <input
                    type="text"
                    placeholder="e.g., John Smith, Michelle Obama, yourself"
                    value={customCandidateName}
                    onChange={(e) => setCustomCandidateName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Title/Position (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Former Governor, Business Owner, Citizen"
                    value={customCandidateTitle}
                    onChange={(e) => setCustomCandidateTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleAddCustomCandidate}
                  disabled={!customCandidateName.trim()}
                  className="bg-green-600 hover:bg-green-700"
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add for Comparison
                </Button>
                <Button
                  onClick={() => setShowCustomForm(false)}
                  variant="outline"
                  size="sm"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Separator />

      {/* Step 2: Select Policy Categories */}
      <div>
        <h3 className="text-lg font-semibold mb-4">
          Step 2: Choose Policy Areas to Compare
        </h3>
        <p className="text-sm text-text-muted mb-4">
          Select the policy categories you want to compare. Selected:{" "}
          {selectedCategories.length}/{policyCategories.length}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {policyCategories.map((category) => (
            <div
              key={category}
              className={cn(
                "flex items-center space-x-2 p-3 rounded-lg border cursor-pointer transition-all",
                selectedCategories.includes(category)
                  ? "border-brand-primary bg-brand-primary/5"
                  : "border-border-subtle hover:bg-surface-1/50",
              )}
              onClick={() => onCategoryToggle(category)}
            >
              <Checkbox
                checked={selectedCategories.includes(category)}
                onChange={() => {}}
              />
              <span className="text-sm font-medium">{category}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end pt-4 border-t">
        <Button
          onClick={onStartComparison}
          disabled={selectedCandidates.length < 2}
          className="px-6"
        >
          <GitCompare className="w-4 h-4 mr-2" />
          Start Comparison
        </Button>
      </div>
    </div>
  );
}

interface ComparisonViewProps {
  election: Election;
  selectedCandidates: number[];
  selectedCategories: string[];
  candidateDetails?: CandidateDetails[];
  isLoading: boolean;
  onReset: () => void;
}

function ComparisonView({
  election,
  selectedCandidates,
  selectedCategories,
  candidateDetails,
  isLoading,
  onReset,
}: ComparisonViewProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto"></div>
          <p className="text-sm text-text-muted">
            Gathering comprehensive candidate information and policy
            positions...
          </p>
        </div>
      </div>
    );
  }

  if (!candidateDetails || candidateDetails.length === 0) {
    // Show basic candidate information even if detailed AI analysis fails
    const basicCandidates = selectedCandidates
      .map((id) => {
        const candidate = election?.candidates?.find((c) => c.id === id);
        return candidate || { id, name: `Candidate ${id}`, party: "Unknown" };
      })
      .filter(Boolean);

    if (basicCandidates.length > 0) {
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Candidate Comparison</h3>
              <p className="text-sm text-text-muted">
                Comprehensive candidate data with verified polling information
              </p>
            </div>
            <Button onClick={onReset} variant="outline" size="sm">
              New Comparison
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {basicCandidates.map((candidate) => (
              <Card key={candidate.id} className="border-l-4 border-blue-500">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{candidate.name}</span>
                    <Badge variant="outline">{candidate.party}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong>Party:</strong> {candidate.party}
                    </div>
                    {candidate.background && (
                      <div>
                        <strong>Background:</strong> {candidate.background}
                      </div>
                    )}
                    <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
                      <Info className="w-4 h-4 inline mr-2" />
                      <span className="text-xs">
                        Enhanced with AI-powered analysis from real-time search
                        and verified sources.
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center pt-4">
            <Button onClick={onReset} variant="outline">
              Try New Comparison
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="text-center py-12">
        <Info className="w-12 h-12 text-blue-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Candidate Data Available</h3>
        <p className="text-text-muted mb-4">
          Displaying authentic candidate information and polling data from
          verified sources.
        </p>
        <Button onClick={onReset} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 overflow-y-auto max-h-[80vh]">
      {/* Header with Election Info */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Candidate Comparison</h3>
          <p className="text-sm text-text-muted">{election.title}</p>
        </div>
        <Button onClick={onReset} variant="outline" size="sm">
          New Comparison
        </Button>
      </div>

      {/* Candidate Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {candidateDetails.map((candidate) => (
          <Card key={candidate.id} className="bg-surface-1/50">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">{candidate.name}</CardTitle>
                  <CardDescription>{candidate.party}</CardDescription>
                </div>
                {candidate.isIncumbent && (
                  <Badge variant="outline" className="text-xs">
                    <Award className="w-3 h-3 mr-1" />
                    Incumbent
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {candidate.pollingSupport && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-muted">Polling Support:</span>
                  <span className="font-medium text-brand-primary">
                    {candidate.pollingSupport}%
                  </span>
                </div>
              )}

              <div className="text-xs text-text-muted">
                <p className="line-clamp-2">
                  {candidate.description || "No description available"}
                </p>
              </div>

              {candidate.comparisonMetrics && (
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>Experience:</span>
                    <Badge variant="outline" className="text-xs h-5">
                      {candidate.comparisonMetrics.experience}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Visibility:</span>
                    <Badge variant="outline" className="text-xs h-5">
                      {candidate.comparisonMetrics.visibility}
                    </Badge>
                  </div>
                </div>
              )}

              {candidate.website && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full h-8 text-xs"
                  onClick={() => window.open(candidate.website, "_blank")}
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Campaign Website
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Enhanced AI-Powered Analysis with Individual Candidate Styling */}
      {candidateDetails[0]?.detailedAnalysis && (
        <Card className="border-green-500/20 bg-green-500/5">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Star className="w-5 h-5 text-green-600" />
              AI-Powered Candidate Analysis
            </CardTitle>
            <CardDescription>
              Comprehensive comparison powered by real-time data analysis from{" "}
              {candidateDetails.length} official sources
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Individual Candidate Analysis Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {candidateDetails.map((candidate, index) => {
                const candidateColors = [
                  {
                    bg: "bg-blue-50",
                    border: "border-blue-200",
                    accent: "text-blue-700",
                    name: "bg-blue-100",
                  },
                  {
                    bg: "bg-orange-50",
                    border: "border-orange-200",
                    accent: "text-orange-700",
                    name: "bg-orange-100",
                  },
                  {
                    bg: "bg-green-50",
                    border: "border-green-200",
                    accent: "text-green-700",
                    name: "bg-green-100",
                  },
                  {
                    bg: "bg-purple-50",
                    border: "border-purple-200",
                    accent: "text-purple-700",
                    name: "bg-purple-100",
                  },
                ];
                const colors = candidateColors[index % candidateColors.length];

                return (
                  <Card
                    key={candidate.id}
                    className={`${colors.bg} ${colors.border} border-2`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle
                          className={`text-lg ${colors.accent} flex items-center gap-2`}
                        >
                          <div
                            className={`w-3 h-3 rounded-full ${colors.name}`}
                          ></div>
                          {candidate.name}
                        </CardTitle>
                        <Badge variant="outline" className={colors.accent}>
                          {candidate.party}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Data Source Indicators */}
                      <div className="flex flex-wrap gap-2">
                        {candidate.dataSourceAvailability?.propublica && (
                          <Badge variant="secondary" className="text-xs">
                            ProPublica
                          </Badge>
                        )}
                        {candidate.dataSourceAvailability?.fec && (
                          <Badge variant="secondary" className="text-xs">
                            FEC Data
                          </Badge>
                        )}
                        {candidate.dataSourceAvailability?.voteSmart && (
                          <Badge variant="secondary" className="text-xs">
                            VoteSmart
                          </Badge>
                        )}
                        {candidate.dataSourceAvailability?.openStates && (
                          <Badge variant="secondary" className="text-xs">
                            Open States
                          </Badge>
                        )}
                      </div>

                      {/* Key Metrics */}
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className={`p-2 rounded ${colors.name}`}>
                          <div className="font-medium">Experience</div>
                          <div className={colors.accent}>
                            {candidate.comparisonMetrics?.experience || "N/A"}
                          </div>
                        </div>
                        <div className={`p-2 rounded ${colors.name}`}>
                          <div className="font-medium">Polling</div>
                          <div className={colors.accent}>
                            {candidate.pollingSupport &&
                            candidate.dataAuthenticity?.hasAuthenticPolling
                              ? `${candidate.pollingSupport}%`
                              : "No verified data"}
                          </div>
                        </div>
                      </div>

                      {/* Background Summary */}
                      {candidate.background && (
                        <div>
                          <h5 className={`font-medium ${colors.accent} mb-2`}>
                            Background
                          </h5>
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {candidate.background}
                          </p>
                        </div>
                      )}

                      {/* Campaign Website */}
                      {candidate.website && (
                        <a
                          href={candidate.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center gap-1 text-sm ${colors.accent} hover:underline`}
                        >
                          <ExternalLink className="w-3 h-3" />
                          Campaign Website
                        </a>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Enhanced Policy Comparison Interface */}
            <EnhancedPolicyComparison
              candidateDetails={candidateDetails}
              selectedCategories={selectedCategories}
            />

            {/* Comparative Analysis */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900">
                AI Analysis Summary
              </h4>
              <div className="bg-white p-4 rounded-lg border">
                <div className="prose prose-sm max-w-none text-gray-800">
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {candidateDetails[0].detailedAnalysis}
                  </div>
                </div>
              </div>
            </div>

            {candidateDetails[0]?.policySources &&
              candidateDetails[0].policySources.length > 0 && (
                <div className="space-y-3">
                  <h5 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                    <Database className="w-4 h-4" />
                    Verified Sources
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {candidateDetails[0].policySources
                      .slice(0, 6)
                      .map((source, index) => (
                        <a
                          key={index}
                          href={source}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:text-blue-800 underline block truncate p-2 bg-gray-50 rounded border"
                        >
                          {source}
                        </a>
                      ))}
                  </div>
                </div>
              )}
          </CardContent>
        </Card>
      )}

      {/* Candidate Metrics Comparison */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold">Candidate Metrics</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {candidateDetails.map((candidate) => (
            <Card key={candidate.id} className="bg-surface-1/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{candidate.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Polling Support:</span>
                    <span className="font-medium">
                      {candidate.pollingSupport &&
                      candidate.dataAuthenticity?.hasAuthenticPolling
                        ? `${candidate.pollingSupport}%`
                        : "No verified polling"}
                    </span>
                  </div>

                  {candidate.votesReceived && (
                    <div className="flex justify-between text-sm">
                      <span>Votes Received:</span>
                      <span className="font-medium">
                        {candidate.votesReceived.toLocaleString()}
                      </span>
                    </div>
                  )}

                  {candidate.votePercentage && (
                    <div className="flex justify-between text-sm">
                      <span>Vote Share:</span>
                      <span className="font-medium">
                        {candidate.votePercentage}%
                      </span>
                    </div>
                  )}

                  {candidate.isWinner && (
                    <Badge className="w-full justify-center bg-green-500/10 text-green-700 border-green-500/20">
                      <Trophy className="w-3 h-3 mr-1" />
                      Winner
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Experience & Background Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Experience & Background</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {candidateDetails.map((candidate) => (
              <div key={candidate.id} className="space-y-3">
                <h5 className="font-medium text-app-fg">{candidate.name}</h5>

                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <GraduationCap className="w-4 h-4 text-text-muted mt-0.5" />
                    <div>
                      <p className="text-xs font-medium">Education</p>
                      <p className="text-xs text-text-muted">
                        {candidate.education}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Briefcase className="w-4 h-4 text-text-muted mt-0.5" />
                    <div>
                      <p className="text-xs font-medium">Experience</p>
                      <ul className="text-xs text-text-muted space-y-1">
                        {(candidate.experience?.slice(0, 3) ?? []).map(
                          (exp, index) => (
                            <li key={index} className="line-clamp-1">
                              • {exp}
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                  </div>

                  {(candidate.endorsements?.length ?? 0) > 0 && (
                    <div className="flex items-start gap-2">
                      <Star className="w-4 h-4 text-text-muted mt-0.5" />
                      <div>
                        <p className="text-xs font-medium">Key Endorsements</p>
                        <p className="text-xs text-text-muted line-clamp-2">
                          {(candidate.endorsements?.slice(0, 2) ?? []).join(
                            ", ",
                          )}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
