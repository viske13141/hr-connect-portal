import { useState } from 'react';
import { 
  Users, 
  TrendingUp, 
  Calendar, 
  FileText, 
  Settings, 
  BarChart3,
  Clock,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function AdminDashboard() {
  // Mock data
  const systemStats = {
    totalEmployees: 157,
    activeToday: 142,
    onLeave: 8,
    pendingRequests: 12,
    averageWorkHours: 7.8,
    attendanceRate: 89,
  };

  const departmentStats = [
    { name: 'Engineering', employees: 45, attendance: 92, workHours: 8.2 },
    { name: 'Sales', employees: 32, attendance: 87, workHours: 7.9 },
    { name: 'Marketing', employees: 28, attendance: 91, workHours: 7.6 },
    { name: 'HR', employees: 15, attendance: 95, workHours: 8.0 },
    { name: 'Finance', employees: 22, attendance: 88, workHours: 7.8 },
    { name: 'Operations', employees: 15, attendance: 84, workHours: 8.1 },
  ];

  const recentActivities = [
    { id: 1, type: 'leave', description: '5 new leave requests submitted', time: '10 minutes ago', priority: 'medium' },
    { id: 2, type: 'attendance', description: 'Daily attendance report generated', time: '1 hour ago', priority: 'low' },
    { id: 3, type: 'system', description: 'Payroll processed for 157 employees', time: '2 hours ago', priority: 'high' },
    { id: 4, type: 'holiday', description: 'New holiday added: Independence Day', time: '3 hours ago', priority: 'medium' },
    { id: 5, type: 'employee', description: '3 new employees onboarded', time: '1 day ago', priority: 'high' },
  ];

  const topPerformers = [
    { name: 'Sarah Johnson', department: 'Engineering', score: 98, trend: 'up' },
    { name: 'Michael Chen', department: 'Sales', score: 96, trend: 'up' },
    { name: 'Emily Davis', department: 'Marketing', score: 94, trend: 'stable' },
    { name: 'James Wilson', department: 'Finance', score: 92, trend: 'up' },
    { name: 'Lisa Anderson', department: 'HR', score: 91, trend: 'down' },
  ];

  const leaveAnalytics = [
    { month: 'Jan', approved: 23, rejected: 2, pending: 1 },
    { month: 'Feb', approved: 28, rejected: 1, pending: 3 },
    { month: 'Mar', approved: 31, rejected: 3, pending: 2 },
    { month: 'Apr', approved: 26, rejected: 1, pending: 4 },
  ];

  return (
    <DashboardLayout requiredRole="admin">
      <div className="space-y-6 animate-fade-in">
        {/* Welcome Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">Comprehensive overview of your organization's operations.</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-primary">{systemStats.totalEmployees}</p>
                  <p className="text-xs text-muted-foreground">Total Employees</p>
                </div>
                <Users className="h-6 w-6 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-success">{systemStats.activeToday}</p>
                  <p className="text-xs text-muted-foreground">Active Today</p>
                </div>
                <CheckCircle2 className="h-6 w-6 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-warning">{systemStats.onLeave}</p>
                  <p className="text-xs text-muted-foreground">On Leave</p>
                </div>
                <Calendar className="h-6 w-6 text-warning" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-destructive">{systemStats.pendingRequests}</p>
                  <p className="text-xs text-muted-foreground">Pending Requests</p>
                </div>
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-accent">{systemStats.averageWorkHours}h</p>
                  <p className="text-xs text-muted-foreground">Avg Work Hours</p>
                </div>
                <Clock className="h-6 w-6 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-primary">{systemStats.attendanceRate}%</p>
                  <p className="text-xs text-muted-foreground">Attendance Rate</p>
                </div>
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Department Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span>Department Performance</span>
              </CardTitle>
              <CardDescription>Overview of each department's metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {departmentStats.map((dept, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{dept.name}</p>
                        <p className="text-sm text-muted-foreground">{dept.employees} employees</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{dept.attendance}% attendance</p>
                        <p className="text-xs text-muted-foreground">{dept.workHours}h avg</p>
                      </div>
                    </div>
                    <Progress value={dept.attendance} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Performers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-primary" />
                <span>Top Performers</span>
              </CardTitle>
              <CardDescription>Employees with highest performance scores</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPerformers.map((performer, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">#{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium">{performer.name}</p>
                        <p className="text-sm text-muted-foreground">{performer.department}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="default">{performer.score}</Badge>
                      <TrendingUp 
                        className={`h-4 w-4 ${
                          performer.trend === 'up' ? 'text-success' : 
                          performer.trend === 'down' ? 'text-destructive' : 'text-muted-foreground'
                        }`} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Leave Analytics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <span>Leave Analytics</span>
            </CardTitle>
            <CardDescription>Monthly leave request trends and approvals</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Month</TableHead>
                  <TableHead>Approved</TableHead>
                  <TableHead>Rejected</TableHead>
                  <TableHead>Pending</TableHead>
                  <TableHead>Approval Rate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaveAnalytics.map((month) => {
                  const total = month.approved + month.rejected;
                  const approvalRate = total > 0 ? Math.round((month.approved / total) * 100) : 0;
                  
                  return (
                    <TableRow key={month.month}>
                      <TableCell className="font-medium">{month.month}</TableCell>
                      <TableCell>
                        <Badge variant="default" className="bg-success text-success-foreground">
                          {month.approved}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="destructive">{month.rejected}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{month.pending}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Progress value={approvalRate} className="h-2 w-16" />
                          <span className="text-sm">{approvalRate}%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Recent System Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent System Activities</CardTitle>
            <CardDescription>Latest updates and system events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-4 p-3 border rounded-lg">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.priority === 'high' ? 'bg-destructive' :
                    activity.priority === 'medium' ? 'bg-warning' : 'bg-success'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                  <Badge 
                    variant={
                      activity.priority === 'high' ? 'destructive' :
                      activity.priority === 'medium' ? 'default' : 'secondary'
                    }
                    className="text-xs"
                  >
                    {activity.priority}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>System Management</CardTitle>
            <CardDescription>Administrative tools and quick actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <Users className="h-6 w-6" />
                <span className="text-sm">Manage Users</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <Calendar className="h-6 w-6" />
                <span className="text-sm">Add Holiday</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <FileText className="h-6 w-6" />
                <span className="text-sm">Generate Reports</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <Settings className="h-6 w-6" />
                <span className="text-sm">System Settings</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}