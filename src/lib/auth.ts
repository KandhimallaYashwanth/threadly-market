
import { UserRole } from './types';
import { toast } from 'sonner';

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return localStorage.getItem('user') !== null;
};

// Get current user
export const getCurrentUser = (): any | null => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Force login
export const requireAuth = (navigate: any, targetPath: string = '/auth'): boolean => {
  if (!isAuthenticated()) {
    toast.error("Authentication required", {
      description: "Please log in to continue."
    });
    navigate(targetPath, { state: { from: window.location.pathname } });
    return false;
  }
  return true;
};

// Check if user has a specific role
export const hasRole = (role: UserRole): boolean => {
  const user = getCurrentUser();
  return user && user.role === role;
};

// Redirect based on user role
export const redirectBasedOnRole = (navigate: any): void => {
  const user = getCurrentUser();
  
  if (!user) return;
  
  switch (user.role) {
    case UserRole.CUSTOMER:
      navigate('/dashboard/customer');
      break;
    case UserRole.WEAVER:
      navigate('/dashboard/weaver');
      break;
    case UserRole.ADMIN:
      navigate('/dashboard/admin');
      break;
    default:
      navigate('/');
  }
};
