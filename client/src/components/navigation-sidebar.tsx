import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import {
  Home,
  Users,
  Building2,
  BarChart3,
  Radio,
  Globe,
  Database,
  Calendar,
  Shield,
} from 'lucide-react';

const navigationItems = [
  { label: 'Elections', path: '/', icon: Home },
  { label: '2026 Midterms', path: '/2026', icon: Calendar },
  { label: 'Congress', path: '/congress', icon: Users },
  { label: 'Campaign Portal', path: '/campaign-portal', icon: Building2 },
  { label: 'Candidate Portal', path: '/candidate-portal', icon: Shield },
  { label: 'Congress Admin', path: '/congress-admin', icon: BarChart3 },
  { label: 'Real-Time Monitor', path: '/monitoring', icon: Radio },
  { label: 'Global Observatory', path: '/global', icon: Globe },
  { label: 'Civic Data APIs', path: '/civic', icon: Database },
];

export function NavigationSidebar() {
  const [location] = useLocation();

  return (
    <div className="space-y-2">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-foreground">Navigation</h2>
      </div>
      <nav className="space-y-1">
        {navigationItems.map(item => {
          const Icon = item.icon;
          const isActive = location === item.path;

          return (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200',
                'hover:bg-accent hover:text-accent-foreground',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
