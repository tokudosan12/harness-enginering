# Kế hoạch triển khai frontend

## Công nghệ

React 19, TypeScript strict, Vite, Tailwind CSS 4, React Router DOM, TanStack Query, React Hook Form, Zod, Zustand, Lucide React, date-fns, ESLint và Prettier. Giai đoạn đầu dùng mock services có độ trễ mô phỏng và localStorage; không kết nối API thật.

## Cấu trúc thư mục

`src/app` chứa router/providers; `src/components` chứa UI/layout/feedback dùng chung; `src/features` chia theo authentication, opportunities, saved-opportunities, notifications, student-profile và future roles; `src/mocks` chứa dữ liệu/service; `src/shared` chứa constants/types/utils; `src/stores` chứa Zustand; `src/styles` chứa token và global styles.

## Giai đoạn phát triển

1. UI-01: setup, router, providers, token, type, mock data, layout và error handling.
2. UI-02: homepage, danh sách, search/filter/sort, chi tiết và external-link warning.
3. UI-03: login, register, forgot password, verify email, ProtectedRoute và RoleGuard.
4. UI-04: StudentLayout, dashboard, saved opportunities, notifications, profile và settings.
5. UI-05: placeholder có chủ đích cho Partner, Moderator và Admin; QA responsive/a11y.

## Trang theo ưu tiên

- P0: `/`, `/opportunities`, `/opportunities/:opportunityId`, `/login`, `/register`.
- P1: `/forgot-password`, `/verify-email`, `/student/dashboard`, `/student/saved-opportunities`.
- P2: `/student/notifications`, `/student/profile`, `/student/settings`, `/about`.
- Future: toàn bộ route Partner, Moderator, Admin và trang audit/report chuyên sâu.

## Component dùng chung

AppHeader, AppFooter, PublicLayout, StudentLayout, PageContainer, PageHeader, Breadcrumbs, OpportunityCard, OpportunityGrid, OpportunityBadge, OpportunityStatusBadge, DeadlineBadge, SaveOpportunityButton, SearchInput, FilterPanel, FilterDrawer, ActiveFilterChips, SortDropdown, LoadingSpinner, CardSkeleton, EmptyState, ErrorState, AccessDeniedState, ConfirmDialog, ExternalLinkDialog, Toast, ProtectedRoute và RoleGuard.

## Dữ liệu mock

- 28 opportunities, tối thiểu 4 bản ghi cho mỗi category.
- Có OPEN/EXPIRED/CLOSED, featured, mới đăng, gần hạn và nhiều participation mode.
- 4 tài khoản role mock; profile, notification và saved state lưu localStorage.
- Service trả Promise với latency nhỏ để TanStack Query thể hiện loading/error.

## API dự kiến

`/auth/*`, `/opportunities`, `/opportunities/:id`, `/users/me`, `/users/me/saved`, `/users/me/notifications`, `/users/me/preferences`, `/partner/posts`, `/moderation/queue`, `/admin/users`, `/admin/categories`, `/reports`. Contract cần phân trang, filter query, idempotency key, error envelope và RBAC phía server.

## Rủi ro kỹ thuật

- Mock auth chỉ phục vụ demo, không đại diện cho session bảo mật thật.
- LocalStorage có thể cũ hoặc bị sửa; store cần version và migration khi tích hợp backend.
- Dữ liệu ngày phụ thuộc timezone; API cần trả ISO rõ timezone.
- Search client-side không đại diện hiệu năng/kết quả search backend.
- Hình ảnh remote có thể chậm; production cần CDN và kích thước responsive.
- Role guard frontend không thay thế authorization phía server.

## Definition of Done

- Route chính có normal/loading/empty/error và no-permission khi phù hợp.
- Search/filter/sort/save/auth/profile/notifications hoạt động với mock data.
- Không có lỗi TypeScript, ESLint, broken import hoặc build.
- Responsive kiểm tra ở 360, 768, 1024 và 1440px; keyboard/focus/label cơ bản đạt yêu cầu.
- Không dùng `any`, `@ts-ignore` hoặc `eslint-disable` để che lỗi.
- README, `.env.example`, docs và danh sách route được cập nhật.
