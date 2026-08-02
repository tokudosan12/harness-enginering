import { Navigate, createBrowserRouter } from 'react-router-dom';
import { ProtectedRoute, RoleGuard } from '@/components/common/RouteGuards';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { StudentLayout } from '@/components/layout/StudentLayout';
import { WorkspaceLayout } from '@/components/layout/WorkspaceLayout';
import { ForbiddenPage, NotFoundPage } from '@/app/SystemPages';

const studentShell = (
  <ProtectedRoute>
    <RoleGuard roles={['STUDENT']}>
      <StudentLayout />
    </RoleGuard>
  </ProtectedRoute>
);
const partnerShell = (
  <ProtectedRoute>
    <RoleGuard roles={['PARTNER']}>
      <WorkspaceLayout role="PARTNER" />
    </RoleGuard>
  </ProtectedRoute>
);
const moderatorShell = (
  <ProtectedRoute>
    <RoleGuard roles={['MODERATOR']}>
      <WorkspaceLayout role="MODERATOR" />
    </RoleGuard>
  </ProtectedRoute>
);
const adminShell = (
  <ProtectedRoute>
    <RoleGuard roles={['ADMINISTRATOR']}>
      <WorkspaceLayout role="ADMINISTRATOR" />
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
  {
    path: '/partner',
    element: partnerShell,
    children: [
      { index: true, element: <Navigate replace to="dashboard" /> },
      {
        path: 'dashboard',
        hydrateFallbackElement: routeFallback,
        lazy: async () => ({
          Component: (await import('@/features/partner/pages/PartnerDashboardPage'))
            .PartnerDashboardPage,
        }),
      },
      {
        path: 'posts',
        hydrateFallbackElement: routeFallback,
        lazy: async () => ({
          Component: (await import('@/features/partner/pages/PartnerPostsPage')).PartnerPostsPage,
        }),
      },
      {
        path: 'posts/new',
        hydrateFallbackElement: routeFallback,
        lazy: async () => ({
          Component: (await import('@/features/partner/pages/PartnerPostEditorPage'))
            .PartnerPostEditorPage,
        }),
      },
      {
        path: 'posts/:postId/edit',
        hydrateFallbackElement: routeFallback,
        lazy: async () => ({
          Component: (await import('@/features/partner/pages/PartnerPostEditorPage'))
            .PartnerPostEditorPage,
        }),
      },
      {
        path: 'organization',
        hydrateFallbackElement: routeFallback,
        lazy: async () => ({
          Component: (await import('@/features/partner/pages/OrganizationPage')).OrganizationPage,
        }),
      },
    ],
  },
  {
    path: '/moderator',
    element: moderatorShell,
    children: [
      { index: true, element: <Navigate replace to="review-queue" /> },
      {
        path: 'review-queue',
        hydrateFallbackElement: routeFallback,
        lazy: async () => ({
          Component: (await import('@/features/moderation/pages/ModerationQueuePage'))
            .ModerationQueuePage,
        }),
      },
      {
        path: 'review/:postId',
        hydrateFallbackElement: routeFallback,
        lazy: async () => ({
          Component: (await import('@/features/moderation/pages/ModerationReviewPage'))
            .ModerationReviewPage,
        }),
      },
      {
        path: 'reports',
        hydrateFallbackElement: routeFallback,
        lazy: async () => ({
          Component: (await import('@/features/moderation/pages/ModerationReportsPage'))
            .ModerationReportsPage,
        }),
      },
      {
        path: 'history',
        hydrateFallbackElement: routeFallback,
        lazy: async () => ({
          Component: (await import('@/features/moderation/pages/ModerationHistoryPage'))
            .ModerationHistoryPage,
        }),
      },
    ],
  },
  {
    path: '/admin',
    element: adminShell,
    children: [
      { index: true, element: <Navigate replace to="dashboard" /> },
      {
        path: 'dashboard',
        hydrateFallbackElement: routeFallback,
        lazy: async () => ({
          Component: (await import('@/features/administration/pages/AdminDashboardPage'))
            .AdminDashboardPage,
        }),
      },
      {
        path: 'users',
        hydrateFallbackElement: routeFallback,
        lazy: async () => ({
          Component: (await import('@/features/administration/pages/AdminUsersPage'))
            .AdminUsersPage,
        }),
      },
      {
        path: 'categories',
        hydrateFallbackElement: routeFallback,
        lazy: async () => ({
          Component: (await import('@/features/administration/pages/AdminCategoriesPage'))
            .AdminCategoriesPage,
        }),
      },
      {
        path: 'audit',
        hydrateFallbackElement: routeFallback,
        lazy: async () => ({
          Component: (await import('@/features/administration/pages/AdminAuditPage'))
            .AdminAuditPage,
        }),
      },
      {
        path: 'reports',
        hydrateFallbackElement: routeFallback,
        lazy: async () => ({
          Component: (await import('@/features/administration/pages/AdminReportsPage'))
            .AdminReportsPage,
        }),
      },
      {
        path: 'settings',
        hydrateFallbackElement: routeFallback,
        lazy: async () => ({
          Component: (await import('@/features/administration/pages/AdminSettingsPage'))
            .AdminSettingsPage,
        }),
      },
    ],
  },
  { path: '/403', element: <ForbiddenPage /> },
  { path: '/404', element: <NotFoundPage /> },
  { path: '*', element: <NotFoundPage /> },
]);
