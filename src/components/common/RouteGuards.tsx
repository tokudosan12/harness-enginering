import type { PropsWithChildren } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import type { UserRole } from '@/shared/types/user';
import { useAuthStore } from '@/stores/authStore';

export function ProtectedRoute({ children }: PropsWithChildren) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const location = useLocation();
  if (!isAuthenticated)
    return (
      <Navigate
        replace
        state={{ from: location }}
        to={`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`}
      />
    );
  return children;
}

export function RoleGuard({ roles, children }: PropsWithChildren<{ roles: UserRole[] }>) {
  const user = useAuthStore((state) => state.user);
  if (!user || !roles.includes(user.role)) return <Navigate replace to="/403" />;
  return children;
}
