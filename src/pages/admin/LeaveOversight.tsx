import { useState } from 'react';
import { Search, Filter, Users, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function LeaveOversight() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const employees = [
    { id: '1', name: 'John Smith', department: 'Engineering', status: 'working', leaveBalance: 8 },
    { id: '2', name: 'Emily Davis', department: 'Marketing', status: 'on-leave', leaveBalance: 15, leaveType: 'Annual', leaveDays: 5 },
    { id: '3', name: 'James Wilson', department: 'Sales', status: 'working', leaveBalance: 12 }
  ];

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || emp.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout requiredRole="admin">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Leave Oversight</h1>
        
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search employees..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="working">Working</SelectItem>
              <SelectItem value="on-leave">On Leave</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-4">
          {filteredEmployees.map((employee) => (
            <Card key={employee.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold">{employee.name}</h4>
                    <p className="text-sm text-muted-foreground">{employee.department}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={employee.status === 'working' ? 'default' : 'secondary'}>
                      {employee.status}
                    </Badge>
                    {employee.status === 'on-leave' && (
                      <Badge variant="outline">{employee.leaveType} - {employee.leaveDays} days</Badge>
                    )}
                    <span className="text-sm">Balance: {employee.leaveBalance} days</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}