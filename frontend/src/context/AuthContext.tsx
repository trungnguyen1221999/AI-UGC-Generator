import { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  user: any;
  setUser: (user: any) => void;
  isAuthenticated: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const isAuthenticated = !!user;

  const logout = () => {
    setUser(null);
    // Xử lý thêm nếu cần
  };

  return (
    <AuthContext.Provider value={{ user, setUser, isAuthenticated, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
