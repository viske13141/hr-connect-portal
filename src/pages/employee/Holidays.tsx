import { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import DashboardLayout from '@/components/layout/DashboardLayout';

interface Holiday {
  id: string;
  name: string;
  date: string;
  type: 'national' | 'religious' | 'company';
  description?: string;
}

export default function Holidays() {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const holidays: Holiday[] = [
    { id: '1', name: 'New Year\'s Day', date: '2024-01-01', type: 'national', description: 'Start of the new year' },
    { id: '2', name: 'Independence Day', date: '2024-08-15', type: 'national', description: 'National holiday' },
    { id: '3', name: 'Gandhi Jayanti', date: '2024-10-02', type: 'national', description: 'Birth anniversary of Mahatma Gandhi' },
    { id: '4', name: 'Diwali', date: '2024-11-01', type: 'religious', description: 'Festival of lights' },
    { id: '5', name: 'Christmas', date: '2024-12-25', type: 'religious', description: 'Christmas Day' },
    { id: '6', name: 'Company Anniversary', date: '2024-09-15', type: 'company', description: 'Company founding day' }
  ];

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  
  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const isHoliday = (day: number) => {
    const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return holidays.find(holiday => holiday.date === dateString);
  };

  const getHolidayTypeColor = (type: Holiday['type']) => {
    switch (type) {
      case 'national': return 'bg-destructive text-destructive-foreground';
      case 'religious': return 'bg-warning text-warning-foreground';
      case 'company': return 'bg-primary text-primary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const upcomingHolidays = holidays
    .filter(holiday => new Date(holiday.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  return (
    <DashboardLayout requiredRole="employee">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Holidays</h1>
          <p className="text-muted-foreground">View company holidays and plan your time off</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5" />
                    <span>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
                  </CardTitle>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
                      {day}
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-7 gap-2">
                  {/* Empty cells for days before the first day of month */}
                  {Array.from({ length: firstDayOfMonth }, (_, i) => (
                    <div key={`empty-${i}`} className="p-2" />
                  ))}
                  
                  {/* Days of the month */}
                  {Array.from({ length: daysInMonth }, (_, i) => {
                    const day = i + 1;
                    const holiday = isHoliday(day);
                    const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
                    
                    return (
                      <div
                        key={day}
                        className={`p-2 text-center text-sm rounded-lg transition-colors ${
                          isToday ? 'bg-primary text-primary-foreground font-semibold' :
                          holiday ? 'bg-destructive/10 text-destructive font-medium' :
                          'hover:bg-muted'
                        }`}
                      >
                        <div className="relative">
                          {day}
                          {holiday && (
                            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-destructive rounded-full" />
                          )}
                        </div>
                        {holiday && (
                          <div className="text-xs mt-1 truncate">{holiday.name}</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Holidays */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Holidays</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingHolidays.map(holiday => (
                    <div key={holiday.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{holiday.name}</h4>
                        <Badge className={getHolidayTypeColor(holiday.type)}>
                          {holiday.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {new Date(holiday.date).toLocaleDateString('en-US', { 
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                      {holiday.description && (
                        <p className="text-xs text-muted-foreground">{holiday.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Holiday Legend */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg">Holiday Types</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-destructive text-destructive-foreground">National</Badge>
                    <span className="text-sm">Government holidays</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-warning text-warning-foreground">Religious</Badge>
                    <span className="text-sm">Religious festivals</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-primary text-primary-foreground">Company</Badge>
                    <span className="text-sm">Company-specific holidays</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}