import { useState } from 'react';
import { Download, FileText, Calendar, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/layout/DashboardLayout';

interface Payslip {
  id: string;
  month: string;
  year: number;
  grossSalary: number;
  deductions: number;
  netSalary: number;
  generatedDate: string;
  status: 'generated' | 'downloaded';
}

export default function Payslips() {
  const { toast } = useToast();
  const [selectedYear, setSelectedYear] = useState('2024');
  
  const [payslips] = useState<Payslip[]>([
    {
      id: '1',
      month: 'January',
      year: 2024,
      grossSalary: 50000,
      deductions: 8000,
      netSalary: 42000,
      generatedDate: '2024-02-01',
      status: 'downloaded'
    },
    {
      id: '2',
      month: 'February',
      year: 2024,
      grossSalary: 50000,
      deductions: 8000,
      netSalary: 42000,
      generatedDate: '2024-03-01',
      status: 'generated'
    },
    {
      id: '3',
      month: 'March',
      year: 2024,
      grossSalary: 52000,
      deductions: 8500,
      netSalary: 43500,
      generatedDate: '2024-04-01',
      status: 'generated'
    },
    {
      id: '4',
      month: 'April',
      year: 2024,
      grossSalary: 52000,
      deductions: 8500,
      netSalary: 43500,
      generatedDate: '2024-05-01',
      status: 'generated'
    }
  ]);

  const handleDownload = (payslip: Payslip) => {
    // Simulate download
    toast({
      title: "Download Started",
      description: `Downloading payslip for ${payslip.month} ${payslip.year}`
    });
    
    // In a real app, you would trigger the actual download here
    console.log(`Downloading payslip for ${payslip.month} ${payslip.year}`);
  };

  const filteredPayslips = payslips.filter(payslip => 
    payslip.year.toString() === selectedYear
  );

  const yearStats = {
    totalGross: filteredPayslips.reduce((sum, payslip) => sum + payslip.grossSalary, 0),
    totalDeductions: filteredPayslips.reduce((sum, payslip) => sum + payslip.deductions, 0),
    totalNet: filteredPayslips.reduce((sum, payslip) => sum + payslip.netSalary, 0),
    avgGross: filteredPayslips.length ? filteredPayslips.reduce((sum, payslip) => sum + payslip.grossSalary, 0) / filteredPayslips.length : 0
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  return (
    <DashboardLayout requiredRole="employee">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Payslips</h1>
            <p className="text-muted-foreground">View and download your monthly payslips</p>
          </div>
          
          <div className="w-40">
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger>
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Year Summary */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold text-primary">{formatCurrency(yearStats.totalGross)}</p>
                  <p className="text-xs text-muted-foreground">Total Gross Salary</p>
                </div>
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold text-destructive">{formatCurrency(yearStats.totalDeductions)}</p>
                  <p className="text-xs text-muted-foreground">Total Deductions</p>
                </div>
                <DollarSign className="h-5 w-5 text-destructive" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold text-success">{formatCurrency(yearStats.totalNet)}</p>
                  <p className="text-xs text-muted-foreground">Total Net Salary</p>
                </div>
                <DollarSign className="h-5 w-5 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold text-accent">{formatCurrency(yearStats.avgGross)}</p>
                  <p className="text-xs text-muted-foreground">Average Gross Salary</p>
                </div>
                <DollarSign className="h-5 w-5 text-accent" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payslips List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Monthly Payslips - {selectedYear}</span>
            </CardTitle>
            <CardDescription>Click to download your payslips</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {filteredPayslips.map((payslip) => (
                <div key={payslip.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold">{payslip.month} {payslip.year}</h4>
                        <Badge variant={payslip.status === 'downloaded' ? 'default' : 'secondary'}>
                          {payslip.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
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
                      <p className="text-xs text-muted-foreground">
                        Generated on: {new Date(payslip.generatedDate).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <Button onClick={() => handleDownload(payslip)}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {filteredPayslips.length === 0 && (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Payslips Found</h3>
                <p className="text-muted-foreground">No payslips available for {selectedYear}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}