import { useState } from 'react';
import { Plus, Calendar, Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/layout/DashboardLayout';

interface LeaveRequest {
  id: string;
  type: 'annual' | 'sick' | 'personal' | 'maternity' | 'emergency';
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedDate: string;
  hrComments?: string;
}

export default function LeaveRequests() {
  const { toast } = useToast();
  const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false);
  
  // Mock data for leave balance
  const leaveBalance = {
    annual: { total: 20, used: 12, remaining: 8 },
    sick: { total: 10, used: 3, remaining: 7 },
    personal: { total: 5, used: 2, remaining: 3 }
  };

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([
    {
      id: '1',
      type: 'annual',
      startDate: '2024-01-15',
      endDate: '2024-01-19',
      days: 5,
      reason: 'Family vacation',
      status: 'approved',
      appliedDate: '2024-01-01',
      hrComments: 'Approved for vacation. Enjoy your time off!'
    },
    {
      id: '2',
      type: 'sick',
      startDate: '2024-01-08',
      endDate: '2024-01-08',
      days: 1,
      reason: 'Medical appointment',
      status: 'pending',
      appliedDate: '2024-01-05'
    }
  ]);

  const [formData, setFormData] = useState({
    type: 'annual' as LeaveRequest['type'],
    startDate: '',
    endDate: '',
    reason: ''
  });

  const calculateDays = (start: string, end: string) => {
    if (!start || !end) return 0;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const handleApplyLeave = () => {
    if (!formData.startDate || !formData.endDate || !formData.reason) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const days = calculateDays(formData.startDate, formData.endDate);
    
    const newRequest: LeaveRequest = {
      id: Date.now().toString(),
      ...formData,
      days,
      status: 'pending',
      appliedDate: new Date().toISOString().split('T')[0]
    };

    setLeaveRequests([newRequest, ...leaveRequests]);
    setFormData({ type: 'annual', startDate: '', endDate: '', reason: '' });
    setIsApplyDialogOpen(false);
    
    toast({
      title: "Success",
      description: "Leave request submitted successfully"
    });
  };

  const getStatusIcon = (status: LeaveRequest['status']) => {
    switch (status) {
      case 'approved': return <CheckCircle2 className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: LeaveRequest['status']) => {
    switch (status) {
      case 'approved': return 'bg-success text-success-foreground';
      case 'rejected': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-warning text-warning-foreground';
    }
  };

  const getLeaveTypeLabel = (type: LeaveRequest['type']) => {
    switch (type) {
      case 'annual': return 'Annual Leave';
      case 'sick': return 'Sick Leave';
      case 'personal': return 'Personal Leave';
      case 'maternity': return 'Maternity Leave';
      case 'emergency': return 'Emergency Leave';
      default: return type;
    }
  };

  return (
    <DashboardLayout requiredRole="employee">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Leave Requests</h1>
            <p className="text-muted-foreground">Manage your leave applications and track your balance</p>
          </div>
          
          <Dialog open={isApplyDialogOpen} onOpenChange={setIsApplyDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Apply for Leave
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Apply for Leave</DialogTitle>
                <DialogDescription>Submit a new leave request</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Leave Type</Label>
                  <Select value={formData.type} onValueChange={(value: LeaveRequest['type']) => setFormData({...formData, type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="annual">Annual Leave</SelectItem>
                      <SelectItem value="sick">Sick Leave</SelectItem>
                      <SelectItem value="personal">Personal Leave</SelectItem>
                      <SelectItem value="maternity">Maternity Leave</SelectItem>
                      <SelectItem value="emergency">Emergency Leave</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Start Date *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">End Date *</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    />
                  </div>
                </div>
                {formData.startDate && formData.endDate && (
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm">
                      <strong>Total Days:</strong> {calculateDays(formData.startDate, formData.endDate)}
                    </p>
                  </div>
                )}
                <div>
                  <Label htmlFor="reason">Reason *</Label>
                  <Textarea
                    id="reason"
                    value={formData.reason}
                    onChange={(e) => setFormData({...formData, reason: e.target.value})}
                    placeholder="Please provide a reason for your leave request"
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsApplyDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleApplyLeave}>Submit Request</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Leave Balance Summary */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-primary">{leaveBalance.annual.remaining}</p>
                  <p className="text-xs text-muted-foreground">Annual Leave Remaining</p>
                </div>
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                Used: {leaveBalance.annual.used} / Total: {leaveBalance.annual.total}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-success">{leaveBalance.sick.remaining}</p>
                  <p className="text-xs text-muted-foreground">Sick Leave Remaining</p>
                </div>
                <AlertCircle className="h-6 w-6 text-success" />
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                Used: {leaveBalance.sick.used} / Total: {leaveBalance.sick.total}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-accent">{leaveBalance.personal.remaining}</p>
                  <p className="text-xs text-muted-foreground">Personal Leave Remaining</p>
                </div>
                <Clock className="h-6 w-6 text-accent" />
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                Used: {leaveBalance.personal.used} / Total: {leaveBalance.personal.total}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Current Leave Requests */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Current Leave Requests</CardTitle>
            <CardDescription>Your recent and pending leave applications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leaveRequests.filter(request => request.status === 'pending' || new Date(request.startDate) >= new Date()).map((request) => (
                <div key={request.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold">{getLeaveTypeLabel(request.type)}</h4>
                        <Badge className={getStatusColor(request.status)}>
                          {getStatusIcon(request.status)}
                          <span className="ml-1 capitalize">{request.status}</span>
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <p><strong>Duration:</strong> {request.startDate} to {request.endDate} ({request.days} days)</p>
                        <p><strong>Applied on:</strong> {request.appliedDate}</p>
                        <p><strong>Reason:</strong> {request.reason}</p>
                        {request.hrComments && (
                          <p><strong>HR Comments:</strong> {request.hrComments}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {leaveRequests.filter(request => request.status === 'pending' || new Date(request.startDate) >= new Date()).length === 0 && (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Current Leave Requests</h3>
                  <p className="text-muted-foreground">You have no pending or upcoming leave requests</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Past Leave Requests */}
        <Card>
          <CardHeader>
            <CardTitle>Past Leave Requests</CardTitle>
            <CardDescription>Your leave history and completed applications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leaveRequests.filter(request => request.status !== 'pending' && new Date(request.endDate) < new Date()).map((request) => (
                <div key={request.id} className="border rounded-lg p-4 bg-muted/30">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold text-muted-foreground">{getLeaveTypeLabel(request.type)}</h4>
                        <Badge className={getStatusColor(request.status)}>
                          {getStatusIcon(request.status)}
                          <span className="ml-1 capitalize">{request.status}</span>
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <p><strong>Duration:</strong> {request.startDate} to {request.endDate} ({request.days} days)</p>
                        <p><strong>Applied on:</strong> {request.appliedDate}</p>
                        <p><strong>Reason:</strong> {request.reason}</p>
                        {request.hrComments && (
                          <p><strong>HR Comments:</strong> {request.hrComments}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {leaveRequests.filter(request => request.status !== 'pending' && new Date(request.endDate) < new Date()).length === 0 && (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Past Leave Requests</h3>
                  <p className="text-muted-foreground">Your past leave requests will appear here</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}