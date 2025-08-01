import { useState, useEffect } from 'react';
import { Clock, Play, Square, Users, FileText, CheckCircle2, XCircle, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useToast } from '@/hooks/use-toast';

export default function HRDashboard() {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [workTime, setWorkTime] = useState(0);
  const [checkInTime, setCheckInTime] = useState<Date | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const storedCheckIn = localStorage.getItem('ems_hr_checkin');
    if (storedCheckIn) {
      const checkIn = JSON.parse(storedCheckIn);
      setIsCheckedIn(true);
      setCheckInTime(new Date(checkIn.time));
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isCheckedIn && checkInTime) {
      interval = setInterval(() => {
        const now = Date.now();
        const elapsed = Math.floor((now - checkInTime.getTime()) / 1000);
        setWorkTime(elapsed);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isCheckedIn, checkInTime]);

  const handleCheckIn = () => {
    const now = new Date();
    setIsCheckedIn(true);
    setCheckInTime(now);
    setWorkTime(0);
    
    localStorage.setItem('ems_hr_checkin', JSON.stringify({ time: now.toISOString() }));
    
    toast({
      title: "Checked In Successfully!",
      description: `Welcome back! Started work at ${now.toLocaleTimeString()}`,
    });
  };

  const handleCheckOut = () => {
    if (checkInTime) {
      const duration = Math.floor((Date.now() - checkInTime.getTime()) / 1000);
      const hours = Math.floor(duration / 3600);
      const minutes = Math.floor((duration % 3600) / 60);
      
      toast({
        title: "Checked Out Successfully!",
        description: `Total work time: ${hours}h ${minutes}m`,
      });
    }
    
    setIsCheckedIn(false);
    setCheckInTime(null);
    setWorkTime(0);
    localStorage.removeItem('ems_hr_checkin');
  };

  const formatWorkTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleLeaveAction = (leaveId: number, action: 'approve' | 'reject') => {
    toast({
      title: `Leave Request ${action === 'approve' ? 'Approved' : 'Rejected'}`,
      description: `Successfully ${action}d the leave request.`,
      variant: action === 'approve' ? 'default' : 'destructive',
    });
  };

  // Mock data
  const pendingLeaveRequests = [
    {
      id: 1,
      employee: 'John Smith',
      type: 'Vacation',
      startDate: '2024-02-15',
      endDate: '2024-02-16',
      days: 2,
      reason: 'Family vacation',
      appliedOn: '2024-02-01'
    },
    {
      id: 2,
      employee: 'Alice Johnson',
      type: 'Sick Leave',
      startDate: '2024-02-12',
      endDate: '2024-02-12',
      days: 1,
      reason: 'Medical appointment',
      appliedOn: '2024-02-10'
    },
    {
      id: 3,
      employee: 'Bob Wilson',
      type: 'Personal',
      startDate: '2024-02-20',
      endDate: '2024-02-21',
      days: 2,
      reason: 'Personal matters',
      appliedOn: '2024-02-05'
    }
  ];

  const teamOverview = [
    { name: 'John Smith', status: 'checked-in', checkInTime: '09:00 AM', workHours: '7.5h' },
    { name: 'Alice Johnson', status: 'checked-out', checkInTime: '08:30 AM', workHours: '8.0h' },
    { name: 'Bob Wilson', status: 'on-leave', checkInTime: '-', workHours: '-' },
    { name: 'Carol Davis', status: 'checked-in', checkInTime: '09:15 AM', workHours: '7.2h' },
  ];

  const recentTickets = [
    { id: 1, employee: 'John Smith', subject: 'Internet connection issues', priority: 'high', status: 'open' },
    { id: 2, employee: 'Alice Johnson', subject: 'Request for new laptop', priority: 'medium', status: 'in-progress' },
    { id: 3, employee: 'Bob Wilson', subject: 'Access to project files', priority: 'low', status: 'resolved' },
  ];

  return (
    <DashboardLayout requiredRole="hr">
      <div className="space-y-6 animate-fade-in">
        {/* Welcome Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">HR Dashboard</h1>
          <p className="text-muted-foreground">Manage your team and handle HR operations.</p>
        </div>

        {/* Check In/Out Section */}
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-primary" />
              <span>Time Tracking</span>
            </CardTitle>
            <CardDescription>Track your work hours for today</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Current Status</p>
                <div className="flex items-center space-x-2">
                  <Badge variant={isCheckedIn ? "default" : "secondary"}>
                    {isCheckedIn ? "Checked In" : "Checked Out"}
                  </Badge>
                  {isCheckedIn && checkInTime && (
                    <span className="text-sm text-muted-foreground">
                      since {checkInTime.toLocaleTimeString()}
                    </span>
                  )}
                </div>
              </div>
              
              {isCheckedIn ? (
                <Button 
                  onClick={handleCheckOut}
                  variant="destructive"
                  className="flex items-center space-x-2"
                >
                  <Square className="h-4 w-4" />
                  <span>Check Out</span>
                </Button>
              ) : (
                <Button 
                  onClick={handleCheckIn}
                  className="bg-gradient-primary hover:shadow-glow transition-all duration-300 flex items-center space-x-2"
                >
                  <Play className="h-4 w-4" />
                  <span>Check In</span>
                </Button>
              )}
            </div>
            
            {isCheckedIn && (
              <div className="text-center py-4">
                <div className="text-3xl font-mono font-bold text-primary">
                  {formatWorkTime(workTime)}
                </div>
                <p className="text-sm text-muted-foreground">Hours worked today</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Overview Cards */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-primary">12</p>
                  <p className="text-sm text-muted-foreground">Total Employees</p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-success">3</p>
                  <p className="text-sm text-muted-foreground">Pending Leaves</p>
                </div>
                <FileText className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-warning">2</p>
                  <p className="text-sm text-muted-foreground">Open Tickets</p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-accent">85%</p>
                  <p className="text-sm text-muted-foreground">Attendance Rate</p>
                </div>
                <Clock className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Pending Leave Requests */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-primary" />
                <span>Pending Leave Requests</span>
              </CardTitle>
              <CardDescription>Review and approve employee leave requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingLeaveRequests.map((request) => (
                  <div key={request.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{request.employee}</p>
                        <p className="text-sm text-muted-foreground">{request.type}</p>
                      </div>
                      <Badge variant="outline">{request.days} days</Badge>
                    </div>
                    
                    <div className="text-sm">
                      <p><span className="font-medium">Period:</span> {request.startDate} to {request.endDate}</p>
                      <p><span className="font-medium">Reason:</span> {request.reason}</p>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        className="bg-success hover:bg-success/90"
                        onClick={() => handleLeaveAction(request.id, 'approve')}
                      >
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleLeaveAction(request.id, 'reject')}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Team Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-primary" />
                <span>Team Overview</span>
              </CardTitle>
              <CardDescription>Current status of your team members</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Hours</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamOverview.map((member, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{member.name}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            member.status === 'checked-in' ? 'default' : 
                            member.status === 'checked-out' ? 'secondary' : 'destructive'
                          }
                        >
                          {member.status.replace('-', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>{member.workHours}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Recent Tickets */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Support Tickets</CardTitle>
            <CardDescription>Employee support requests and issues</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell className="font-medium">{ticket.employee}</TableCell>
                    <TableCell>{ticket.subject}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          ticket.priority === 'high' ? 'destructive' : 
                          ticket.priority === 'medium' ? 'default' : 'secondary'
                        }
                      >
                        {ticket.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{ticket.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline">View</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used HR operations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <Upload className="h-6 w-6" />
                <span className="text-sm">Upload Payslip</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <FileText className="h-6 w-6" />
                <span className="text-sm">Leave Reports</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <Users className="h-6 w-6" />
                <span className="text-sm">Team Calendar</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <CheckCircle2 className="h-6 w-6" />
                <span className="text-sm">Attendance</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}