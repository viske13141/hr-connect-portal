import { useState } from 'react';
import { Plus, Check, X, Calendar, Clock, User, Search, Filter } from 'lucide-react';
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
  employeeName: string;
  employeeId: string;
  department: string;
  teamLead: string;
  type: 'annual' | 'sick' | 'personal' | 'maternity' | 'emergency';
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedDate: string;
  hrComments?: string;
}

export default function LeaveApprovals() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false);
  const [hrComments, setHrComments] = useState('');

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([
    {
      id: '1',
      employeeName: 'John Smith',
      employeeId: 'EMP001',
      department: 'Engineering',
      teamLead: 'Sarah Johnson',
      type: 'annual',
      startDate: '2024-01-15',
      endDate: '2024-01-19',
      days: 5,
      reason: 'Family vacation planned months ago',
      status: 'pending',
      appliedDate: '2024-01-01'
    },
    {
      id: '2',
      employeeName: 'Emily Davis',
      employeeId: 'EMP002',
      department: 'Marketing',
      teamLead: 'Michael Chen',
      type: 'sick',
      startDate: '2024-01-08',
      endDate: '2024-01-10',
      days: 3,
      reason: 'Medical treatment required',
      status: 'approved',
      appliedDate: '2024-01-05',
      hrComments: 'Approved due to medical emergency'
    },
    {
      id: '3',
      employeeName: 'James Wilson',
      employeeId: 'EMP003',
      department: 'Sales',
      teamLead: 'Lisa Anderson',
      type: 'personal',
      startDate: '2024-01-20',
      endDate: '2024-01-22',
      days: 3,
      reason: 'Personal family matter',
      status: 'rejected',
      appliedDate: '2024-01-10',
      hrComments: 'Peak sales period, please reschedule'
    }
  ]);

  const [formData, setFormData] = useState({
    type: 'annual' as LeaveRequest['type'],
    startDate: '',
    endDate: '',
    reason: ''
  });

  const handleApproveRequest = () => {
    if (!selectedRequest) return;
    
    setLeaveRequests(prev => prev.map(req => 
      req.id === selectedRequest.id 
        ? { ...req, status: 'approved', hrComments }
        : req
    ));
    
    toast({
      title: "Leave Approved",
      description: `Leave request for ${selectedRequest.employeeName} has been approved`
    });
    
    setSelectedRequest(null);
    setHrComments('');
  };

  const handleRejectRequest = () => {
    if (!selectedRequest) return;
    
    setLeaveRequests(prev => prev.map(req => 
      req.id === selectedRequest.id 
        ? { ...req, status: 'rejected', hrComments }
        : req
    ));
    
    toast({
      title: "Leave Rejected",
      description: `Leave request for ${selectedRequest.employeeName} has been rejected`
    });
    
    setSelectedRequest(null);
    setHrComments('');
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

    const days = Math.ceil((new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    const newRequest: LeaveRequest = {
      id: Date.now().toString(),
      employeeName: 'HR Manager', // Current user
      employeeId: 'HR001',
      department: 'HR',
      teamLead: 'Admin',
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

  const filteredRequests = leaveRequests.filter(request => {
    const matchesSearch = request.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || request.status === filterStatus;
    const matchesDepartment = filterDepartment === 'all' || request.department === filterDepartment;
    
    return matchesSearch && matchesStatus && matchesDepartment;
  });

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

  const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance'];
  const stats = {
    total: leaveRequests.length,
    pending: leaveRequests.filter(r => r.status === 'pending').length,
    approved: leaveRequests.filter(r => r.status === 'approved').length,
    rejected: leaveRequests.filter(r => r.status === 'rejected').length
  };

  return (
    <DashboardLayout requiredRole="hr">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Leave Approvals</h1>
            <p className="text-muted-foreground">Review and manage employee leave requests</p>
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
                <DialogDescription>Submit your own leave request</DialogDescription>
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

        {/* Statistics */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-primary">{stats.total}</p>
                  <p className="text-xs text-muted-foreground">Total Requests</p>
                </div>
                <Calendar className="h-6 w-6 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-warning">{stats.pending}</p>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </div>
                <Clock className="h-6 w-6 text-warning" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-success">{stats.approved}</p>
                  <p className="text-xs text-muted-foreground">Approved</p>
                </div>
                <Check className="h-6 w-6 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-destructive">{stats.rejected}</p>
                  <p className="text-xs text-muted-foreground">Rejected</p>
                </div>
                <X className="h-6 w-6 text-destructive" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by employee name or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Leave Requests */}
        <Card>
          <CardHeader>
            <CardTitle>Leave Requests</CardTitle>
            <CardDescription>Review and approve employee leave applications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredRequests.map((request) => (
                <div key={request.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold">{request.employeeName}</h4>
                        <Badge variant="outline">{request.employeeId}</Badge>
                        <Badge className={getStatusColor(request.status)}>
                          {request.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Department: </span>
                          <span className="font-medium">{request.department}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Team Lead: </span>
                          <span className="font-medium">{request.teamLead}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Leave Type: </span>
                          <span className="font-medium">{getLeaveTypeLabel(request.type)}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Duration: </span>
                          <span className="font-medium">{request.days} days</span>
                        </div>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Dates: </span>
                        <span className="font-medium">{request.startDate} to {request.endDate}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Reason: </span>
                        <span>{request.reason}</span>
                      </div>
                      {request.hrComments && (
                        <div className="text-sm bg-muted/50 rounded p-2">
                          <span className="text-muted-foreground">HR Comments: </span>
                          <span>{request.hrComments}</span>
                        </div>
                      )}
                    </div>
                    
                    {request.status === 'pending' && (
                      <div className="flex space-x-2 ml-4">
                        <Dialog open={selectedRequest?.id === request.id} onOpenChange={(open) => {
                          if (open) {
                            setSelectedRequest(request);
                            setHrComments('');
                          } else {
                            setSelectedRequest(null);
                            setHrComments('');
                          }
                        }}>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <User className="h-4 w-4 mr-2" />
                              Review
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Review Leave Request</DialogTitle>
                              <DialogDescription>
                                {request.employeeName} - {getLeaveTypeLabel(request.type)}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div><strong>Employee:</strong> {request.employeeName}</div>
                                <div><strong>ID:</strong> {request.employeeId}</div>
                                <div><strong>Department:</strong> {request.department}</div>
                                <div><strong>Team Lead:</strong> {request.teamLead}</div>
                                <div><strong>Duration:</strong> {request.days} days</div>
                                <div><strong>Applied on:</strong> {request.appliedDate}</div>
                              </div>
                              <div>
                                <strong>Dates:</strong> {request.startDate} to {request.endDate}
                              </div>
                              <div>
                                <strong>Reason:</strong> {request.reason}
                              </div>
                              <div>
                                <Label htmlFor="hrComments">HR Comments</Label>
                                <Textarea
                                  id="hrComments"
                                  value={hrComments}
                                  onChange={(e) => setHrComments(e.target.value)}
                                  placeholder="Add comments for the employee..."
                                  rows={3}
                                />
                              </div>
                            </div>
                            <DialogFooter className="space-x-2">
                              <Button variant="outline" onClick={() => setSelectedRequest(null)}>Cancel</Button>
                              <Button variant="destructive" onClick={handleRejectRequest}>
                                <X className="h-4 w-4 mr-2" />
                                Reject
                              </Button>
                              <Button onClick={handleApproveRequest}>
                                <Check className="h-4 w-4 mr-2" />
                                Approve
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    )}
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