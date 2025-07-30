import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireRole?: 'citizen' | 'admin';
}

export default function ProtectedRoute({ 
  children, 
  requireAuth = true, 
  requireRole 
}: ProtectedRouteProps) {
  const { user, userRole, isAdminSession, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (requireAuth && !user) {
    return <Navigate to="/auth" replace />;
  }

  if (requireRole === 'admin' && !isAdminSession) {
    return <Navigate to="/" replace />;
  }
  
  if (requireRole === 'citizen' && userRole !== 'citizen') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}