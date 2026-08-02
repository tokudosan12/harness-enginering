import {
  BarChart3,
  Bell,
  Building2,
  ClipboardCheck,
  FilePlus2,
  FileText,
  FolderKanban,
  LayoutDashboard,
  ListChecks,
  LogOut,
  Menu,
  Search,
  Settings2,
  ShieldCheck,
  Tags,
  UsersRound,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { BrandLogo } from '@/components/common/BrandLogo';
import { cn } from '@/lib/cn';
import type { UserRole } from '@/shared/types/user';
import { useAuthStore } from '@/stores/authStore';
import { useOperationsStore } from '@/stores/operationsStore';

type WorkspaceRole = Exclude<UserRole, 'STUDENT'>;

const workspaceConfig = {
  PARTNER: {
    label: 'Đối tác',
    shortLabel: 'Partner',
    nav: [
      { label: 'Tổng quan', to: '/partner/dashboard', icon: LayoutDashboard },
      { label: 'Bài đăng', to: '/partner/posts', icon: FolderKanban },
      { label: 'Tạo cơ hội mới', to: '/partner/posts/new', icon: FilePlus2 },
      { label: 'Hồ sơ tổ chức', to: '/partner/organization', icon: Building2 },
    ],
  },
  MODERATOR: {
    label: 'Kiểm duyệt',
    shortLabel: 'Moderator',
    nav: [
      { label: 'Hàng chờ duyệt', to: '/moderator/review-queue', icon: ClipboardCheck },
      { label: 'Báo cáo nội dung', to: '/moderator/reports', icon: ShieldCheck },
      { label: 'Lịch sử xử lý', to: '/moderator/history', icon: ListChecks },
    ],
  },
  ADMINISTRATOR: {
    label: 'Quản trị',
    shortLabel: 'Admin',
    nav: [
      { label: 'Tổng quan hệ thống', to: '/admin/dashboard', icon: LayoutDashboard },
      { label: 'Người dùng & quyền', to: '/admin/users', icon: UsersRound },
      { label: 'Danh mục', to: '/admin/categories', icon: Tags },
      { label: 'Nhật ký hệ thống', to: '/admin/audit', icon: FileText },
      { label: 'Báo cáo vận hành', to: '/admin/reports', icon: BarChart3 },
      { label: 'Cấu hình', to: '/admin/settings', icon: Settings2 },
    ],
  },
} as const;

export function WorkspaceLayout({ role }: { role: WorkspaceRole }) {
  const [isOpen, setIsOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const reports = useOperationsStore((state) => state.reports);
  const posts = useOperationsStore((state) => state.posts);
  const config = workspaceConfig[role];
  const location = useLocation();
  const current = config.nav.find((item) => location.pathname.startsWith(item.to));
  const count =
    role === 'MODERATOR'
      ? posts.filter((post) => post.status === 'PENDING_REVIEW').length +
        reports.filter((report) => report.status === 'OPEN').length
      : 0;

  const doLogout = () => {
    logout();
    window.location.replace('/');
  };

  return (
    <div className={cn('workspace-shell', `workspace-${role.toLowerCase()}`)}>
      <a className="skip-link" href="#workspace-main">
        Bỏ qua điều hướng
      </a>
      <aside className={cn('workspace-sidebar', isOpen && 'workspace-sidebar-open')}>
        <div className="workspace-brand-row">
          <BrandLogo />
          <button
            aria-label="Đóng menu"
            className="mobile-menu-button lg:hidden"
            onClick={() => setIsOpen(false)}
            type="button"
          >
            <X />
          </button>
        </div>
        <div className="workspace-role-label">
          <span>{config.shortLabel}</span>
          <strong>{config.label}</strong>
        </div>
        <nav aria-label={`Điều hướng ${config.label}`} className="workspace-nav">
          {config.nav.map(({ icon: Icon, ...item }) => (
            <NavLink
              className={({ isActive }) =>
                cn('workspace-nav-link', isActive && 'workspace-nav-link-active')
              }
              key={item.to}
              onClick={() => setIsOpen(false)}
              to={item.to}
            >
              <Icon aria-hidden="true" size={19} />
              <span>{item.label}</span>
              {role === 'MODERATOR' && item.to === '/moderator/review-queue' && count > 0 ? (
                <span className="workspace-nav-count">{count}</span>
              ) : null}
            </NavLink>
          ))}
        </nav>
        <div className="workspace-help-card">
          <strong>Trung tâm hỗ trợ</strong>
          <p>Tra cứu quy trình, tiêu chuẩn nội dung và hướng dẫn vận hành.</p>
          <a href="mailto:support@studenthub.vn">Liên hệ hỗ trợ</a>
        </div>
        <button className="workspace-nav-link workspace-logout" onClick={doLogout} type="button">
          <LogOut size={19} /> Đăng xuất
        </button>
      </aside>
      {isOpen ? (
        <button
          aria-label="Đóng lớp phủ menu"
          className="sidebar-backdrop"
          onClick={() => setIsOpen(false)}
          type="button"
        />
      ) : null}
      <div className="workspace-content">
        <header className="workspace-topbar">
          <button
            aria-label="Mở menu"
            className="mobile-menu-button lg:hidden"
            onClick={() => setIsOpen(true)}
            type="button"
          >
            <Menu />
          </button>
          <div className="workspace-breadcrumb">
            <span>{config.label}</span>
            <strong>{current?.label ?? config.nav[0].label}</strong>
          </div>
          <div className="workspace-search" aria-label="Tìm kiếm nhanh">
            <Search size={17} />
            <span>Tìm trong khu vực {config.label.toLowerCase()}...</span>
          </div>
          <button className="workspace-icon-button" aria-label="Thông báo" type="button">
            <Bell size={20} />
            {count > 0 ? <span>{count}</span> : null}
          </button>
          <div className="workspace-user">
            <div className="workspace-avatar">{user?.name.slice(0, 1) ?? 'U'}</div>
            <div>
              <strong>{user?.name ?? config.label}</strong>
              <span>{user?.email}</span>
            </div>
          </div>
        </header>
        <main className="workspace-main" id="workspace-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
