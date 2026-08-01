import { Navigate, createBrowserRouter } from 'react-router-dom';
import { ProtectedRoute, RoleGuard } from '@/components/common/RouteGuards';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { StudentLayout } from '@/components/layout/StudentLayout';
import { ForbiddenPage, FuturePhasePage, NotFoundPage } from '@/app/SystemPages';
import type { UserRole } from '@/shared/types/user';

const studentShell = (
  <ProtectedRoute>
    <RoleGuard roles={['STUDENT']}>
      <StudentLayout />
    </RoleGuard>
  </ProtectedRoute>
);
const futureRolePage = (area: 'Đối tác' | 'Kiểm duyệt' | 'Quản trị', role: UserRole) => (
  <ProtectedRoute>
    <RoleGuard roles={[role]}>
      <FuturePhasePage area={area} />
    </RoleGuard>
  </ProtectedRoute>
);
const routeFallback = (
  <div className="text-muted-500 grid min-h-64 place-items-center font-semibold" role="status">
    Đang chuẩn bị nội dung...
  </div>
);

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      {
        index: true,
        hydrateFallbackElement: routeFallback,
        lazy: async () => ({
          Component: (await import('@/features/opportunities/pages/HomePage')).HomePage,
        }),
      },
      {
        path: 'opportunities',
        hydrateFallbackElement: routeFallback,
        lazy: async () => ({
          Component: (await import('@/features/opportunities/pages/OpportunitiesPage'))
            .OpportunitiesPage,
        }),
      },
      {
        path: 'opportunities/:opportunityId',
        hydrateFallbackElement: routeFallback,
        lazy: async () => ({
          Component: (await import('@/features/opportunities/pages/OpportunityDetailPage'))
            .OpportunityDetailPage,
        }),
      },
      {
        path: 'about',
        hydrateFallbackElement: routeFallback,
        lazy: async () => ({
          Component: (await import('@/features/opportunities/pages/AboutPage')).AboutPage,
        }),
      },
    ],
  },
  {
    path: '/login',
    hydrateFallbackElement: routeFallback,
    lazy: async () => ({
      Component: (await import('@/features/authentication/pages/LoginPage')).LoginPage,
    }),
  },
  {
    path: '/register',
    hydrateFallbackElement: routeFallback,
    lazy: async () => ({
      Component: (await import('@/features/authentication/pages/RegisterPage')).RegisterPage,
    }),
  },
  {
    path: '/forgot-password',
    hydrateFallbackElement: routeFallback,
    lazy: async () => ({
      Component: (await import('@/features/authentication/pages/RecoveryPages')).ForgotPasswordPage,
    }),
  },
  {
    path: '/verify-email',
    hydrateFallbackElement: routeFallback,
    lazy: async () => ({
      Component: (await import('@/features/authentication/pages/RecoveryPages')).VerifyEmailPage,
    }),
  },
  {
    path: '/student',
    element: studentShell,
    children: [
      { index: true, element: <Navigate replace to="dashboard" /> },
      {
        path: 'dashboard',
        hydrateFallbackElement: routeFallback,
        lazy: async () => ({
          Component: (await import('@/features/student-profile/pages/StudentDashboardPage'))
            .StudentDashboardPage,
        }),
      },
      {
        path: 'saved-opportunities',
        hydrateFallbackElement: routeFallback,
        lazy: async () => ({
          Component: (await import('@/features/saved-opportunities/pages/SavedOpportunitiesPage'))
            .SavedOpportunitiesPage,
        }),
      },
      {
        path: 'notifications',
        hydrateFallbackElement: routeFallback,
        lazy: async () => ({
          Component: (await import('@/features/notifications/pages/NotificationsPage'))
            .NotificationsPage,
        }),
      },
      {
        path: 'profile',
        hydrateFallbackElement: routeFallback,
        lazy: async () => ({
          Component: (await import('@/features/student-profile/pages/ProfilePage')).ProfilePage,
        }),
      },
      {
        path: 'settings',
        hydrateFallbackElement: routeFallback,
        lazy: async () => ({
          Component: (await import('@/features/student-profile/pages/SettingsPage')).SettingsPage,
        }),
      },
    ],
  },
  { path: '/partner', element: futureRolePage('Đối tác', 'PARTNER') },
  { path: '/partner/*', element: futureRolePage('Đối tác', 'PARTNER') },
  { path: '/moderator', element: futureRolePage('Kiểm duyệt', 'MODERATOR') },
  { path: '/moderator/*', element: futureRolePage('Kiểm duyệt', 'MODERATOR') },
  { path: '/admin', element: futureRolePage('Quản trị', 'ADMINISTRATOR') },
  { path: '/admin/*', element: futureRolePage('Quản trị', 'ADMINISTRATOR') },
  { path: '/403', element: <ForbiddenPage /> },
  { path: '/404', element: <NotFoundPage /> },
  { path: '*', element: <NotFoundPage /> },
]);
