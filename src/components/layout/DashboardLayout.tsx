import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { 
  Users, 
  Calendar, 
  FileText, 
  Clock, 
  CheckSquare, 
  HelpCircle, 
  CreditCard,
  Settings,
  LogOut,
  Building2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useAuth, UserRole } from '@/contexts/AuthContext';

interface DashboardLayoutProps {
  children: ReactNode;
  requiredRole: UserRole;
}

const roleMenuItems = {
  employee: [
    { icon: Clock, label: 'Check In/Out', path: '/dashboard/employee' },
    { icon: CheckSquare, label: 'Tasks', path: '/dashboard/employee/tasks' },
    { icon: Calendar, label: 'Holidays', path: '/dashboard/employee/holidays' },
    { icon: FileText, label: 'Leave Requests', path: '/dashboard/employee/leave' },
    { icon: HelpCircle, label: 'Tickets', path: '/dashboard/employee/tickets' },
    { icon: CreditCard, label: 'Pay Slips', path: '/dashboard/employee/payslips' },
  ],
  hr: [
    { icon: Clock, label: 'Check In/Out', path: '/dashboard/hr' },
    { icon: FileText, label: 'Leave Approvals', path: '/dashboard/hr/leave-approvals' },
    { icon: CreditCard, label: 'Payslip Upload', path: '/dashboard/hr/payslips' },
    { icon: Calendar, label: 'Holidays', path: '/dashboard/hr/holidays' },
    { icon: HelpCircle, label: 'Tickets', path: '/dashboard/hr/tickets' },
  ],
  admin: [
    { icon: Users, label: 'All Employees', path: '/dashboard/admin' },
    { icon: FileText, label: 'Leave Oversight', path: '/dashboard/admin/leave-oversight' },
    { icon: Calendar, label: 'Holiday Management', path: '/dashboard/admin/holidays' },
    { icon: CreditCard, label: 'Payslip Management', path: '/dashboard/admin/payslips' },
    { icon: Settings, label: 'System Settings', path: '/dashboard/admin/settings' },
  ],
};

export default function DashboardLayout({ children, requiredRole }: DashboardLayoutProps) {
  const { user, logout } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== requiredRole) {
    return <Navigate to={`/dashboard/${user.role}`} replace />;
  }

  const menuItems = roleMenuItems[user.role];
  const currentPath = window.location.pathname;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <Building2 className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">EMS</h1>
                <p className="text-xs text-muted-foreground capitalize">
                  {user.role} Dashboard
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-foreground">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
              className="text-muted-foreground hover:text-destructive"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 h-[calc(100vh-73px)] bg-card border-r">
          <div className="p-4">
            <nav className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPath === item.path || 
                  (currentPath.startsWith(item.path) && item.path !== `/dashboard/${user.role}`);
                
                return (
                  <Button
                    key={item.path}
                    variant={isActive ? "default" : "ghost"}
                    className={`w-full justify-start ${
                      isActive 
                        ? "bg-primary text-primary-foreground" 
                        : "hover:bg-muted"
                    }`}
                    onClick={() => window.location.href = item.path}
                  >
                    <Icon className="h-4 w-4 mr-3" />
                    {item.label}
                  </Button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 h-[calc(100vh-73px)] overflow-auto">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}