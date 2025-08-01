import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'employee' | 'hr' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  teamLead?: string;
  hrManager?: string;
  department?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data
const mockUsers: Record<string, User> = {
  'employee@company.com': {
    id: '1',
    email: 'employee@company.com',
    name: 'John Smith',
    role: 'employee',
    teamLead: 'hr@company.com',
    hrManager: 'hr@company.com',
    department: 'Engineering'
  },
  'hr@company.com': {
    id: '2',
    email: 'hr@company.com',
    name: 'Sarah Johnson',
    role: 'hr',
    department: 'Human Resources'
  },
  'admin@company.com': {
    id: '3',
    email: 'admin@company.com',
    name: 'Michael Brown',
    role: 'admin',
    department: 'Administration'
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user on app load
    const storedUser = localStorage.getItem('ems_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers[email];
    
    if (foundUser && foundUser.role === role && password === 'password') {
      setUser(foundUser);
      localStorage.setItem('ems_user', JSON.stringify(foundUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ems_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}