import { useState, useEffect } from 'react';
import { Clock, Play, Square, CheckCircle2, Calendar, FileText, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useToast } from '@/hooks/use-toast';

export default function EmployeeDashboard() {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [workTime, setWorkTime] = useState(0);
  const [checkInTime, setCheckInTime] = useState<Date | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check if already checked in from localStorage
    const storedCheckIn = localStorage.getItem('ems_checkin');
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
    
    localStorage.setItem('ems_checkin', JSON.stringify({ time: now.toISOString() }));
    
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
    localStorage.removeItem('ems_checkin');
  };

  const formatWorkTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Mock data
  const todayTasks = [
    { id: 1, title: 'Review quarterly reports', status: 'completed', priority: 'high' },
    { id: 2, title: 'Team standup meeting', status: 'completed', priority: 'medium' },
    { id: 3, title: 'Update project documentation', status: 'in-progress', priority: 'medium' },
    { id: 4, title: 'Code review for feature X', status: 'pending', priority: 'high' },
  ];

  const upcomingHolidays = [
    { date: '2024-02-14', name: "Valentine's Day", type: 'company' },
    { date: '2024-02-19', name: 'Presidents Day', type: 'national' },
    { date: '2024-03-17', name: "St. Patrick's Day", type: 'company' },
  ];

  const recentNotifications = [
    { id: 1, type: 'leave', message: 'Your leave request for March 15-16 has been approved', time: '2 hours ago' },
    { id: 2, type: 'task', message: 'New task assigned: Prepare monthly report', time: '4 hours ago' },
    { id: 3, type: 'system', message: 'Payslip for January 2024 is now available', time: '1 day ago' },
  ];

  return (
    <DashboardLayout requiredRole="employee">
      <div className="space-y-6 animate-fade-in">
        {/* Welcome Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Good morning, John!</h1>
          <p className="text-muted-foreground">Here's what's happening in your workspace today.</p>
        </div>

        {/* Check In/Out Section */}
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-primary" />
              <span>Time Tracking</span>
            </CardTitle>
            <CardDescription>
              Track your work hours for today
            </CardDescription>
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

        <div className="grid md:grid-cols-2 gap-6">
          {/* Today's Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span>Today's Tasks</span>
              </CardTitle>
              <CardDescription>Your tasks for today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {todayTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{task.title}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge 
                          variant={
                            task.status === 'completed' ? 'default' : 
                            task.status === 'in-progress' ? 'secondary' : 'outline'
                          }
                          className="text-xs"
                        >
                          {task.status}
                        </Badge>
                        <Badge 
                          variant={task.priority === 'high' ? 'destructive' : 'secondary'}
                          className="text-xs"
                        >
                          {task.priority}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                View All Tasks
              </Button>
            </CardContent>
          </Card>

          {/* Upcoming Holidays */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span>Upcoming Holidays</span>
              </CardTitle>
              <CardDescription>Company and national holidays</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingHolidays.map((holiday, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{holiday.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(holiday.date).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant={holiday.type === 'national' ? 'default' : 'secondary'}>
                      {holiday.type}
                    </Badge>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                View All Holidays
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <FileText className="h-6 w-6" />
                <span className="text-sm">Apply Leave</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <AlertCircle className="h-6 w-6" />
                <span className="text-sm">Raise Ticket</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <CheckCircle2 className="h-6 w-6" />
                <span className="text-sm">Add Task</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <Calendar className="h-6 w-6" />
                <span className="text-sm">View Calendar</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Notifications</CardTitle>
            <CardDescription>Stay updated with recent activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentNotifications.map((notification) => (
                <div key={notification.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="text-sm">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}