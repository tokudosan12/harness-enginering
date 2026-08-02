# Student Opportunity Hub

Frontend React cho “Bảng tin Cơ hội Sinh viên” — nơi tập trung các cơ hội thực tập, việc làm startup, cuộc thi đổi mới, hackathon, học bổng, quỹ đầu tư và chương trình ươm tạo.

## Mục tiêu

Giúp sinh viên tìm, lọc, hiểu, lưu và theo dõi cơ hội đáng tin cậy; chuẩn bị kiến trúc giao diện cho quy trình Partner, Moderator và Administrator ở giai đoạn sau.

## Phạm vi MVP frontend

- Bảng tin công khai, tìm kiếm/filter/sort theo URL, chi tiết và cảnh báo liên kết ngoài.
- Đăng ký, đăng nhập theo role, quên mật khẩu và xác minh email dạng mock.
- Student dashboard, saved opportunities, reminder, notifications, profile và settings.
- Workspace hoàn chỉnh cho Partner, Moderator và Admin với RBAC frontend.
- Không có backend, database, thanh toán hoặc nộp CV nội bộ.

## Công nghệ

React 19, TypeScript strict, Vite, Tailwind CSS 4, React Router DOM, TanStack Query, React Hook Form, Zod, Zustand, Lucide React, date-fns, ESLint và Prettier.

## Yêu cầu môi trường

- Node.js 20+
- npm 11+
- Visual Studio Code (bản màu xanh)

## Cài đặt và chạy development

```powershell
cd D:\Student-Opportunity-Hub
Copy-Item .env.example .env
npm install
npm run dev
```

Mặc định Vite chạy tại `http://127.0.0.1:5173`.

## Build production, lint và format

```powershell
npm run lint
npm run build
npm run preview
npm run format:check
```

## Cấu trúc folder

```text
docs/                       Phân tích BRD/PRD và concept
public/assets/              Asset tĩnh production
src/app/                    App, router, providers, route config
src/components/             Common, layout, feedback, UI
src/features/               Code chia theo nghiệp vụ
src/lib/                    Tiện ích chung
src/mocks/data/             28 cơ hội mẫu
src/mocks/services/         Mock API có latency
src/shared/                 Constant và type dùng chung
src/stores/                 Zustand persist stores
src/styles/                 Token và stylesheet theo surface
```

## Danh sách route

Public: `/`, `/opportunities`, `/opportunities/:opportunityId`, `/about`, `/login`, `/register`, `/forgot-password`, `/verify-email`.

Student: `/student`, `/student/dashboard`, `/student/saved-opportunities`, `/student/notifications`, `/student/profile`, `/student/settings`.

Partner: `/partner/dashboard`, `/partner/posts`, `/partner/posts/new`, `/partner/posts/:postId/edit`, `/partner/organization`.

Moderator: `/moderator/review-queue`, `/moderator/review/:postId`, `/moderator/reports`, `/moderator/history`.

Admin: `/admin/dashboard`, `/admin/users`, `/admin/categories`, `/admin/audit`, `/admin/reports`, `/admin/settings`.

System: `/403`, `/404`, `/*`.

## Tài khoản mock

| Vai trò       | Email                   | Mật khẩu        |
| ------------- | ----------------------- | --------------- |
| Student       | `student@example.com`   | `Student@123`   |
| Partner       | `partner@example.com`   | `Partner@123`   |
| Moderator     | `moderator@example.com` | `Moderator@123` |
| Administrator | `admin@example.com`     | `Admin@123`     |

## Mock data

File `src/mocks/data/opportunities.ts` có 28 bản ghi, đúng 4 bản ghi cho mỗi category. Dữ liệu gồm trạng thái OPEN/EXPIRED/CLOSED, online/offline/hybrid, featured, gần hạn và nhiều lĩnh vực/kỹ năng. Mock service chỉ trả bài `OPEN`, public và chưa quá hạn cho bảng tin.

## Chức năng đã hoàn thành

- UI-01 đến UI-05 cho Guest, Student, Partner, Moderator và Administrator.
- Search/filter/sort hoạt động, query state nằm trong URL.
- Save duy nhất theo opportunity, reminder, notification read/delete, profile/settings persist localStorage.
- Validation form bằng Zod; login điều hướng theo role.
- Loading, empty, error, disabled, not found và no-permission state.
- Responsive từ 360px, keyboard focus và semantic label cơ bản.

## Chức năng quản trị đã hoàn thành trong frontend mock

- Partner: dashboard, bài đăng, tạo/sửa/xem trước, lưu nháp, gửi duyệt, gửi lại sau chỉnh sửa, yêu cầu đóng và hồ sơ tổ chức.
- Moderator: review queue, chi tiết kiểm duyệt, cảnh báo trùng, phê duyệt, yêu cầu chỉnh sửa, từ chối, xử lý report và lịch sử.
- Admin: dashboard, user/role/status, category, audit log, cấu hình vòng đời, báo cáo và export CSV.
- Toàn bộ thao tác demo lưu trong `localStorage` và có thể test độc lập không cần backend.

## Giới hạn còn lại

- Chưa có backend/database, email và push notification thật.
- Analytics dùng dữ liệu mock; chưa có job kiểm tra link định kỳ hoặc export XLSX phía server.

## Quy tắc nghiệp vụ chính

Chỉ bài `OPEN`, public và chưa hết hạn xuất hiện công khai. Guest cần đăng nhập để lưu. Mỗi student chỉ lưu một lần cho một opportunity. Bài hết hạn/đóng không thể đăng ký. Link đăng ký mở nguồn chính thức sau cảnh báo. Role guard frontend không thay thế authorization backend.

## Kế hoạch tích hợp API

Giữ interface service hiện tại và thay mock implementation bằng HTTP client. API cần pagination/filter contract, session an toàn, RBAC server-side, idempotency cho save/submit, ISO timezone rõ ràng và error envelope thống nhất. TanStack Query tiếp tục quản lý cache/loading/error; Zustand chỉ giữ client preferences phù hợp.

## Hướng phát triển tiếp theo

1. Kết nối backend/API và session bảo mật cho các workflow đã hoàn thiện ở frontend.
2. Bổ sung test tự động, observability, email/push và job kiểm tra liên kết.
3. Thay analytics mock bằng dữ liệu thật và bổ sung export XLSX phía server.
4. Hardening RBAC, audit bất biến và rate limiting.

## Mở bằng Visual Studio Code

```powershell
code D:\Student-Opportunity-Hub
```

Không dùng Visual Studio solution và không có file `.sln`.

## Tài liệu dự án

- `docs/requirements-summary.md`
- `docs/implementation-plan.md`
- `docs/screen-inventory.md`
- `docs/design-system.md`
- `docs/BRD_PRD_Bang_tin_Co_hoi_Sinh_vien_REWRITE.docx` (bản sao chỉ đọc)

## Tài liệu Harness / AI coding agent

- `CLAUDE.md` — hướng dẫn cho Claude Code khi làm việc trong repo này (lệnh thường dùng, kiến trúc).
- `AGENTS.md` — chuẩn agents.md dùng chung cho mọi coding agent (Claude Code, Codex, Cursor, ...).
- `DESIGN.md` — thiết kế hệ thống: kiến trúc mock-first, mô hình dữ liệu, phân quyền, design system, giới hạn hiện tại và lộ trình lên backend thật.
- `.claude/` — cấu hình harness cục bộ (launch config cho dev server preview, permission settings).
