import { useState } from 'react';
import { Plus, MessageSquare, Clock, CheckCircle2, AlertTriangle, User } from 'lucide-react';
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
  createdDate: string;
  updatedDate: string;
  hrResponse?: string;
}

export default function Tickets() {
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: '1',
      title: 'Computer screen flickering',
      description: 'My monitor keeps flickering during work. It\'s affecting my productivity.',
      category: 'technical',
      priority: 'medium',
      status: 'resolved',
      createdDate: '2024-01-05',
      updatedDate: '2024-01-07',
      hrResponse: 'Screen has been replaced. Please let us know if you face any more issues.'
    },
    {
      id: '2',
      title: 'Leave balance discrepancy',
      description: 'My leave balance shows incorrect numbers. Please verify my annual leave count.',
      category: 'hr',
      priority: 'low',
      status: 'in-progress',
      createdDate: '2024-01-08',
      updatedDate: '2024-01-08'
    }
  ]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'technical' as Ticket['category'],
    priority: 'medium' as Ticket['priority']
  });

  const handleCreateTicket = () => {
    if (!formData.title || !formData.description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const newTicket: Ticket = {
      id: Date.now().toString(),
      ...formData,
      status: 'open',
      createdDate: new Date().toISOString().split('T')[0],
      updatedDate: new Date().toISOString().split('T')[0]
    };

    setTickets([newTicket, ...tickets]);
    setFormData({ title: '', description: '', category: 'technical', priority: 'medium' });
    setIsCreateDialogOpen(false);
    
    toast({
      title: "Success",
      description: "Ticket created successfully"
    });
  };

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

  const ticketStats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    inProgress: tickets.filter(t => t.status === 'in-progress').length,
    resolved: tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length
  };

  return (
    <DashboardLayout requiredRole="employee">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Support Tickets</h1>
            <p className="text-muted-foreground">Raise issues and track their resolution status</p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Ticket
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create Support Ticket</DialogTitle>
                <DialogDescription>Describe your issue and we'll help resolve it</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Brief description of the issue"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Detailed description of the issue"
                    rows={4}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Category</Label>
                    <Select value={formData.category} onValueChange={(value: Ticket['category']) => setFormData({...formData, category: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technical">Technical</SelectItem>
                        <SelectItem value="hr">HR</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="facility">Facility</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Priority</Label>
                    <Select value={formData.priority} onValueChange={(value: Ticket['priority']) => setFormData({...formData, priority: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleCreateTicket}>Create Ticket</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Ticket Statistics */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-primary">{ticketStats.total}</p>
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
                  <p className="text-2xl font-bold text-destructive">{ticketStats.open}</p>
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
                  <p className="text-2xl font-bold text-warning">{ticketStats.inProgress}</p>
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
                  <p className="text-2xl font-bold text-success">{ticketStats.resolved}</p>
                  <p className="text-xs text-muted-foreground">Resolved</p>
                </div>
                <CheckCircle2 className="h-6 w-6 text-success" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tickets List */}
        <Card>
          <CardHeader>
            <CardTitle>Your Tickets</CardTitle>
            <CardDescription>Track the status of your support requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tickets.map((ticket) => (
                <div key={ticket.id} className="border rounded-lg p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold">{ticket.title}</h4>
                          <Badge className={getStatusColor(ticket.status)}>
                            {getStatusIcon(ticket.status)}
                            <span className="ml-1 capitalize">{ticket.status.replace('-', ' ')}</span>
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{getCategoryLabel(ticket.category)}</Badge>
                          <Badge className={getPriorityColor(ticket.priority)}>
                            {ticket.priority}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        <p>Created: {ticket.createdDate}</p>
                        <p>Updated: {ticket.updatedDate}</p>
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground">{ticket.description}</p>
                    
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
                </div>
              ))}
            </div>

            {tickets.length === 0 && (
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Tickets Found</h3>
                <p className="text-muted-foreground">You haven't created any support tickets yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}