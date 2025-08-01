import { useState } from 'react';
import { Plus, Upload, Download, FileText, User, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/layout/DashboardLayout';

interface Employee {
  id: string;
  name: string;
  employeeId: string;
  department: string;
  email: string;
}

interface Payslip {
  id: string;
  employeeId: string;
  employeeName: string;
  month: string;
  year: number;
  grossSalary: number;
  deductions: number;
  netSalary: number;
  uploadedDate: string;
  fileName: string;
  status: 'uploaded' | 'sent';
}

export default function PayslipUpload() {
  const { toast } = useToast();
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('2024');

  // Mock employees data
  const employees: Employee[] = [
    { id: '1', name: 'John Smith', employeeId: 'EMP001', department: 'Engineering', email: 'john@company.com' },
    { id: '2', name: 'Emily Davis', employeeId: 'EMP002', department: 'Marketing', email: 'emily@company.com' },
    { id: '3', name: 'James Wilson', employeeId: 'EMP003', department: 'Sales', email: 'james@company.com' },
    { id: '4', name: 'Sarah Johnson', employeeId: 'EMP004', department: 'Engineering', email: 'sarah@company.com' },
    { id: '5', name: 'Michael Chen', employeeId: 'EMP005', department: 'Finance', email: 'michael@company.com' }
  ];

  const [payslips, setPayslips] = useState<Payslip[]>([
    {
      id: '1',
      employeeId: 'EMP001',
      employeeName: 'John Smith',
      month: 'January',
      year: 2024,
      grossSalary: 50000,
      deductions: 8000,
      netSalary: 42000,
      uploadedDate: '2024-02-01',
      fileName: 'john_smith_jan_2024.pdf',
      status: 'sent'
    },
    {
      id: '2',
      employeeId: 'EMP002',
      employeeName: 'Emily Davis',
      month: 'January',
      year: 2024,
      grossSalary: 45000,
      deductions: 7500,
      netSalary: 37500,
      uploadedDate: '2024-02-01',
      fileName: 'emily_davis_jan_2024.pdf',
      status: 'uploaded'
    }
  ]);

  const [formData, setFormData] = useState({
    employeeId: '',
    month: '',
    year: '2024',
    grossSalary: '',
    deductions: '',
    file: null as File | null
  });

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData({ ...formData, file });
    }
  };

  const handleUploadPayslip = () => {
    if (!formData.employeeId || !formData.month || !formData.grossSalary || !formData.deductions || !formData.file) {
      toast({
        title: "Error",
        description: "Please fill in all required fields and select a file",
        variant: "destructive"
      });
      return;
    }

    const employee = employees.find(emp => emp.id === formData.employeeId);
    if (!employee) return;

    const grossSalary = parseFloat(formData.grossSalary);
    const deductions = parseFloat(formData.deductions);
    const netSalary = grossSalary - deductions;

    const newPayslip: Payslip = {
      id: Date.now().toString(),
      employeeId: employee.employeeId,
      employeeName: employee.name,
      month: formData.month,
      year: parseInt(formData.year),
      grossSalary,
      deductions,
      netSalary,
      uploadedDate: new Date().toISOString().split('T')[0],
      fileName: formData.file.name,
      status: 'uploaded'
    };

    setPayslips([newPayslip, ...payslips]);
    setFormData({ employeeId: '', month: '', year: '2024', grossSalary: '', deductions: '', file: null });
    setIsUploadDialogOpen(false);
    
    toast({
      title: "Success",
      description: `Payslip uploaded for ${employee.name}`
    });
  };

  const handleSendPayslip = (payslipId: string) => {
    setPayslips(prev => prev.map(payslip => 
      payslip.id === payslipId 
        ? { ...payslip, status: 'sent' }
        : payslip
    ));
    
    const payslip = payslips.find(p => p.id === payslipId);
    toast({
      title: "Payslip Sent",
      description: `Payslip sent to ${payslip?.employeeName} via email`
    });
  };

  const filteredPayslips = payslips.filter(payslip => {
    const matchesSearch = payslip.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payslip.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEmployee = !selectedEmployee || payslip.employeeId === selectedEmployee;
    const matchesMonth = !selectedMonth || payslip.month === selectedMonth;
    const matchesYear = payslip.year.toString() === selectedYear;
    
    return matchesSearch && matchesEmployee && matchesMonth && matchesYear;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const stats = {
    total: payslips.length,
    uploaded: payslips.filter(p => p.status === 'uploaded').length,
    sent: payslips.filter(p => p.status === 'sent').length,
    totalAmount: payslips.reduce((sum, p) => sum + p.netSalary, 0)
  };

  return (
    <DashboardLayout requiredRole="hr">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Payslip Management</h1>
            <p className="text-muted-foreground">Upload and manage employee payslips</p>
          </div>
          
          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Upload Payslip
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Upload Employee Payslip</DialogTitle>
                <DialogDescription>Upload payslip for a specific employee and month</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Employee</Label>
                  <Select value={formData.employeeId} onValueChange={(value) => setFormData({...formData, employeeId: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select employee" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map(employee => (
                        <SelectItem key={employee.id} value={employee.id}>
                          {employee.name} ({employee.employeeId})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Month</Label>
                    <Select value={formData.month} onValueChange={(value) => setFormData({...formData, month: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select month" />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map(month => (
                          <SelectItem key={month} value={month}>{month}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Year</Label>
                    <Select value={formData.year} onValueChange={(value) => setFormData({...formData, year: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2024">2024</SelectItem>
                        <SelectItem value="2023">2023</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="grossSalary">Gross Salary (₹)</Label>
                    <Input
                      id="grossSalary"
                      type="number"
                      value={formData.grossSalary}
                      onChange={(e) => setFormData({...formData, grossSalary: e.target.value})}
                      placeholder="50000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="deductions">Deductions (₹)</Label>
                    <Input
                      id="deductions"
                      type="number"
                      value={formData.deductions}
                      onChange={(e) => setFormData({...formData, deductions: e.target.value})}
                      placeholder="8000"
                    />
                  </div>
                </div>
                {formData.grossSalary && formData.deductions && (
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm">
                      <strong>Net Salary:</strong> ₹{(parseFloat(formData.grossSalary) - parseFloat(formData.deductions)).toLocaleString()}
                    </p>
                  </div>
                )}
                <div>
                  <Label htmlFor="file">Payslip File (PDF)</Label>
                  <Input
                    id="file"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    className="cursor-pointer"
                  />
                  {formData.file && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Selected: {formData.file.name}
                    </p>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleUploadPayslip}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Payslip
                </Button>
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
                  <p className="text-xs text-muted-foreground">Total Payslips</p>
                </div>
                <FileText className="h-6 w-6 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-warning">{stats.uploaded}</p>
                  <p className="text-xs text-muted-foreground">Uploaded</p>
                </div>
                <Upload className="h-6 w-6 text-warning" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-success">{stats.sent}</p>
                  <p className="text-xs text-muted-foreground">Sent</p>
                </div>
                <User className="h-6 w-6 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold text-accent">{formatCurrency(stats.totalAmount)}</p>
                  <p className="text-xs text-muted-foreground">Total Amount</p>
                </div>
                <FileText className="h-6 w-6 text-accent" />
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
              <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Employees" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Employees</SelectItem>
                  {employees.map(employee => (
                    <SelectItem key={employee.id} value={employee.employeeId}>
                      {employee.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Months" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Months</SelectItem>
                  {months.map(month => (
                    <SelectItem key={month} value={month}>{month}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Payslips List */}
        <Card>
          <CardHeader>
            <CardTitle>Employee Payslips</CardTitle>
            <CardDescription>Manage uploaded payslips and send to employees</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredPayslips.map((payslip) => (
                <div key={payslip.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold">{payslip.employeeName}</h4>
                        <Badge variant="outline">{payslip.employeeId}</Badge>
                        <Badge variant={payslip.status === 'sent' ? 'default' : 'secondary'}>
                          {payslip.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Period: </span>
                          <span className="font-medium">{payslip.month} {payslip.year}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Gross: </span>
                          <span className="font-medium">{formatCurrency(payslip.grossSalary)}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Deductions: </span>
                          <span className="font-medium text-destructive">{formatCurrency(payslip.deductions)}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Net: </span>
                          <span className="font-medium text-success">{formatCurrency(payslip.netSalary)}</span>
                        </div>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">File: </span>
                        <span className="font-medium">{payslip.fileName}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Uploaded: </span>
                        <span>{new Date(payslip.uploadedDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 ml-4">
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      {payslip.status === 'uploaded' && (
                        <Button size="sm" onClick={() => handleSendPayslip(payslip.id)}>
                          <User className="h-4 w-4 mr-2" />
                          Send to Employee
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredPayslips.length === 0 && (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Payslips Found</h3>
                <p className="text-muted-foreground">No payslips match your current filters</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}