import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Simple localStorage-based auth (replace with real backend later)
const STORAGE_KEY = 'earthion_auth';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check for existing session on load
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const userData = JSON.parse(stored);
        setUser(userData);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    setError(null);
    setIsLoading(true);
    
    try {
      // TODO: Replace with actual API call
      // const res = await api.post('/auth/login', { username, password });
      
      // Mock login for now - validate against stored users
      const storedUsers = JSON.parse(localStorage.getItem('earthion_users') || '[]');
      const foundUser = storedUsers.find((u: User & { password: string }) => 
        u.username === username && u.password === password
      );
      
      if (!foundUser) {
        throw new Error('Invalid username or password');
      }
      
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userWithoutPassword));
    } catch (e) {
      const err = e as Error;
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (username: string, email: string, password: string) => {
    setError(null);
    setIsLoading(true);
    
    try {
      // TODO: Replace with actual API call
      // const res = await api.post('/auth/register', { username, email, password });
      
      // Mock registration - store in localStorage
      const storedUsers = JSON.parse(localStorage.getItem('earthion_users') || '[]');
      
      // Check if username exists
      if (storedUsers.find((u: User) => u.username === username)) {
        throw new Error('Username already exists');
      }
      
      // Check if email exists
      if (storedUsers.find((u: User) => u.email === email)) {
        throw new Error('Email already registered');
      }
      
      const newUser = {
        id: crypto.randomUUID(),
        username,
        email,
        password, // In production, hash this!
      };
      
      storedUsers.push(newUser);
      localStorage.setItem('earthion_users', JSON.stringify(storedUsers));
      
      // Auto-login after registration
      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userWithoutPassword));
    } catch (e) {
      const err = e as Error;
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      register,
      logout,
      error,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}