import { Switch, Route, useLocation } from 'wouter';
import { queryClient } from './lib/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from '@/hooks/use-auth';
import { ThemeProvider } from '@/components/theme-provider';
import { ModernLayout } from '@/components/modern-layout';
import { NavigationSidebar } from '@/components/navigation-sidebar';
import Home from '@/pages/home';
import Congress from '@/pages/congress';
import CongressAdmin from '@/pages/congress-admin';
import CampaignPortal from '@/pages/campaign-portal';
import CandidatePortal from '@/pages/candidate-portal';
import MonitoringDashboard from '@/pages/monitoring-dashboard';
import GlobalDashboard from '@/pages/global-dashboard';
import CivicDashboard from '@/pages/civic-dashboard';
import ElectionDetails from '@/pages/election-details';
import Midterm2026 from '@/pages/midterm-2026';
import NotFound from '@/pages/not-found';

function Router() {
  return (
    <ModernLayout sidebar={<NavigationSidebar />}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/congress" component={Congress} />
        <Route path="/congress/admin" component={CongressAdmin} />
        <Route path="/campaign-portal" component={CampaignPortal} />
        <Route path="/candidate-portal" component={CandidatePortal} />
        <Route path="/monitoring" component={MonitoringDashboard} />
        <Route path="/global" component={GlobalDashboard} />
        <Route path="/civic" component={CivicDashboard} />
        <Route path="/2026" component={Midterm2026} />
        <Route path="/elections/:id" component={ElectionDetails} />
        <Route component={NotFound} />
      </Switch>
    </ModernLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <TooltipProvider>
            <div className="min-h-screen bg-app-bg text-app-fg font-sans antialiased">
              <Toaster />
              <Router />
            </div>
          </TooltipProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
