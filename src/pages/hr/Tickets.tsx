import { useState } from 'react';
import { MessageSquare, User, Clock, CheckCircle2, AlertTriangle, Send, Search } from 'lucide-react';
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

interface Ticket {
  id: string;
  title: string;
  description: string;
  category: 'technical' | 'hr' | 'admin' | 'facility';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  employeeName: string;
  employeeId: string;
  department: string;
  createdDate: string;
  updatedDate: string;
  hrResponse?: string;
}

export default function HRTickets() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [hrResponse, setHrResponse] = useState('');

  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: '1',
      title: 'Computer screen flickering',
      description: 'My monitor keeps flickering during work. It\'s affecting my productivity and causing eye strain.',
      category: 'technical',
      priority: 'medium',
      status: 'in-progress',
      employeeName: 'John Smith',
      employeeId: 'EMP001',
      department: 'Engineering',
      createdDate: '2024-01-05',
      updatedDate: '2024-01-06',
      hrResponse: 'We have ordered a replacement monitor. It should arrive by Monday.'
    },
    {
      id: '2',
      title: 'Leave balance discrepancy',
      description: 'My leave balance shows incorrect numbers. Please verify my annual leave count.',
      category: 'hr',
      priority: 'low',
      status: 'open',
      employeeName: 'Emily Davis',
      employeeId: 'EMP002',
      department: 'Marketing',
      createdDate: '2024-01-08',
      updatedDate: '2024-01-08'
    },
    {
      id: '3',
      title: 'Access card not working',
      description: 'My access card is not working for the main building entrance and parking garage.',
      category: 'facility',
      priority: 'high',
      status: 'open',
      employeeName: 'James Wilson',
      employeeId: 'EMP003',
      department: 'Sales',
      createdDate: '2024-01-09',
      updatedDate: '2024-01-09'
    },
    {
      id: '4',
      title: 'Payroll inquiry',
      description: 'There seems to be a discrepancy in my last payslip. The overtime hours are not calculated correctly.',
      category: 'hr',
      priority: 'medium',
      status: 'resolved',
      employeeName: 'Sarah Johnson',
      employeeId: 'EMP004',
      department: 'Engineering',
      createdDate: '2024-01-03',
      updatedDate: '2024-01-07',
      hrResponse: 'The payroll has been corrected and the difference will be added to your next salary.'
    }
  ]);

  const handleUpdateTicket = (ticketId: string, newStatus: Ticket['status'], response?: string) => {
    setTickets(prev => prev.map(ticket => 
      ticket.id === ticketId 
        ? { 
            ...ticket, 
            status: newStatus, 
            updatedDate: new Date().toISOString().split('T')[0],
            ...(response && { hrResponse: response })
          }
        : ticket
    ));
    
    const ticket = tickets.find(t => t.id === ticketId);
    toast({
      title: "Ticket Updated",
      description: `Ticket from ${ticket?.employeeName} has been updated`
    });
  };

  const handleRespondToTicket = () => {
    if (!selectedTicket || !hrResponse) {
      toast({
        title: "Error",
        description: "Please enter a response",
        variant: "destructive"
      });
      return;
    }

    handleUpdateTicket(selectedTicket.id, 'in-progress', hrResponse);
    setSelectedTicket(null);
    setHrResponse('');
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || ticket.category === filterCategory;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusIcon = (status: Ticket['status']) => {
    switch (status) {
      case 'resolved':
      case 'closed': return <CheckCircle2 className="h-4 w-4" />;
      case 'in-progress': return <Clock className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: Ticket['status']) => {
    switch (status) {
      case 'resolved':
      case 'closed': return 'bg-success text-success-foreground';
      case 'in-progress': return 'bg-warning text-warning-foreground';
      default: return 'bg-destructive text-destructive-foreground';
    }
  };

  const getPriorityColor = (priority: Ticket['priority']) => {
    switch (priority) {
      case 'urgent': return 'bg-destructive text-destructive-foreground';
      case 'high': return 'bg-warning text-warning-foreground';
      case 'medium': return 'bg-primary text-primary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getCategoryLabel = (category: Ticket['category']) => {
    switch (category) {
      case 'technical': return 'Technical';
      case 'hr': return 'HR';
      case 'admin': return 'Admin';
      case 'facility': return 'Facility';
      default: return category;
    }
  };

  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    inProgress: tickets.filter(t => t.status === 'in-progress').length,
    resolved: tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length
  };

  return (
    <DashboardLayout requiredRole="hr">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Employee Tickets</h1>
          <p className="text-muted-foreground">Manage and respond to employee support requests</p>
        </div>

        {/* Statistics */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-primary">{stats.total}</p>
                  <p className="text-xs text-muted-foreground">Total Tickets</p>
                </div>
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-destructive">{stats.open}</p>
                  <p className="text-xs text-muted-foreground">Open</p>
                </div>
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-warning">{stats.inProgress}</p>
                  <p className="text-xs text-muted-foreground">In Progress</p>
                </div>
                <Clock className="h-6 w-6 text-warning" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-success">{stats.resolved}</p>
                  <p className="text-xs text-muted-foreground">Resolved</p>
                </div>
                <CheckCircle2 className="h-6 w-6 text-success" />
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
                    placeholder="Search tickets..."
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
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="hr">HR</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="facility">Facility</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tickets List */}
        <Card>
          <CardHeader>
            <CardTitle>Support Tickets</CardTitle>
            <CardDescription>Employee support requests requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredTickets.map((ticket) => (
                <div key={ticket.id} className="border rounded-lg p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold">{ticket.title}</h4>
                          <Badge className={getStatusColor(ticket.status)}>
                            {getStatusIcon(ticket.status)}
                            <span className="ml-1 capitalize">{ticket.status.replace('-', ' ')}</span>
                          </Badge>
                          <Badge variant="outline">{getCategoryLabel(ticket.category)}</Badge>
                          <Badge className={getPriorityColor(ticket.priority)}>
                            {ticket.priority}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Employee: </span>
                            <span className="font-medium">{ticket.employeeName}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">ID: </span>
                            <span className="font-medium">{ticket.employeeId}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Department: </span>
                            <span className="font-medium">{ticket.department}</span>
                          </div>
                        </div>
                        
                        <p className="text-muted-foreground">{ticket.description}</p>
                        
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>Created: {ticket.createdDate}</span>
                          <span>Updated: {ticket.updatedDate}</span>
                        </div>
                        
                        {ticket.hrResponse && (
                          <div className="bg-muted/50 rounded-lg p-3">
                            <div className="flex items-center space-x-2 mb-2">
                              <User className="h-4 w-4 text-primary" />
                              <span className="text-sm font-medium text-primary">HR Response:</span>
                            </div>
                            <p className="text-sm">{ticket.hrResponse}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex space-x-2 ml-4">
                        {(ticket.status === 'open' || ticket.status === 'in-progress') && (
                          <Dialog open={selectedTicket?.id === ticket.id} onOpenChange={(open) => {
                            if (open) {
                              setSelectedTicket(ticket);
                              setHrResponse(ticket.hrResponse || '');
                            } else {
                              setSelectedTicket(null);
                              setHrResponse('');
                            }
                          }}>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Send className="h-4 w-4 mr-2" />
                                Respond
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[600px]">
                              <DialogHeader>
                                <DialogTitle>Respond to Ticket</DialogTitle>
                                <DialogDescription>
                                  {ticket.employeeName} - {ticket.title}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="bg-muted/50 rounded-lg p-3">
                                  <h4 className="font-medium mb-2">Employee Query:</h4>
                                  <p className="text-sm">{ticket.description}</p>
                                </div>
                                <div>
                                  <Label htmlFor="hrResponse">Your Response</Label>
                                  <Textarea
                                    id="hrResponse"
                                    value={hrResponse}
                                    onChange={(e) => setHrResponse(e.target.value)}
                                    placeholder="Type your response to the employee..."
                                    rows={4}
                                  />
                                </div>
                              </div>
                              <DialogFooter className="space-x-2">
                                <Button variant="outline" onClick={() => setSelectedTicket(null)}>Cancel</Button>
                                <Button 
                                  variant="outline" 
                                  onClick={() => handleUpdateTicket(ticket.id, 'resolved', hrResponse)}
                                >
                                  <CheckCircle2 className="h-4 w-4 mr-2" />
                                  Mark Resolved
                                </Button>
                                <Button onClick={handleRespondToTicket}>
                                  <Send className="h-4 w-4 mr-2" />
                                  Send Response
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        )}
                        
                        {ticket.status !== 'resolved' && ticket.status !== 'closed' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleUpdateTicket(ticket.id, 'resolved')}
                          >
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Resolve
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredTickets.length === 0 && (
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Tickets Found</h3>
                <p className="text-muted-foreground">No tickets match your current filters</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}