import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Login from "./pages/Login";
import EmployeeDashboard from "./pages/dashboards/EmployeeDashboard";
import HRDashboard from "./pages/dashboards/HRDashboard";
import AdminDashboard from "./pages/dashboards/AdminDashboard";
import NotFound from "./pages/NotFound";

// Employee pages
import EmployeeTasks from "./pages/employee/Tasks";
import EmployeeHolidays from "./pages/employee/Holidays";
import EmployeeLeaveRequests from "./pages/employee/LeaveRequests";
import EmployeePayslips from "./pages/employee/Payslips";
import EmployeeTickets from "./pages/employee/Tickets";

// HR pages
import HRLeaveApprovals from "./pages/hr/LeaveApprovals";
import HRPayslipUpload from "./pages/hr/PayslipUpload";
import HRTickets from "./pages/hr/Tickets";

// Admin pages
import AdminLeaveOversight from "./pages/admin/LeaveOversight";
import AdminHolidayManagement from "./pages/admin/HolidayManagement";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<Login />} />
              
              {/* Employee Routes */}
              <Route path="/dashboard/employee" element={<EmployeeDashboard />} />
              <Route path="/dashboard/employee/tasks" element={<EmployeeTasks />} />
              <Route path="/dashboard/employee/holidays" element={<EmployeeHolidays />} />
              <Route path="/dashboard/employee/leave" element={<EmployeeLeaveRequests />} />
              <Route path="/dashboard/employee/payslips" element={<EmployeePayslips />} />
              <Route path="/dashboard/employee/tickets" element={<EmployeeTickets />} />
              
              {/* HR Routes */}
              <Route path="/dashboard/hr" element={<HRDashboard />} />
              <Route path="/dashboard/hr/leave-approvals" element={<HRLeaveApprovals />} />
              <Route path="/dashboard/hr/payslips" element={<HRPayslipUpload />} />
              <Route path="/dashboard/hr/holidays" element={<EmployeeHolidays />} />
              <Route path="/dashboard/hr/tickets" element={<HRTickets />} />
              
              {/* Admin Routes */}
              <Route path="/dashboard/admin" element={<AdminDashboard />} />
              <Route path="/dashboard/admin/leave-oversight" element={<AdminLeaveOversight />} />
              <Route path="/dashboard/admin/holidays" element={<AdminHolidayManagement />} />
              <Route path="/dashboard/admin/payslips" element={<HRPayslipUpload />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
